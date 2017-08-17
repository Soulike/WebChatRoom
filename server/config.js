exports.PORT = 80;

exports.DATABASE_CONFIG = {
	user: 'postgres',
	host: 'localhost',
	database: 'Web-Chat-Room',
	password: 'SoulikeZhou',
	port: 5432,
};

class response
{
	constructor(code, message = '', data = {})
	{
		this.code = code;
		this.message = message;
		this.data = data;
	}
}

exports.RESPONSE = response;

exports.STATUS = {
	OFFLINE:0,
	ONLINE:1,
	WATCHING:2,
	LEAVE:3,
};

[exports.ACCOUNT_REG, exports.NICKNAME_REG, exports.PASSWORD_REG, exports.AGE_REG] =
	[/^\d+$/, /^[A-z0-9\u4e00-\u9fa5]{1,8}$/, /^[A-z0-9]{1,32}$/, /^[0-9]+$/];

exports.REG ={
	ACCOUNT:/^\d+$/,
	NICKNAME :/^[A-z0-9\u4e00-\u9fa5]{1,8}$/,
	PASSWORD:/^[0-9a-f]{32}$/,
	AGE:/^[0-9]+$/,
};

exports.ERROR_RESPONSE = '未知错误';

exports.ALLOW_TYPES = ['jpeg','png'];