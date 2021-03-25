
<?php
ini_set('display_errors', TRUE);
error_reporting(E_ALL);
require '../conn-shopify.php';
require '../help.php';

session_start();
unset($_SESSION['shop']);
$shop = isset($_GET['shop']) ? $_GET['shop'] : '';
$webhookContent = "";
$webhook = fopen('php://input', 'rb');
while (!feof($webhook)) {
    $webhookContent .= fread($webhook, 4096);
}
fclose($webhook);
$webhookContent = json_decode($webhookContent);
$idCollection = $webhookContent->id;
db_insert('test', [
    "data" => $idCollection,
    "shop" => $shop,
]);
if ($shop !== '') {
    $db->query('delete from custom_reviews_collections where shop = "' . $shop . '" and collection_id = ' . $idCollection);
    $db->query('delete from custom_reviews_connect_collections_and_products where shop = "' . $shop . '" and collection_id = ' . $idCollection);
    $db->query('delete from custom_reviews_connect_collections_and_reviews where shop = "' . $shop . '" and collection_id = ' . $idCollection);
    http_response_code(200);
}
