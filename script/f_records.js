var top_ten;


function loadData() {
	$.getJSON('data/top_ten.json')
	.done( function(data) {
		top_ten = data;
		views_records();
	}).fail( function() {
		$('.list_records').html("Przepraszamy za utrudnienia. Prosimy spróbować ponownie innym razem");
	});
}
function views_records() {
	var $list = $('.list_records ol');
	let buf = '';
	for (let i = 0; i < 10; i++)
	{
		if (top_ten[i])
		{
			buf +=`<li><ul><li> ${i + 1}. </li><li> ${top_ten[i].name} </li><li> ${top_ten[i].pkt} pkt</li></ul></li>`;
		} else
		{
			buf +=`<li><ul><li> ${i + 1}. </li><li> ----- </li><li> 0 pkt </li></ul></li>`;
		}
	}
	$list.html(buf);	
}

$( function() {
	$.ajax({
		beforeSend: function(xhr) {
			if (xhr.overrideMimeType) 
			{
				xhr.overrideMimeType("aplication/json");
			}
		}
	});
	loadData();
});