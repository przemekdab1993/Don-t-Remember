var lista_kart =  ['<i class="icon-mic-outline"></i>', '<i class="icon-mic"></i>', '<i class="icon-star-empty"></i>', '<i class="icon-heart-empty"></i>', 
					'<i class="icon-thumbs-up"></i>', '<i class="icon-thumbs-down"></i>', '<i class="icon-home"></i>', '<i class="icon-bell"></i>', 
					'<i class="icon-female"></i>', '<i class="icon-male"></i>', '<i class="icon-paw"></i>', '<i class="icon-soccer-ball"></i>',
					'<i class="icon-bicycle"></i>', '<i class="icon-diamond"></i>'];
var wylosowane = [];
var $dane_wy;	
var $cursor = $('#game');
var $klik;
var licznik_odkrytych = 0;
var $karta_1, $karta_2;
var user_name = "Franek";
var number_lvl = 0;
var punkty = 10;
var rekord = 10;

function losuj_karty()
{
	for (var i = 0; i < 16; i++)
	{
		var los = Math.floor(Math.random() * 9);
		wylosowane[i] = lista_kart[los];	
	}
	number_lvl++;
}
function wypisz_wymaluj()
{
	for (var i = 0; i < wylosowane.length; i++)
	{
		var buf = '<div id="' + i + '" class="cards_0 cards_1"></div>';
		$cursor.append(buf);
	}
}
function reset_pary()
{	
	$karta_1.html('');
	$karta_2.html('');
	$karta_1.addClass('cards_1');
	$karta_1.removeClass('cards_2');
	$karta_1.on('click', function(e) { odkryj(e); } );
	$karta_2.addClass('cards_1');
	$karta_2.removeClass('cards_2');
	$karta_2.on('click', function(e) { odkryj(e); } );
	$karta_1 = '';
	$karta_2 = '';
	licznik_odkrytych = 0;
}
function ukrycie_pary()
{
	$karta_1.animate({opacity: 0.0}, 800, function() { $karta_1.unbind('click'); });
	$karta_2.animate({opacity: 0.0}, 800, function() { $karta_2.unbind('click'); });
	$karta_1 = '';
	$karta_2 = '';
	licznik_odkrytych = 0;
}
function odkryj(e)
{
	var $target = $(e.target);
	switch(licznik_odkrytych)
	{
		case 0:
			$target.unbind('click');
			licznik_odkrytych++;
			$target.addClass('cards_2');
			$target.removeClass('cards_1');
			$karta_1 = $target;
			$karta_1.html(wylosowane[$karta_1.attr('id')]);
			break;
		case 1:
			$target.unbind('click');
			licznik_odkrytych++;
			$target.addClass('cards_2');
			$target.removeClass('cards_1');
			$karta_2 = $target;
			$karta_2.html(wylosowane[$karta_2.attr('id')]);
			
			if ($karta_1.html() === $karta_2.html())
			{
				ukrycie_pary();
				punkty += 5 * number_lvl;
				wyniki(); 
			}
			else
			{
				setTimeout(function() { reset_pary(); },1800);
				punkty -= 1 * number_lvl;
				wyniki(); 
			}
			break;
		default:
			break;
	}
}
function wyniki()
{
	$('#punkty').text(punkty);
	$('#number_lvl').text(number_lvl);
	if (parseInt($('#punkty').text()) > parseInt($('#record_0').text()))
	{
		$('#record_0').text($('#punkty').text());
	}
}
$( function() 
{
	$('#user_name').text(user_name);
	$('#record_0').text(rekord);
	
	losuj_karty();
	wypisz_wymaluj();
	wyniki();
	$klik = $('.cards_1');
	$klik.on('click', function(e) { odkryj(e); } );
});