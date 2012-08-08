<?php
require 'Slim/Slim.php';

$app = new Slim();

$app->get('/origins', 'getQuoteOrigins');
$app->get('/quotes/:origin_id', 'getQuotesByOriginId');  ??? how to resolve url for retrieving quotes per orogin and storing quote by id (suppose to be same)
$app->put('/quotes/:quote_id', 'updateQuoteById');

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

function getQuotesByOriginId($origin_id) {
	$sql = "SELECT * FROM quotes WHERE origin_id=:origin_id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("origin_id", $origin_id);
		$stmt->execute();
		$quotes = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo json_encode($quotes); 
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
} 

function updateQuoteById($quote_id) {
	$request = Slim::getInstance()->request();
	$body = $request->getBody();
	$quote = json_decode($body);
	$sql = "UPDATE quotes SET quote_text=:quote_text, language_id=:language_id WHERE id=:quote_id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("quote_text", $quote->quote_text);
		$stmt->bindParam("language_id", $quote->language_id);
		$stmt->bindParam("quote_id", $quote_id);
		$stmt->execute();
		$db = null;
		echo json_encode($quote); 
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