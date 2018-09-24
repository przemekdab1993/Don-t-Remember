<?php
	// ZAPISYWANIE DANYCH DO PLIKU // 
	
    $file = 'data/top_ten.json';
    $data = $_POST['data'];
    file_put_contents($file, $data, LOCK_EX);

?>