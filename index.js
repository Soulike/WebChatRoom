const CONFIG = require('./server/config');
const FUNCTION = require('./server/function');

const Koa = require('koa');
const app = new Koa();

const Io = require('koa-socket');
const io = new Io();
io.attach(app);

const redis = require("redis");
const client = redis.createClient();

const Promise = require("bluebird");
Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);

const {Pool} = require('pg');
const pool = new Pool(CONFIG.DATABASE_CONFIG);

const fs = require('fs');

const koa_static = require('koa-static');
const koa_helmet = require('koa-helmet');
const body = require('koa-body');

const route = require('koa-route');

app.use(koa_static('client/'));
app.use(koa_helmet());
app.use(body({multipart: true}));

setInterval(async function ()
{
	FUNCTION.socket_send(io, 'is_online', {});
	await FUNCTION.check_online(client, io, pool);
}, CONFIG.STATUS.CHECK_ONLINE_SECONDS * 1000);

FUNCTION.log(`主进程 ${process.pid} 启动`);

client.on('connect', async function ()
{
	await client.flushallAsync();
	FUNCTION.log('Redis 初始化完成');
});

client.on('error', function (error)
{
	FUNCTION.log(`Redis 错误，错误信息：\n${error.stack}`);
});

/**Socket**/
io.on('send_message', async function (ctx, data)
{
	const {account} = FUNCTION.COOKIE.parse(ctx.socket.socket.handshake.headers.cookie);
	const res = await FUNCTION.select_query(pool, ['nickname'], {account: account});
	const {nickname} = res.rows[0];

	const {font, bold, font_size, content} = ctx.data;

	const date = new Date();
	const send_time = `${date.getHours() < 10 ? '0' + date.getHours() : date.getHours()}时${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()}分`;

	const message = new CONFIG.MESSAGE(account, nickname, font, bold, font_size, content, send_time);
	FUNCTION.socket_send(io, 'receive_message', message);
});

io.on('online', async function (ctx, data)
{
	const {account} = FUNCTION.COOKIE.parse(ctx.socket.socket.handshake.headers.cookie);
	await client.hmsetAsync(account, {last_respond: Date.now()});
});

app.use(route.post('/register', async function (ctx, next)
{
	FUNCTION.log('收到用户注册请求');
	const {nickname, password} = ctx.request.body;
	try
	{
		if (nickname === undefined || !CONFIG.REG.NICKNAME.test(nickname))
		{
			ctx.body = new CONFIG.RESPONSE(false, '昵称不合法');
			FUNCTION.log(`注册失败：昵称不合法`);
		}
		else if (password === undefined || !CONFIG.REG.PASSWORD.test(password))
		{
			ctx.body = new CONFIG.RESPONSE(false, '密码不合法');
			FUNCTION.log(`注册失败：密码不合法`);
		}
		else
		{
			await FUNCTION.insert_query(pool, {nickname: nickname, password: password});
			const res = await FUNCTION.select_query(pool, ['account'], {nickname: nickname, password: password});
			const account = res.rows.pop().account;
			ctx.body = new CONFIG.RESPONSE(true, '注册成功', {account: account});
			FUNCTION.log(`用户注册成功，账号: ${account}`);
		}
	} catch (error)
	{
		ctx.body = new CONFIG.RESPONSE(false, CONFIG.ERROR_RESPONSE, {});
		FUNCTION.log(`注册失败，错误信息:\n${error.stack}`);
	}
	await next();
}));

app.use(route.post('/login', async function (ctx, next)
{
	const {account, password} = ctx.request.body;
	FUNCTION.log(`账号${account}尝试登录`);
	try
	{
		if (account === undefined || !CONFIG.REG.ACCOUNT.test(account))
		{
			ctx.body = new CONFIG.RESPONSE(false, '账号不存在');
			FUNCTION.log(`账号${account}登陆失败：账号不存在`);
		}
		else if (!CONFIG.REG.ACCOUNT.test(account))
		{
			ctx.body = new CONFIG.RESPONSE(false, '账号不存在');
			FUNCTION.log(`账号${account}登陆失败：账号不存在`);
		}
		else if (password === undefined || !CONFIG.REG.PASSWORD.test(password))
		{
			ctx.body = new CONFIG.RESPONSE(false, '密码错误');
			FUNCTION.log(`账号${account}登录失败：密码错误`);
		}
		else
		{
			const response = await FUNCTION.select_query(pool, ['password'], {account: account});
			if (response.rowCount === 0)
			{
				ctx.body = new CONFIG.RESPONSE(false, '账号不存在');
				FUNCTION.log(`账号${account}登陆失败：账号不存在`);
			}
			else if (((await client.scanAsync(0))[1]).indexOf(account) !== -1)
			{
				ctx.body = new CONFIG.RESPONSE(false, '账号已登录');
				FUNCTION.log(`账号${account}登陆失败：账号已登录`);
			}
			else
			{
				const right_password = response.rows[0].password;
				if (password === right_password)
				{
					ctx.body = new CONFIG.RESPONSE(true, '登陆成功');
					await ctx.cookies.set('account', account, {
						SameSite: 'Strict',
					});
					await FUNCTION.set_identify_cookie(ctx, account, password);
					await FUNCTION.set_status(client, account, CONFIG.STATUS.ONLINE, pool, io);
					FUNCTION.log(`账号${account}登陆成功`);
				}
				else
				{
					ctx.body = new CONFIG.RESPONSE(false, '密码错误');
					FUNCTION.log(`账号${account}登录失败：密码错误`);
				}
			}
		}
	} catch (error)
	{
		ctx.body = new CONFIG.RESPONSE(false, CONFIG.ERROR_RESPONSE);
		FUNCTION.log(`账号${account}登录失败。错误信息：\n${error.stack}`);
	}
	await next();
}));

app.use(route.post('/get_user_info', async function (ctx, next)
{
	const account = parseInt(ctx.cookies.get('account'));
	try
	{
		if (account === undefined || !FUNCTION.validate_cookie(ctx, pool))
			ctx.body = new CONFIG.RESPONSE(false, '登录状态异常');
		else
		{
			const res = await FUNCTION.select_query(pool, ['account', 'nickname', 'age', 'gender', 'customize_avatar', 'customize_background'], {account: account});
			if (res.rowCount === 0)
				ctx.body = new CONFIG.RESPONSE(false);
			else
			{
				await client.hmsetAsync(account, {status: CONFIG.STATUS.ONLINE, last_respond: Date.now()});
				const data = res.rows[0];
				ctx.body = new CONFIG.RESPONSE(true, '', data);
			}
		}
	} catch (error)
	{
		ctx.body = new CONFIG.RESPONSE(false, CONFIG.ERROR_RESPONSE);
		FUNCTION.log(`账户${account}获取信息失败，错误信息：\n${error.stack}`);
	}
	await next();
}));

app.use(route.post('/switch_status', async function (ctx, next)
{
	const account = ctx.cookies.get('account');
	const {status} = ctx.request.body;
	try
	{
		if (account === undefined || !FUNCTION.validate_cookie(ctx, pool))
			ctx.body = new CONFIG.RESPONSE(false, '登录状态异常');
		else
		{
			if (status === undefined)
				ctx.body = new CONFIG.RESPONSE(false, '参数错误');
			else
			{
				await FUNCTION.set_status(client, account, status, pool, io);
				ctx.body = new CONFIG.RESPONSE(true);
			}
		}
	} catch (error)
	{
		ctx.body = new CONFIG.RESPONSE(false);
		FUNCTION.log(`账号${account}更改状态失败。错误信息：\n${error.stack}`);
	}
	await next();
}));

app.use(route.post('/background_upload', async function (ctx, next)
{
	const background_path = 'client/images/backgrounds';
	const account = ctx.cookies.get('account');
	const file = ctx.request.body.files.file;
	const file_type = `${file.type.slice(6)}`;
	const file_path = `${background_path}/${account}.${file_type}`;
	try
	{
		if (account === undefined || !FUNCTION.validate_cookie(ctx, pool))
			ctx.body = new CONFIG.RESPONSE(false, '登录状态异常');
		else
		{
			await FUNCTION.clear_files(account, 'background');
			const reader = await fs.createReadStream(file.path);
			const writer = await fs.createWriteStream(file_path);
			await reader.pipe(writer);
			FUNCTION.update_query(pool, {customize_background: true}, {account: account});
			ctx.body = new CONFIG.RESPONSE(true, '背景更改成功', {account: account});
		}
	} catch (error)
	{
		FUNCTION.log(`账号${account}上传背景失败，错误信息：\n${error.stack}`);
		ctx.body = new CONFIG.RESPONSE(false, '上传失败，请重试');
	}
	await next();
}));

app.use(route.post('/avatar_upload', async function (ctx, next)
{
	const avatar_path = 'client/images/avatars';
	const account = ctx.cookies.get('account');
	const file = ctx.request.body.files.file;
	const file_type = `${file.type.slice(6)}`;
	const file_path = `${avatar_path}/${account}.${file_type}`;
	try
	{
		if (account === undefined || !FUNCTION.validate_cookie(ctx, pool))
			ctx.body = new CONFIG.RESPONSE(false, '登录状态异常');
		else
		{
			await FUNCTION.clear_files(account, 'avatar');
			const reader = await fs.createReadStream(file.path);
			const writer = await fs.createWriteStream(file_path);
			await reader.pipe(writer);
			FUNCTION.update_query(pool, {customize_avatar: true}, {account: account});
			ctx.body = new CONFIG.RESPONSE(true, '头像更改成功', {account: account});
			FUNCTION.socket_send(io, 'change_avatar', {account: account});
		}
	} catch (error)
	{
		FUNCTION.log(`账号${account}上传头像失败，错误信息：\n${error.stack}`);
		ctx.body = new CONFIG.RESPONSE(false, '上传失败，请重试');
	}
	await next();
}));

app.use(route.post('/modify_info', async function (ctx, next)
{
	const {nickname, age, gender} = ctx.request.body;
	const account = ctx.cookies.get('account');
	try
	{
		if (!FUNCTION.validate_cookie(ctx, pool))
			ctx.body = new CONFIG.RESPONSE(false, '登录状态异常');
		else
		{
			if (nickname === undefined || !CONFIG.REG.NICKNAME.test(nickname))
				ctx.body = new CONFIG.RESPONSE(false, '昵称非法');
			else if (age === undefined || !CONFIG.REG.AGE.test(age))
				ctx.body = new CONFIG.RESPONSE(false, '年龄非法');
			else if (typeof gender !== "boolean")
				ctx.body = new CONFIG.RESPONSE(false, '性别非法');
			else
			{
				await FUNCTION.update_query(pool, {
					nickname: nickname,
					age: age,
					gender: gender
				}, {account: account});
				ctx.body = new CONFIG.RESPONSE(true, '信息更改成功', {account: account});
				FUNCTION.socket_send(io, 'modify_info', {
					account: account,
					nickname: nickname,
					age: age,
					gender: gender
				});
			}
		}
	} catch (error)
	{
		ctx.body = new CONFIG.RESPONSE(false, CONFIG.ERROR_RESPONSE);
		FUNCTION.log(`账号${account}信息修改失败。错误信息：\n${error.stack}`);
	}
	await next();
}));

app.use(route.post('/report', async function (ctx, next)
{
	FUNCTION.log(ctx.request.body.content);
	ctx.body = 'Report received.';
	await next();
}));

/**
 * data:
 * [
 *      {account,nickname,age,gender,status,customize_avatar}
 * ]
 * **/
app.use(route.post('/get_list', async function (ctx, next)
{
	try
	{
		if (!FUNCTION.validate_cookie(ctx, pool))
			ctx.body = new CONFIG.RESPONSE(false, '登录状态异常');
		else
		{
			const online = await FUNCTION.OBJECT.find_status(client, CONFIG.STATUS.ONLINE);
			const leave = await FUNCTION.OBJECT.find_status(client, CONFIG.STATUS.LEAVE);
			const data = [];
			for (const account of online)
			{
				const res = await FUNCTION.select_query(pool, ['account', 'nickname', 'age', 'gender', 'customize_avatar'], {account: account});
				const row = res.rows[0];
				row.status = CONFIG.STATUS.ONLINE;
				data.push(row);
			}
			for (const account of leave)
			{
				const res = await FUNCTION.select_query(pool, ['account', 'nickname', 'age', 'gender', 'customize_avatar'], {account: account});
				const row = res.rows[0];
				row.status = CONFIG.STATUS.LEAVE;
				data.push(row);
			}
			ctx.body = new CONFIG.RESPONSE(true, '列表获取成功', data);
		}
	} catch (error)
	{
		ctx.body = new CONFIG.RESPONSE(false, CONFIG.ERROR_RESPONSE);
		FUNCTION.log(`列表获取失败，错误信息：\n${error.stack}`);
	}
	await next();
}));

app.listen(CONFIG.PORT);