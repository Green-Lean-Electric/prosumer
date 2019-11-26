<?php
session_start();


if ( !isset($_POST['username'], $_POST['password']) ) {
	die ('Please fill both the username and password field!');
}

//HTTP request to the API

if (/* Good username and password */) {
	
	session_regenerate_id();
	$_SESSION['loggedin'] = TRUE;
	$_SESSION['name'] = $_POST['username'];
	$_SESSION['id'] = $id;
	echo 'Welcome ' . $_SESSION['name'] . '!';
	
} else {
	echo 'Incorrect datas !';
}

?>