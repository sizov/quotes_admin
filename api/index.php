<?php
require 'Slim/Slim.php';

$app = new Slim();

$app->get('/origins', 'getQuoteOrigins');
$app->get('/quotes', 'getQuotesByOriginId');
$app->put('/quotes/:quote_id', 'updateQuoteById');
$app->delete('/quotes/:quote_id',	'deleteQuoteById');
$app->post('/quotes', 'createQuote');

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

function getQuotesByOriginId() {
	$request = Slim::getInstance()->request();
	$origin_id = $request->get('origin_id');

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

function deleteQuoteById($quote_id) {
	$sql = "DELETE FROM quotes WHERE id=:id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("id", $quote_id);
		$stmt->execute();
		$db = null;
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function createQuote() {
	$request = Slim::getInstance()->request();
	$body = $request->getBody();
	$quote = json_decode($body);
	$sql = "INSERT INTO quotes (quote_text, language_id, origin_id) VALUES (:quote_text, :language_id, :origin_id)";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("quote_text", $quote->quote_text);
		$stmt->bindParam("language_id", $quote->language_id);
		$stmt->bindParam("origin_id", $quote->origin_id);
		$stmt->execute();		
		$quote->id = $db->lastInsertId();		
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