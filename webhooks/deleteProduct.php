
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
$idProduct = $webhookContent->id;
db_insert('test', [
    "data" => $idProduct,
    "shop" => $shop,
]);
if ($shop !== '') {
    $db->query('delete from custom_reviewss_products where shop = "' . $shop . '" and products_id = ' . $idProduct);
    $db->query('delete from custom_reviews_connect_collections_and_products where shop = "' . $shop . '" and product_id = ' . $idProduct);
    $db->query('delete from custom_reviews_connect_products_and_reviews where shop = "' . $shop . '" and product_id = ' . $idProduct);
    http_response_code(200);
}
