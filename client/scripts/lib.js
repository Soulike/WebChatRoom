const [ACCOUNT_REG, NICKNAME_REG, PASSWORD_REG, AGE_REG] =
	[/^\d+$/, /^[A-z0-9\u4e00-\u9fa5]{1,8}$/, /^[A-z0-9]{1,32}$/, /^[0-9]+$/];
const ALLOW_FILE_TYPES = ['jpeg', 'png'];
const [OFFLINE, ONLINE, WATCHING, LEAVE] = [0, 1, 2, 3];
const STATUS_ICONS = {
	OFFLINE: 'glyphicon-off',
	ONLINE: 'glyphicon-ok',
	WATCHING: 'glyphicon-eye-open',
	LEAVE: 'glyphicon-glass',
};
//const [DOMAIN, PORT] = ['127.0.0.1', 8080];
const [DOMAIN, PORT] = ['47.94.152.219', 8080];

const MESSAGE_MAX_LENGTH = 50;

const FONTS = {
	song: "宋体,simsun,AR PL UMing CN,serif",
	msyh: "微软雅黑,Microsoft Yahei,simhei,sans-serif",
	kai: "楷体,simkai,AR PL UKai CN,sans-serif",
	fangSong: "仿宋,simfang,sans-serif",
};

class Register_info
{
	constructor(nickname, password)
	{
		this.nickname = nickname;
		this.password = md5(password);
	}
}

class Login_info
{
	constructor(account, password)
	{
		this.account = account;
		this.password = md5(password);
	}
}

class User_info
{
	constructor(nickname, age, gender)
	{
		this.nickname = nickname;
		this.age = age;
		this.gender = (gender === 'male');
	}
}

class Message
{
	constructor(font,bold,font_size,content)
	{
		this.font = font;
		this.bold = bold;
		this.font_size = font_size;
		this.content = content;
	}
}

function AJAX(action, data, success_function, error_function, async = true)
{
	$.ajax(
		{
			xhrFields: {
				withCredentials: true
			},
			contentType: 'application/json',
			timeout: 500,
			async: async,
			dataType: 'json',
			url: `http://${DOMAIN}:${PORT}/${action}`,
			method: 'post',
			data: JSON.stringify(data),
			success: success_function,
			error: error_function,
		})
}

function tip_by_id(id_array = [], content, position = 'left', html = false)
{
	for (const id_text of id_array)
	{
		$(`#${id_text}`).tooltip(
			{
				container: 'body',
				placement: `${position}`,
				trigger: 'focus hover',
				title: `${content}`,
				html: html,
			}
		);
	}
}

function popover_by_id(id_array = [], content, title, position = 'left', html = false)
{
	for (const id_text of id_array)
	{
		$(`#${id_text}`).popover(
			{
				container: 'body',
				placement: position,
				trigger: 'focus hover',
				title: title,
				content: content,
				html: html,
			}
		);
	}
}

function modify_popover_content_by_id(id_array = [], content)
{
	for (const id_text of id_array)
	{
		const popover = $(`#${id_text}`).data('bs.popover');
		popover.options.content = content;
	}
}

function change_border_color_to($selector_array, color = 'red')
{
	for (const selector of $selector_array)
	{
		$(selector).css('borderColor', color);
	}
}

function show_tip(content, type = 'success')
{
	const SHOW_TIME = 2000;
	const $body = $('body');
	let icon,
		alert_type = type;
	switch (type)
	{
		case 'success':
		{
			icon = 'glyphicon-ok-sign';
			break;
		}
		case 'info':
		{
			icon = 'glyphicon-info-sign';
			break;
		}
		case 'error':
		{
			alert_type = 'danger';
			icon = 'glyphicon-remove-sign';
		}
	}
	const last = Date.now();
	$body.append(
		`<div class="alert alert-${alert_type} modify_alert center" role="alert" id=${last}>
 			<span class='glyphicon ${icon}'></span> ${content}
 		</div>`
	);
	const $last = $(`#${last}`);
	setTimeout(function ()
	{
		$last.remove();
	}, SHOW_TIME);
}

function is_existent(file_relative_path)
{
	let status = true;
	$.ajax(
		{
			method:'HEAD',
			contentType: 'text/plain',
			timeout: 2000,
			url: `http://${DOMAIN}:${PORT}/${file_relative_path}`,
			async:false,
			success: function ()
			{
				status = true;
			},
			error: function ()
			{
				status = false;
			},
		});
	return status;
}

function preview_image($img_selector, $input_selector)
{
	if ($($input_selector)[0].files.length)
	{
		const file_reader = new FileReader();
		file_reader.readAsDataURL($($input_selector)[0].files[0]);
		file_reader.onload = function ()
		{
			$($img_selector).attr('src', file_reader.result);
		}
	}
}

function file_upload(action, $upload_input, success_function, error_function, $progress_bar = undefined, async = true)
{
	let formData = new FormData;
	for (let i = 0; i < $upload_input[0].files.length; i++)
		formData.append(`file`, $upload_input[0].files[i]);
	$.ajax(
		{
			xhrFields: {
				withCredentials: true
			},
			url: `http://${DOMAIN}:${PORT}/${action}`,
			method: 'post',
			data: formData,
			processData: false,
			contentType: false,
			async: async,
			success: success_function,
			error: error_function,
			xhr: function ()
			{
				//获取ajaxSettings中的xhr对象，为它的upload属性绑定progress事件的处理函数
				let myXhr = $.ajaxSettings.xhr();
				if ($progress_bar)
				{
					if (myXhr.upload)
					{ //检查upload属性是否存在
						myXhr.upload.addEventListener('progress', function (event)//绑定progress事件的回调函数
						{
							if (event.lengthComputable)
							{
								let percent = event.loaded / event.total * 100;
								$progress_bar.css('width', percent + '%');
							}
						}, false);
					}
				}
				return myXhr; //xhr对象返回给jQuery使用
			}
		});
}

$(function ()
{
	$('input').focus(function (event)
	{
		$(event.target).removeAttr('style');
	})
});