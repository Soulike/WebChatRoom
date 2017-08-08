/**Add tips**/
$(function ()
{
	tip_by_id(['avatar-link'], '点击修改信息');
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