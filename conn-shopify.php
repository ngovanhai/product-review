<?php
$apiKey = "a3a6b31a740a4790755a28fa051e9862";
$appId = "1";
$rootLink = "https://localhost/products-reviews";
$trialTime = 30;
$chargeType = "monthly";
$price = 7.99;
$version = time();
$api_version = '2021-01';

$appName = "Sample app";
$testMode = "true";
$dateUse  = '2019-02-15 04:03:09';
$chargeTitle = "Sample app";
$db = new Mysqli("localhost", "root", "", "shopify_hai");
$db->query("set names 'utf8'");
if ($db->connect_errno) {
    die('Connect Error: ' . $db->connect_errno);
}
if (!defined("APP_PATH")) {
    define("APP_PATH", dirname(__FILE__));
}
if (!defined("CACHE_PATH")) {
    define("CACHE_PATH", APP_PATH . "/cache/");
}
