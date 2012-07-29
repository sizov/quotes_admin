<?php
require 'Slim/Slim.php';

$app = new Slim();

$app->get('/quote_origins', 'getQuoteOrigins');
$app->get('/quotes', 'getQuotes');

$app->run();

function getQuoteOrigins() {
	$sql = "select * FROM quote_origins ORDER BY id";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$qoute_origins = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo json_encode($qoute_origins);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function getQuotes() {
	$sql = "select * FROM quotes ORDER BY id";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$qoutes = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo json_encode($qoutes);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}


function getConnection() {
	$dbhost="127.0.0.1";
	$dbuser="root";
	$dbpass="";
	$dbname="quotes";
	$dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);	
	$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	return $dbh;
}

?>