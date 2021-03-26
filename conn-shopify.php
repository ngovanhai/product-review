<?php
$apiKey = "489d5ec3fa1868c97590e775ce83b3cf";
$appId = "3";
$rootLink = "https://localhost/product-reviews-react";
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
