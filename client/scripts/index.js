$(function ()
{
	const $account = $('#account');
	const $password = $('#password');
	const $submit_btn = $('#submit-btn');

	$submit_btn.click(function (event)
	{
		event.preventDefault();
		const [account, password] = [$account.val(), $password.val()];
		let status = true;
		if (!ACCOUNT_REG.test(account))
		{
			status = false;
			change_border_color_to([$account]);
		}
		if (!PASSWORD_REG.test(password))
		{
			status = false;
			change_border_color_to([$password]);
		}

		if (status === false)
			show_tip('填写信息有误', 'error');
		else
		{
			const data = new Login_info(account, password);
			AJAX('login', data,
				function (response)
				{
					const {code, message} = response;
					if (code === false)
						show_tip(message, 'error');
					else
					{
						show_tip(message);
						setTimeout(function ()
						{
							sessionStorage.setItem('account',account);
							location.href = 'room.html';
						}, 2000);
					}
				},
				function (error)
				{
					show_tip('发生错误，请重试', 'error');
					console.log(error);
				})
		}
	})
});