var lista_kart =  ['<i class="icon-mic-outline"></i>', '<i class="icon-mic"></i>', '<i class="icon-star-empty"></i>', '<i class="icon-heart-empty"></i>', 
					'<i class="icon-thumbs-up"></i>', '<i class="icon-thumbs-down"></i>', '<i class="icon-home"></i>', '<i class="icon-bell"></i>', 
					'<i class="icon-female"></i>', '<i class="icon-male"></i>', '<i class="icon-paw"></i>', '<i class="icon-soccer-ball"></i>',
					'<i class="icon-bicycle"></i>', '<i class="icon-diamond"></i>'];
var wylosowane;
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
	wylosowane = [];
	for (var i = 0; i < 10; i++)
	{
		var los_1 = Math.floor(Math.random() * 14);
		var los_2 = Math.floor(Math.random() * 20);
		while(wylosowane[los_2] !== undefined)
		{
			los_2++;
			if (los_2 > 19)
			{
				los_2 = 0;
			}
		}
		wylosowane[los_2] = lista_kart[los_1];
		var los_3 = Math.floor(Math.random() * 20);
		while(wylosowane[los_3] !== undefined)
		{
			los_3--;
			if (los_3 < 0)
			{
				los_3 = 19;
			}
		}
		wylosowane[los_3] = lista_kart[los_1];
	}
	number_lvl++;
}
function wypisz_wymaluj()
{
	$cursor.html('');
	for (var i = 0; i < wylosowane.length; i++)
	{
		var buf = '<div id="' + i + '" class="cards_1 cards_0"></div>';
		$cursor.append(buf);
	}
	$klik = $('.cards_0');
	$klik.on('click', function(e) { odkryj(e); } );
}
function reset_pary()
{	
	$karta_1.html('');
	$karta_2.html('');
	$karta_1.addClass('cards_0');
	$karta_1.removeClass('cards_2');
	$karta_1.on('click', function(e) { odkryj(e); } );
	$karta_2.addClass('cards_0');
	$karta_2.removeClass('cards_2');
	$karta_2.on('click', function(e) { odkryj(e); } );
	$karta_1 = '';
	$karta_2 = '';
	licznik_odkrytych = 0;
}
function ukrycie_pary()
{
	$karta_1.animate({opacity: 0.0}, 800);
	$karta_2.animate({opacity: 0.0}, 800);
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
			$target.off('click');
			licznik_odkrytych++;
			$target.addClass('cards_2');
			$target.removeClass('cards_0');
			$karta_1 = $target;
			$karta_1.html(wylosowane[$karta_1.attr('id')]);
			break;
		case 1:
			$target.off('click');
			licznik_odkrytych++;
			$target.addClass('cards_2');
			$target.removeClass('cards_0');
			$karta_2 = $target;
			$karta_2.html(wylosowane[$karta_2.attr('id')]);
			
			if ($karta_1.html() === $karta_2.html())
			{
				ukrycie_pary();
				punkty += 5 + (5 * Math.floor(number_lvl / 2));
				wyniki(); 
			}
			else
			{
				setTimeout(function() { reset_pary(); },1600);
				punkty -= 2 * number_lvl;
				if (punkty < 0) punkty = 0;
				wyniki(); 
			}
			break;
		default:
			break;
	}
	if (punkty <= 0)
	{
		setTimeout(function (){
				var koniec = '<h2>Game Over</h2>Gratulacje ' + user_name + '<br />Twój wynik to: ' + rekord;
				koniec += '<br />Jesteś na ' + '###' + ' pozycji w rankingu graczy.<br /> Twój wynik z pewnością można poprawić, więc na co czekasz.';
				$('#main_container').html(koniec);
				$('#main_container').addClass('koniec'); }, 1800);
	}
}
function wyniki()
{
	$('#punkty').text(punkty);
	
	if (punkty > rekord)
	{
		rekord = punkty;
		$('#record_0').text(rekord);
	}
	if ($('.cards_0').length == 0)
	{
		losuj_karty();
		wypisz_wymaluj();
	}
	$('#number_lvl').text(number_lvl);
}
$( function() 
{
	$('#user_name').text(user_name);
	$('#record_0').text(rekord);
	var $input = $('input');
	$input.hide();
	$input.val(user_name);
	var $butt1 = $('#re_user_name');
	var $butt2 = $('#poka');
	$butt1.hide();
	
	$butt2.on('click', function() { $('#user_name').html(''); $input.show(); $butt2.hide(); $butt1.show(); });
	losuj_karty();
	wypisz_wymaluj();
	wyniki();
});