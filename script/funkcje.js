var lista_kart =  ['tr', 're', 'rr', 'gf', 'sf', '4t', 'hy', 'fh', 'gt'];
var wylosowane = [];
var $dane_wy;	
var $cursor = $('#game');
var $klik;
var licznik_odkrytych = 0;
var $karta_1, $karta_2;

function losuj_karty()
{
	for (var i = 0; i < 16; i++)
	{
		var los = Math.floor(Math.random() * 9);
		wylosowane[i] = lista_kart[los];
	}
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
	$karta_1.addClass('cards_1');
	$karta_1.removeClass('cards_2');
	$karta_1.on('click', function(e) { odkryj(e); } );
	$karta_2.addClass('cards_1');
	$karta_2.removeClass('cards_2');
	$karta_2.on('click', function(e) { odkryj(e); } );
	licznik_odkrytych = 0;
	$karta_1.text('');
	$karta_2.text('');
	$karta_1 = '';
	$karta_2 = '';
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
			licznik_odkrytych++;
			$target.addClass('cards_2');
			$target.removeClass('cards_1');
			$karta_1 = $target;
			$karta_1.text(wylosowane[$karta_1.attr('id')]);
			$karta_1.unbind('click');
			break;
		case 1:
			licznik_odkrytych++;
			$target.addClass('cards_2');
			$target.removeClass('cards_1');
			$karta_2 = $target;
			$karta_2.text(wylosowane[$karta_2.attr('id')]);
			$karta_2.unbind('click');
			
			if ($karta_1.html() === $karta_2.html())
			{
				ukrycie_pary();
			}
			else
			{
				setTimeout(function() { reset_pary(); },1500);
			}
			break;
		default:
			reset_pary();
			break;
	}
}

$( function() 
{
	losuj_karty();
	wypisz_wymaluj();
	$klik = $('.cards_1');
	$klik.on('click', function(e) { odkryj(e); } );
});