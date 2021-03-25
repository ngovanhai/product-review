<?php

session_start();
require 'vendor/autoload.php';

use sandeepshetty\shopify_api;

require 'help.php';


$shopify = shopifyInit('shopify_huy', 'nguyen-q-huy.myshopify.com', '');
$product  = $shopify("GET", "/admin/api/2020-10/products.json");
foreach ($product as $product) {
    echo $product;
}
