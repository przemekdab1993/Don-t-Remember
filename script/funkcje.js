const lista_kart =  ['<i class="icon-mic-outline"></i>', '<i class="icon-mic"></i>', '<i class="icon-star-empty"></i>', '<i class="icon-heart-empty"></i>', 
					'<i class="icon-thumbs-up"></i>', '<i class="icon-thumbs-down"></i>', '<i class="icon-home"></i>', '<i class="icon-bell"></i>', 
					'<i class="icon-female"></i>', '<i class="icon-male"></i>', '<i class="icon-paw"></i>', '<i class="icon-soccer-ball"></i>',
					'<i class="icon-bicycle"></i>', '<i class="icon-diamond"></i>'];	// zmienna z znakami na kartach

var wylosowane;		// tablica na losowane karty do gry										
var number_lvl = 0;			// numer poziomu stan przed rozpoczęciem gry równy 0 				
var user_name = 'Bob';		// przypisanie nicku gracza 
var rekord = 10;			// przypisanie standardowego rekordu punktów
var licznik_odkrytych = 0;	// licznik zliczający ile kart jest odkryte w tym momencie
var $karta_1;				// pierwsza odkryta do pary kart
var $karta_2;				// druga dokryta do pary odkrytych
var punkty = 10;			// początkowa ilość punktów
var top_ten;				// najlepsze osiągnięte wyniki w kolejności od najlepszeg
var the_best;


// Losowane kart do tablicy "wylosowne" //
function losuj_karty()
{	
	wylosowane = [];	// reset tablicy wylosowanych kart
	let len_lista_kart = lista_kart.length;		// sprawdzanie ile jest kart w puli kart możliwych do wylosowania
	for (let i = 0; i < 10; i++)
	{
		let los_karta = Math.floor(Math.random() * len_lista_kart);		// losowanie karty 
		let los_miejsce = Math.floor(Math.random() * 20);				// losowanie pierwszego miejsca na losowaną karte
		
		// sprawdzanie czy wylosowane miejsce nie jest zajęte
		// jeśli jest już zajęte przechodzi do następnego miejsca z koleji
		while(wylosowane[los_miejsce] !== undefined)
		{
			los_miejsce++;
			if (los_miejsce > 19)
			{
				los_miejsce = 0;
			}
		}
		wylosowane[los_miejsce] = lista_kart[los_karta];	// przypisanie wylosowaniej karcie miejsce w tablicy kart
		
		los_miejsce = Math.floor(Math.random() * 20);	// losowanie miejsca dla karty-pary piewszej wylosowanej
		
		// sprawdzanie czy wylosowane miejsce nie jest zajęte
		// jeśli jest już zajęte przechodzi do poprzedniego miejsca z koleji
		while(wylosowane[los_miejsce] !== undefined)
		{
			los_miejsce--;
			if (los_miejsce < 0)
			{
				los_miejsce = 19;
			}
		}
		wylosowane[los_miejsce] = lista_kart[los_karta];	// przypisanie wylosowaniej karcie miejsce w tablicy kart
	}
}

// Wyświetlenie wylosowanej tablicy kart //
function wypisz_wymaluj()
{
	let $cursor = $('#game_container');		// div na zawartość gry 
	
	$cursor.html('<div id="game"></div>');
	let $buf_cursor = $('#game');
	for (let i = 0; i < wylosowane.length; i++)
	{
		let buf = '<div id="' + i + '" class="cards_1 cards_0"></div>';
		$buf_cursor.append(buf);
	}
	// nadanie kartą eventu kliknięcia na nich
	$('.cards_0').on('click', function(e) { odkryj(e); } );
}

// Przywracanie właściwości początkowych parze odkrytych kart jeśli nie są takie identyczne //
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

// Ukrywanie pary kart //
function ukrycie_pary()
{
	$karta_1.animate({opacity: 0.0}, 800);
	$karta_2.animate({opacity: 0.0}, 800);
	$karta_1 = '';
	$karta_2 = '';
	licznik_odkrytych = 0;
}

// Pokazanie klikniętej karty //
function odkryj(e)
{
	var $target = $(e.target);
	switch(licznik_odkrytych)
	{
		// jeżeli nie ma jeszcze żadnej odkrytej karty 
		case 0:
			$target.off('click');
			licznik_odkrytych++;
			$target.addClass('cards_2');
			$target.removeClass('cards_0');
			$karta_1 = $target;
			$karta_1.html(wylosowane[$karta_1.attr('id')]);
			break;
		// jeżeli jest to druga odkryta karta 
		case 1:
			$target.off('click');
			licznik_odkrytych++;
			$target.addClass('cards_2');
			$target.removeClass('cards_0');
			$karta_2 = $target;
			$karta_2.html(wylosowane[$karta_2.attr('id')]);
			
			// sprawdza czy karty są identyczne
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
	// jeżeli punkty gracza spadną poniżej zera następuje koniec gry
	if (punkty <= 0)
	{
		setTimeout(function (){ koniec_gry(); }, 1800);
	}
}

// Pobieranie danych z pliku "top_ten.json" - lista najlepszych wyników 
function set_top_ten()
{
	$.getJSON('data/top_ten.json')
	.done( function(data) {
		top_ten = data;
	}).fail( function() {
		$('.list_records').html("Przepraszamy za utrudnienia. Prosimy spróbować ponownie innym razem");
	});
}

// Koniec gry jeśli punkty spadną do zera lub po naciśnięciu przycisku "koniec gry" //
function koniec_gry() 
{
	var buf_list;	// zmienna na dane do zapisu do pliku top_ten.json
	
	set_top_ten();
	let t_t_length = top_ten.length;	// liość zapisanych rekordów 
	
	// dopisywanie nowego wyniku do listy 10 najlepszych wyników 
	for (let i = t_t_length - 1; i >= 0; i--)
	{
		if (rekord <= parseInt(top_ten[i]['pkt']))
		{
			let buf = {'name': user_name, 'pkt': rekord};
			if(i == --t_t_length)
			{
				top_ten.push(buf);
			}
			else
			{
				top_ten.splice(++i, 0, buf);
			}
			zapis_nowej_listy_rekord();
			break;
		}	
	}
	
	// zapis do pliku listy rekordów
	function zapis_nowej_listy_rekord()
	{
		//	skracanie listy najlepszych wyników do 10 pozycji
		if  (top_ten.length > 10)
		{
			top_ten = top_ten.slice(0, 10);
		}
		buf_list = JSON.stringify(top_ten);
	}
	
	// wysłanie listy najlepszych wyników do funkcji zapisującej dane do pliku
	$.ajax({
	  method: "POST",
	  url: "save.php",
	  data: {data : buf_list}
	  })
	.done(function( data ) {
    alert( "Data Saved" + data);
  });
	
	let text_koniec; // komunikat końca gry z osiągnientym wynikiem
	
	text_koniec += '<h2>Game Over</h2>Gratulacje ' + user_name + '<br />Twój wynik to: ' + rekord;
	if (rekord > the_best)
	{
		the_best = rekord;
		sessionStorage.setItem('DNR_record', the_best);
		text_koniec += '<br />Poprawiłeś swój dotychczasowy wynik.<br />Z pewnością można go jeszcze poprawić, więc na co czekasz.';
	} else
	{
		text_koniec += '<br />Nie jest to nawet Twój najlepszy wynik. Popraw się jak najprędzej!!!';
	}
	$('#main_container').html(text_koniec);
	$('#main_container').addClass('koniec');
}

// aktualizacja tablicy wyników
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
		number_lvl++;	//zwiększenie o 1 numeru poziomu gry
		losuj_karty();
		wypisz_wymaluj();
		
	}
	$('#number_lvl').text(number_lvl);
}


// Skrypt wykonywany po załadowaniu strony //
$( function() {
	$.ajax({
		beforeSend: function(xhr) {
			if (xhr.overrideMimeType) 
			{
				xhr.overrideMimeType("aplication/json");
			}
		}
	});
	
	set_top_ten();
	
	// podmiana nicku jeżeli w zapisany jest on zmiennej sesyjnej
	if( sessionStorage.getItem('DNR_user_name'))
	{
		$('#user_name').text(sessionStorage.getItem('DNR_user_name'));
		user_name = sessionStorage.getItem('DNR_user_name');
	} else
	{
		$('#user_name').text('Bob');
	}
	
	$('#record_0').text(rekord);
	
	const $input = $('input');	// pole input do zmiany nicku
	const $butt1 = $('#re_user_name');	// przycisk zatwierdzający zmiane nicku
	const $butt2 = $('#poka');	// przycisk pokazujacy panel do zmiany nicku
	
	// ukrywanie pola do zmiany nicku
	$input.hide();
	$input.val(user_name);
	$butt1.hide();
	
	// podmiana nicku jeżeli w zapisany jest on zmiennej sesyjnej
	if(sessionStorage.getItem('DNR_record') == true) 
	{
		the_best = sessionStorage.getItem('DNR_record');
		
	} else 
	{
		the_best = rekord;
	}
	
	// event po kliknięciu przycisku pokazujący panel zmiany nicku
	$butt2.on('click', function() { 
		$('#user_name').text(''); 
		$input.show();
		$input.val(user_name);
		$butt2.hide(); 
		$butt1.show();
	});
	
	// zatwierdzenie kliknięciem przycisku zmiane nicku
	$butt1.on('click', function() {
		if($input.val().length > 0)
		{
			$('#user_name').text($input.val());
			sessionStorage.setItem('DNR_user_name', $input.val());	// pamiętanie nicku w zmiennej sesyjnej
			user_name = $input.val();
		}
		$('#user_name').text(user_name);
		sessionStorage.clear;
		the_best = 0;
		
		// ukrycie panelu zmiany nicku
		$input.hide(); 
		$butt2.show(); 
		$butt1.hide();
	});
	
	// rozpoczęcie nowej gry
	$('#start').on('click', function() {
		number_lvl++;	//zwiększenie o 1 numeru poziomu gry
		losuj_karty();
		wypisz_wymaluj();
		wyniki();
		
		// przypisanie eventu do przycisku "koniec gry" z górnego menu 
		$('#menu_koniec').on('click', function() { 
			koniec_gry(); 
			$('#menu_koniec').off('click'); 
		});
	});
	
	$('[href=rekordowe_wyniki]').on('click', function() { set_top_ten(); });
});