const md5 = require('blueimp-md5');
const fs = require('fs');
const CONFIG = require('./config');

exports.log = function (content)
{
	const date = new Date();
	console.log(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} ${content}`);
};

/**database return value
 * Result {
  command: 'SELECT',
  rowCount: 1,
  oid: NaN,
  rows: [ anonymous { password: 'f1696af0b5e53373c6cf8f97a6a59f5a' } ],
  fields:
   [ Field {
       name: 'password',
       tableID: 16455,
       columnID: 2,
       dataTypeID: 1043,
       dataTypeSize: -1,
       dataTypeModifier: 36,
       format: 'text' } ],
  _parsers: [ [Function: noParse] ],
  RowCtor: [Function: anonymous],
  rowAsArray: false,
  _getTypeParser: [Function: bound ] }
 *
 * **/

/**values:
 * {
 *     col_name: value,
 *     col_name: value
 * }
 * **/
exports.insert_query = function (pool, values_obj)
{
	let col_string = '';
	for (const name of Object.keys(values_obj))
		col_string += (name + ',');
	col_string = col_string.slice(0, col_string.length - 1);

	let num_string = '';
	for (let i = 0; i < Object.values(values_obj).length; i++)
		num_string += (`$${i + 1},`);
	num_string = num_string.slice(0, num_string.length - 1);

	const insert_query_string = {
		text: `INSERT INTO users(${col_string}) VALUES(${num_string})`,
		values: Object.values(values_obj),
	};
	return pool.query(insert_query_string);
};

/**filters:
 * {
 *     col_name: value,
 *     col_name: value
 * }
 * **/
exports.select_query = function (pool, col_names_array = [], filters_obj = {}, logic = 'AND')
{
	let col_string = '';
	let filters_key_string = '';

	if (col_names_array.length !== 0)
	{
		for (const name of col_names_array)
			col_string += (name + ',');
		col_string = col_string.slice(0, col_string.length - 1);
	}

	if (Object.keys(filters_obj).length !== 0)
	{
		const keys = Object.keys(filters_obj);
		for (let i = 0; i < keys.length; i++)
		{
			if (i === keys.length - 1)
			{
				filters_key_string += `${keys[i]} = $${i + 1}`;
				break;
			}
			filters_key_string += `${keys[i]} = $${i + 1} ${logic} `;
		}
	}

	const select_query_string = {
		text: `SELECT ${col_string === '' ? '*' : col_string} FROM users${filters_key_string === '' ? '' : ` WHERE ${filters_key_string}`}`,
		values: Object.values(filters_obj),
	};
	return pool.query(select_query_string);
};

exports.update_query = function (pool, new_info_obj, filters_obj, logic = 'AND')
{
	let new_info_string = '';
	let filters_key_string = '';

	if (Object.keys(new_info_obj).length !== 0)
	{
		for (const name of Object.keys(new_info_obj))
			new_info_string += `${name}='${new_info_obj[name]}',`;
		new_info_string = new_info_string.slice(0, new_info_string.length - 1);
	}

	if (Object.keys(filters_obj).length !== 0)
	{
		const keys = Object.keys(filters_obj);
		for (let i = 0; i < keys.length; i++)
		{
			if (i === keys.length - 1)
			{
				filters_key_string += `${keys[i]} = $${i + 1}`;
				break;
			}
			filters_key_string += `${keys[i]} = $${i + 1} ${logic} `;
		}
	}

	const select_query_string = {
		text: `UPDATE users SET ${new_info_string} WHERE ${filters_key_string}`,
		values: Object.values(filters_obj),
	};

	return pool.query(select_query_string);
};

exports.set_identify_cookie = function (ctx, account, password)
{
	const date = new Date();
	ctx.cookies.set(md5(account), md5(account + password + date.toDateString()));
};

exports.validate_cookie = async function (ctx, pool)
{
	const account = ctx.cookies.get('account');
	if (!CONFIG.REG.ACCOUNT.test(account))
		return false;
	const value = ctx.cookies.get(md5(account));
	if (!value)
		return false;
	const res = await exports.select_query(pool, ['password'], {account: account});
	if (res.rowCount === 0)
		return false;
	const {password} = res.rows[0];
	const date = new Date();
	return (value === md5(account + password + date.toDateString()));
};

exports.delete_file = function (path)
{
	try
	{
		fs.unlinkSync(path);
	} catch (error)
	{
		//Ignore the error when it can't find the image
	}
};

exports.clear_files = function (account, type)
{
	for (const file_type of CONFIG.ALLOW_TYPES)
		exports.delete_file(`client/images/${type}s/${account}.${file_type}`);
};

exports.socket_send = function (io, event, data)
{
	io.broadcast(`${event}`, data);
};

exports.COOKIE = {};

exports.COOKIE.parse = function (cookie_string)
{
	const items = cookie_string.split('; ');
	let result = {};
	for (const item of items)
	{
		const part = item.split('=');
		let value = '';
		for (let i = 1; i < part.length; i++)
			value += part[i];
		result[part[0]] = value;
	}
	return result;
};

exports.set_status = async function (user_status_obj, account, status, pool,io)
{
	if (parseInt(status) === CONFIG.STATUS.OFFLINE)
	{
		delete user_status_obj[account];
		exports.log(`账号${account}下线`);
	}
	else
		user_status_obj[account] = parseInt(status);

	let data = {};
	if (parseInt(status) === CONFIG.STATUS.ONLINE || parseInt(status) === CONFIG.STATUS.LEAVE)
	{
		const res = await exports.select_query(pool,
			['account', 'nickname', 'age', 'gender', 'customize_avatar'], {account: account});
		data = res.rows[0];
		data.status = status;
	}
	else
	{
		data.account = account;
		data.status = CONFIG.STATUS.OFFLINE;
	}
	exports.socket_send(io, 'change_status', data);
};

exports.OBJECT = {};
exports.OBJECT.find_key_by_value = function (obj, value)
{
	const keys = Object.keys(obj);
	let ret = [];
	for(const key of keys)
	{
		if(obj[key] === value)
			ret.push(key);
	}
	return ret;
};