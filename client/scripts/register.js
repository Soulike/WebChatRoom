$(function ()
{
	tip_by_id(['nickname'], '8位以内数字、字母及汉字');
	tip_by_id(['password'], '32位以内数字、字母');
	tip_by_id(['password-again'], '重复输入密码');
});

$(function ()
{
	const $form = $('#form');
	const [$nickname, $password, $password_again] = [$('#nickname'), $('#password'), $('#password-again')];
	const $account = $('#account');
	const $register_success_modal = $('#register-success-modal');

	$form.submit(function (event)
	{
		event.preventDefault();
		const [nickname, password, password_again] = [$nickname.val(), $password.val(), $password_again.val()];
		let status = true;
		if (!NICKNAME_REG.test(nickname))
		{
			status = false;
			change_border_color_to([$nickname]);
		}
		if (!PASSWORD_REG.test(password))
		{
			status = false;
			change_border_color_to([$password]);
		}
		if (password !== password_again)
		{
			status = false;
			change_border_color_to([$password, $password_again]);
		}

		if (status === false)
			show_tip('填写信息有误', 'error');
		else
		{
			const data = new Register_info(nickname, password);
			AJAX('register', data,
				function (response)
				{
					const {code, message, data} = response;
					if (code === false)
						show_tip(message, 'error');
					else
					{
						$account.text(data.account);
						$register_success_modal.modal('show');
						$register_success_modal.on('hidden.bs.modal', function ()
						{
							location.href = 'index.html';
						});
					}
				},
				function (error)
				{
					show_tip('发生错误，请重试', 'error');
					console.log(error);
				});
		}
	});
});