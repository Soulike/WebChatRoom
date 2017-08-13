/**Add tips**/
$(function ()
{
	tip_by_id(['avatar-link'], '点击修改信息');
	tip_by_id(['new-nickname'], '输入昵称，8位以内字母、数字与汉字', 'top');
	tip_by_id(['new-age'], '输入年龄，0-120数字', 'top');
	tip_by_id(['new-gender'], '选择性别', 'top');
	tip_by_id(['switch-status-btn'],'点击修改在线状态','right');
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
	const max_length = 50;
	const $dialog_textarea = $('#dialog-textarea');
	const $dialog_submit_btn = $('#dialog-submit-btn');
	const $message_length_span = $('#message-length-span');

	$message_length_span.text(`0/${max_length}`);
	$dialog_textarea.attr('maxlength', max_length);

	$dialog_textarea.bind('input propertyChange', function ()
	{
		if (!$dialog_textarea.val())
			$dialog_submit_btn.attr('disabled', 'disabled');
		else
			$dialog_submit_btn.removeAttr('disabled');

		$message_length_span.text(`${$dialog_textarea.val().length}/${max_length}`);

		if ($dialog_textarea.val().length >= max_length)
			$message_length_span.removeClass('label-primary').addClass('label-danger');
		else
			$message_length_span.removeClass('label-danger').addClass('label-primary');
	});
});

/**TODO:
 * <div class="alert alert-success modify_alert center" role="alert">
 <span class="glyphicon glyphicon-ok"></span> 修改成功！
 </div>
 *
 * **/