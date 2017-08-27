/**Get user's info**/
$(function ()
{
	const $body = $('body');
	const $nickname = $('#nickname');
	const $avatar = $('#avatar');
	const $current_avatar = $('#current-avatar');
	const $new_nickname = $('#new-nickname');
	const $new_age = $('#new-age');
	const $new_gender = $('#new-gender');

	AJAX('get_user_info', {},
		function (response)
		{
			const {code, message, data} = response;
			if (code === false)
				show_error_modal();
			else
			{
				const {account, nickname, age, gender, customize_avatar, customize_background} = data;
				sessionStorage.setItem('account', account);
				$nickname.text(nickname);
				$new_nickname.val(nickname);
				$new_age.val(age);
				$new_gender.val(gender === true ? 'male' : 'female');
				if (customize_avatar === true)
				{
					let existent = false;
					for (const file_type of ALLOW_FILE_TYPES)
					{
						if (is_existent(`images/avatars/${account}.${file_type}`))
						{
							existent = true;
							$avatar.attr('src', `images/avatars/${account}.${file_type}`);
							$current_avatar.attr('src', `images/avatars/${account}.${file_type}`);
						}
					}
					if (existent === false)
						report(`账户${account}头像丢失`);
				}
				if (customize_background === true)
				{
					let existent = false;
					for (const file_type of ALLOW_FILE_TYPES)
					{
						if (is_existent(`images/backgrounds/${account}.${file_type}`))
						{
							existent = true;
							$body.css('backgroundImage', `url('images/backgrounds/${account}.${file_type}')`);
						}
					}
					if (existent === false)
						report(`账户${account}背景丢失`);
				}
				else
					$body.css('backgroundImage', `url('images/backgrounds/background.jpg')`);

				popover_by_id(['avatar'],
					`<span class="glyphicon glyphicon-user"></span> 账号：${account}<br/>
<span class="glyphicon glyphicon-heart"></span> 昵称：${nickname}<br/>
<span class="glyphicon glyphicon-globe"></span> 年龄：${age}<br/>
<span class="glyphicon glyphicon-leaf"></span> 性别：${gender ? '男' : '女'}`,
					`<span class="glyphicon glyphicon-info-sign"></span>  用户信息`, 'right', true);
			}
		},
		function (error)
		{
			console.log(error.stack);
			show_error_modal();
		});

	$body.css('transition', '5s background-image');
});

/**Get list**/
$(function ()
{
	get_list();
});

/**
 * data:
 * [
 *      {account,nickname,age,gender,status,customize_avatar}
 * ]
 * **/
function get_list()
{
	AJAX('get_list', {},
		function (response)
		{
			const {code, message, data} = response;
			if (code === false)
				show_error_modal();
			else
			{
				for (const info_obj of data)
					list_add_row(info_obj);
			}
		},
		function (error)
		{
			console.log(error);
			show_error_modal();
		});
}

/**Add tips**/
$(function ()
{
	tip_by_id(['avatar-link'], '点击修改信息');
	tip_by_id(['new-nickname'], '输入昵称，8位以内字母、数字与汉字', 'top');
	tip_by_id(['new-age'], '输入年龄，0-120数字', 'top');
	tip_by_id(['new-gender'], '选择性别', 'top');
	tip_by_id(['switch-status-btn'], '点击修改在线状态', 'right');
});

/**Show fonts label in its style**/
$(function ()
{
	const $font_style = $('.font-style');
	for (const link of $font_style)
	{
		$(link).css('fontFamily', `${$(link).text()},serif`);
	}
});

/**Show fonts label in its size**/
$(function ()
{
	const $font_size = $('.font-size');
	for (const link of $font_size)
	{
		$(link).css('fontSize', $(link).text() + 'px');
	}
});

/**Set font**/
$(function ()
{
	const $font_style = $('.font-style');
	const $font_size = $('.font-size');
	const $bold_btn = $('#bold-btn');
	const $dialog_textarea = $('#dialog-textarea');
	$font_style.click((e) =>
	{
		e.preventDefault();
		const font_style = e.target.text;
		$dialog_textarea.css('fontFamily', `${font_style},serif`);

	});

	$font_size.click((e) =>
	{
		e.preventDefault();
		const font_size = e.target.text;
		$dialog_textarea.css('fontSize', font_size + 'px');
	});

	let is_bold = false;
	$bold_btn.click(() =>
	{
		is_bold = !is_bold;
		if (is_bold)
		{
			$bold_btn.addClass('active');
			$dialog_textarea.css('fontWeight', 'bold');
		}
		else
		{
			$bold_btn.removeClass('active');
			$dialog_textarea.css('fontWeight', 'normal');
		}
	})
});

/**Count message length**/
/**If the text area is empty, prevent submitting**/
$(function ()
{
	const $dialog_textarea = $('#dialog-textarea');
	const $dialog_submit_button = $('#dialog-submit-button');
	const $message_length_span = $('#message-length-span');

	$message_length_span.text(`0/${MESSAGE_MAX_LENGTH}`);
	$dialog_textarea.attr('maxlength', MESSAGE_MAX_LENGTH);

	$dialog_textarea.bind('input propertyChange', function ()
	{
		if (!$dialog_textarea.val())
			$dialog_submit_button.attr('disabled', 'disabled');
		else
			$dialog_submit_button.removeAttr('disabled');

		$message_length_span.text(`${$dialog_textarea.val().length}/${MESSAGE_MAX_LENGTH}`);

		if ($dialog_textarea.val().length >= MESSAGE_MAX_LENGTH)
			$message_length_span.removeClass('label-primary').addClass('label-danger');
		else
			$message_length_span.removeClass('label-danger').addClass('label-primary');
	});
});

/**Offline modal settings**/
$(function ()
{
	const $offline_modal = $('#offline-modal');
	$offline_modal.on('hidden.bs.modal', function (event)
	{
		event.preventDefault();
		sessionStorage.clear();
		location.href = 'index.html';
	})
});

/**Switch online status**/
$(function ()
{
	const $status = $('.status');
	$status.click(function (event)
	{
		let status = $(event.target).attr('id');
		switch_status_to(status);
	})
});

function switch_status_to(status, async = true)
{
	const $status_icon = $('#status-icon');
	AJAX('switch_status', {status: status},
		function (response)
		{
			const {code, message, data} = response;
			if (parseInt(status) === 0)
				location.href = 'index.html';

			if (code === false)
				show_error_modal();
			else
			{
				$status_icon.removeAttr('class');
				$status_icon.addClass('glyphicon').addClass((Object.values(STATUS_ICONS))[status]);
			}
		},
		function (error)
		{
			console.log(error.stack);
			show_tip('状态切换失败', 'error');
		}, async);
}

/**Upload avatar preview**/
$(function ()
{
	const $current_avatar = $('#current-avatar');
	$('#avatar-upload-control').change(function ()
	{
		preview_image($current_avatar, $('#avatar-upload-control'));
	});
});

/**Upload and change background**/
$(function ()
{
	let $background_upload_control = $('#background-upload-control');
	const $modify_style_modal = $('#modify-style-modal');
	const $modify_style_modal_button = $('#modify-style-modal-button');
	const $background_upload_progress_bar = $('#background-upload-progress-bar');
	const $body = $('body');
	$modify_style_modal_button.click(function (event)
	{
		event.preventDefault();
		file_upload('background_upload', $background_upload_control,
			function (response)
			{
				const {code, message, data} = response;
				if (code === false)
					show_tip(message, 'error');
				else
				{
					show_tip(message);
					const {account} = data;
					$modify_style_modal.modal('hide');
					$background_upload_progress_bar.css('width', 0);
					$background_upload_control.replaceWith(`<input type="file" id="background-upload-control" accept="image/jpeg,image/png">`);
					$background_upload_control = $('#background-upload-control');
					let existent = false;
					for (const file_type of ALLOW_FILE_TYPES)
					{
						if (is_existent(`images/backgrounds/${account}.${file_type}`))
						{
							existent = true;
							$body.css('backgroundImage', `url('images/backgrounds/${account}.${file_type}?${Date.now()}')`);
						}
					}
					if (existent === false)
						report(`账户${account}背景丢失`);
				}
			},
			function (error)
			{
				show_tip('发生错误，请重试', 'error');
				console.log(error);
			}, $background_upload_progress_bar);
	})
});

/**Modify info submit**/
$(function ()
{
	const $modify_info_modal = $('#modify-info-modal');
	const $modify_info_modal_button = $('#modify-info-modal-button');
	let $avatar_upload_control = $('#avatar-upload-control');
	const $new_nickname = $('#new-nickname');
	const $new_gender = $('#new-gender');
	const $new_age = $('#new-age');

	const $avatar = $('#avatar');
	const $current_avatar = $('#current-avatar');
	const $nickname = $('#nickname');

	let [avatar_upload_success, modify_success] = [true, true];
	$modify_info_modal_button.click(function (event)
	{
		event.preventDefault();
		if ($avatar_upload_control[0].files.length !== 0)
		{
			file_upload('avatar_upload', $avatar_upload_control,
				function (response)
				{
					const {code, message, data} = response;
					avatar_upload_success = code;

					if (code === true)
					{
						const {account} = data;
						let existent = false;
						$avatar_upload_control.replaceWith(`<input type="file" id="avatar-upload-control">`);
						$avatar_upload_control = $('#avatar-upload-control');
						for (const file_type of ALLOW_FILE_TYPES)
						{
							if (is_existent(`images/avatars/${account}.${file_type}`))
							{
								existent = true;
								$avatar.attr('src', `images/avatars/${account}.${file_type}?${Date.now()}`);
								$current_avatar.attr('src', `images/avatars/${account}.${file_type}?${Date.now()}`);
							}
						}
						if (existent === false)
							report(`账户${account}头像丢失`);
					}
				},
				function (error)
				{
					avatar_upload_success = false;
					console.log(error.stack);
				});
		}

		const [new_nickname, new_age, new_gender] = [$new_nickname.val(), $new_age.val(), $new_gender.val()];
		let status = true;
		if (!NICKNAME_REG.test(new_nickname))
		{
			change_border_color_to($new_nickname);
			status = false;
		}
		if (!AGE_REG.test(new_age))
		{
			change_border_color_to($new_age);
			status = false;
		}
		if (new_gender !== 'male' && new_gender !== 'female')
		{
			change_border_color_to($new_gender);
			status = false;
		}

		if (status === false)
			show_tip('信息填写有误', 'error');
		else
		{
			const data = new User_info(new_nickname, new_age, new_gender);
			AJAX('modify_info', data,
				function (response)
				{
					const {code, message, data} = response;
					const {account} = data;
					modify_success = code;
					if (modify_success)
					{
						$nickname.text($new_nickname.val());
						modify_popover_content_by_id(['avatar'],
							`<span class="glyphicon glyphicon-user"></span> 账号：${account}<br/>
<span class="glyphicon glyphicon-heart"></span> 昵称：${new_nickname}<br/>
<span class="glyphicon glyphicon-globe"></span> 年龄：${new_age}<br/>
<span class="glyphicon glyphicon-leaf"></span> 性别：${new_gender === 'male' ? '男' : '女'}`);
					}
				},
				function (error)
				{
					modify_success = false;
					console.log(error.stack);
				}, false);

			if (!avatar_upload_success && !modify_success)
				show_tip('修改失败，请重试', 'error');
			else if (!avatar_upload_success || !modify_success)
				show_tip('部分修改成功，请重试', 'info');
			else
			{
				$modify_info_modal.modal('hide');
				show_tip('修改成功');
			}
		}
	});
});

/**Socket**/
const socket = io(`http://${DOMAIN}`);
socket.on('change_status', function (data)
{
	console.log(1);
	change_status(data);
});

socket.on('current_list', function (data)
{
	list_add_row(data);
});

socket.on('modify_info', function (data)
{
	list_modify_info(data);
});

socket.on('change_avatar', function (data)
{
	list_change_avatar(data);
});

socket.on('receive_message', function (data)
{
	dialog_add_row(data);
});

socket.on('is_online', function (data)
{
	socket.emit('online', {});
});

/**Send Message**/
$(function ()
{
	const $dialog_submit_button = $('#dialog-submit-button');
	const $dialog_textarea = $('#dialog-textarea');
	const $message_length_span = $('#message-length-span');
	$dialog_submit_button.click(function (event)
	{
		event.preventDefault();
		send_message();
	});

	$dialog_textarea.keydown(function (event)
	{
		if (event.which === 13)
		{
			event.preventDefault();
			send_message();
		}
	});

	function send_message()
	{
		const message = new Message($dialog_textarea.css('fontFamily'), $dialog_textarea.css('fontWeight'), $dialog_textarea.css('fontSize'), $dialog_textarea.val());
		socket.emit('send_message', message);
		$dialog_textarea.val('');
		$message_length_span.text(`0/${MESSAGE_MAX_LENGTH}`);
		$dialog_submit_button.attr('disabled', 'disabled');
	}
});

function show_error_modal()
{
	const $offline_modal = $('#offline-modal');
	$offline_modal.modal('show');
}

/**
 * <div class="table-row-display online-person">
 <div class="table-cell-display list-avatar-div"><img src="images/avatar.png" alt="avatar" class="list-avatar img-circle rotate">
 </div>
 <div class="table-cell-display list-nickname">°若灵™</div>
 <div class="table-cell-display list-status"><span class="glyphicon glyphicon-ok"></span></div>
 </div>
 * **/
//{account, nickname, age, gender, status, customize_avatar}
function list_add_row(info_obj)
{
	const $list_table = $('#list-table');
	const {account, nickname, age, gender, status, customize_avatar} = info_obj;
	if (!$(`#${account}`).length)
	{
		let avatar = customize_avatar ? account : 'avatar';
		let file_type = '';
		for (const file_t of ALLOW_FILE_TYPES)
			if (is_existent(`images/avatars/${avatar}.${file_t}`))
			{
				file_type = file_t;
				break;
			}
		$list_table.append(`
	<div class="table-row-display online-person" id=${account}>
 <div class="table-cell-display list-avatar-div"><img src="images/avatars/${avatar}.${file_type}" alt="avatar" class="list-avatar img-circle rotate" id=${account}_avatar>
 </div>
 <div class="table-cell-display list-nickname" id=${account}_nickname>${nickname}</div>
 <div class="table-cell-display list-status"><span class="glyphicon ${Object.values(STATUS_ICONS)[status]}" id="${account}_status"></span></div>
 </div>
	`);
		popover_by_id([`${account}_avatar`],
			`<span class="glyphicon glyphicon-user"></span> 账号：${account}<br/>
<span class="glyphicon glyphicon-heart"></span> 昵称：${nickname}<br/>
<span class="glyphicon glyphicon-globe"></span> 年龄：${age}<br/>
<span class="glyphicon glyphicon-leaf"></span> 性别：${gender ? '男' : '女'}`,
			`<span class="glyphicon glyphicon-info-sign"></span>  用户信息`, 'right', true);
	}
}

//{account}
function list_remove_row(info_obj)
{
	const {account} = info_obj;
	const $account = $(`#${account}`);
	if (!$account.length)
		get_list();
	$account.remove();
}

//{account}
function list_change_avatar(info_obj)
{
	let file_type = '';
	const {account} = info_obj;
	for (const file_t of ALLOW_FILE_TYPES)
		if (is_existent(`images/avatars/${account}.${file_t}`))
		{
			file_type = file_t;
			break;
		}
	if (file_type === '')
	{
		report(`账号${account}头像丢失`);
		return;
	}
	$(`#${account}_avatar`).attr('src', `images/avatars/${account}.${file_type}?${Date.now()}`);
}

//{account}
function change_status(info_obj)
{
	const {account, status} = info_obj;
	if (parseInt(status) === OFFLINE)
	{
		list_remove_row(info_obj);
		return;
	}
	else if (parseInt(status) === ONLINE || parseInt(status) === LEAVE)
	{
		list_add_row(info_obj);
	}

	const status_icon_span = $(`#${account}_status`);
	status_icon_span.removeAttr('class');
	status_icon_span.addClass('glyphicon').addClass((Object.values(STATUS_ICONS))[parseInt(status)]);
}

//{account, nickname, age, gender}
function list_modify_info(info_obj)
{
	const {account, nickname, age, gender} = info_obj;
	if (!$(`#${account}`).length)
		get_list();
	$(`#${account}_nickname`).text(nickname);
	modify_popover_content_by_id([`${account}_avatar`],
		`<span class="glyphicon glyphicon-user"></span> 账号：${account}<br/>
<span class="glyphicon glyphicon-heart"></span> 昵称：${nickname}<br/>
<span class="glyphicon glyphicon-globe"></span> 年龄：${age}<br/>
<span class="glyphicon glyphicon-leaf"></span> 性别：${gender ? '男' : '女'}`)
}

/**
 * <div class="table-row-display message-row">
 <div class="table-cell-display message-avatar-div middle">
 <img src="images/avatars/avatar.png" alt="avatar" class="message-avatar img-circle">
 </div>
 <div class="table-cell-display message-nickname middle">°若灵™</div>
 <span class="table-cell-display middle colon">:</span>
 <div class="table-cell-display message middle">
 哈哈哈哈
 </div>
 <div class="table-cell-display message-time middle">17点07分</div>
 </div>
 * **/
function dialog_add_row(message_obj)
{
	const $message_table = $('#message-table');
	const $dialog_area = $('#dialog-area');
	const {account, nickname, font, bold, font_size, content, send_time} = message_obj;
	const style = `font-family:${font};font-weight:${bold};font-size:${font_size}`;
	let file_type = '';
	let has_avatar = false;
	for (const file_t of ALLOW_FILE_TYPES)
		if (is_existent(`images/avatars/${account}.${file_t}`))
		{
			file_type = file_t;
			has_avatar = true;
			break;
		}
	const img_src = has_avatar ? `images/avatars/${account}.${file_type}` : `images/avatars/avatar.png`;
	$message_table.append(
		`<div class="table-row-display message-row">
 <div class="table-cell-display message-avatar-div middle">
 <img src=${img_src} alt="avatar" class="message-avatar img-circle">
 </div>
 <div class="table-cell-display message-nickname middle">${nickname}</div>
 <span class="table-cell-display middle colon">:</span>
 <div class="table-cell-display message middle" style="${style}">${content}</div>
 <div class="table-cell-display message-time middle">${send_time}</div>
 </div>`
	);
	$dialog_area.animate({scrollTop: $message_table.height()}, 500);
}


/**Online/Offline switch**/
window.onunload = function ()
{
	switch_status_to(OFFLINE, false);
	socket.close();
};

$(function ()
{
	switch_status_to(ONLINE);
});