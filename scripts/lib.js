function AJAX(action, data, success_function, error_function, async = true)
{
	$.ajax(
		{
			xhrFields: {
				withCredentials: true
			},
			contentType: 'application/json',
			timeout: 2000,
			async: async,
			dataType: 'json',
			url: `http://127.0.0.1:3000/action=${action}`,
			method: 'post',
			data: JSON.stringify(data),
			success: success_function,
			error: error_function,
		})
}

function tip_by_id(id_array = [], content, position = 'left')
{
	for (const id_text of id_array)
		$(`#${id_text}`).tooltip(
			{
				container: 'body',
				placement: `${position}`,
				trigger: 'focus hover',
				title: `${content}`
			}
		);
}

function tip_by_className(className, content, position = 'left')
{
	$(`.${className}`).tooltip(
		{
			container: 'body',
			placement: `${position}`,
			trigger: 'focus hover',
			title: `${content}`
		}
	);
}

function border_color_by_id(id, color = 'red')
{
	$(`#${id}`).css('borderColor', color);
}
