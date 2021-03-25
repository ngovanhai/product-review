<?php
ini_set('display_errors', TRUE);
error_reporting(E_ALL);
require 'vendor/autoload.php';

use sandeepshetty\shopify_api;

require 'conn-shopify.php';
require 'help.php';
if (isset($_GET["action"])) {
    $action = $_GET["action"];
    $shop = $_GET["shop"];
    if ($action == "getProductNew") {
        // $shopify    = shopifyInit($db, $shop, $appId);
        // updateProductToCache($shopify, $shop);
        http_response_code(200);
    }
    if ($action == "getProductEdit") {
        // $shopify    = shopifyInit($db, $shop, $appId);
        // updateProductToCache($shopify, $shop);
        http_response_code(200);
    }
    if ($action == "getProductDelete") {
        // $shopify    = shopifyInit($db, $shop, $appId);
        // updateProductToCache($shopify, $shop);
        http_response_code(200);
    }
    if ($action == "getStorePlanChange") {
        $webhookContent = "";
        $webhook = fopen('php://input', 'rb');
        while (!feof($webhook)) {
            $webhookContent .= fread($webhook, 4096);
        }
        fclose($webhook);
        $data = json_decode($webhookContent, true);
        if ($data["plan_name"] == 'closed' || $data["plan_name"] == 'cancelled' || $data["plan_name"] == 'fraudulent') {
            $db->query("update tbl_usersettings set status = '" . $data["plan_name"] . "' where shop = '$shop' and app_id = $appId");
        } else {
            $db->query("update tbl_usersettings set status = 'active' where shop = '$shop' and app_id = $appId");
        }
    }
    if ($action == 'shopRedact') {
        if (!empty($_GET['shop_domain'])) {
            $shop = $_GET['shop_domain'];
            $db->query("DELETE from custom_reviews_settings WHERE shop = '$shop'");
            $data_return = 'Deleted shop data!';
        } else {
            $data_return = 'Invalid Shop Domain!';
        }
        return $data_return;
    }
    if ($action == 'customersRedact') {
        if (!empty($_GET['shop_domain'])) {
            $shop = $_GET['shop_domain'];
            $data_return = 'Deleted customer data!';
        } else {
            $data_return = 'Invalid Shop Domain!';
        }
        return $data_return;
    }
    if ($action == 'customersRequest') {
        if (!empty($_GET['shop_domain'])) {
            $shop = $_GET['shop_domain'];
            $data_return = $shop;
        } else {
            $data_return = 'Invalid Shop Domain!';
        }
        return $data_return;
    }
}
if (isset($_POST['action'])) {
    $action     = $_POST['action'];
    $shop       = $_POST["shop"];
    if ($action == "upgradeAppPlan") {
        $shopify    = shopifyInit($db, $shop, $appId);
        $shop_data = $db->query("select * from tbl_usersettings where store_name = '" . $shop . "' and app_id = $appId");
        $shop_data = $shop_data->fetch_object();
        $installedDate = $shop_data->installed_date;

        $date1 = new DateTime($installedDate);
        $date2 = new DateTime("now");
        $interval = date_diff($date1, $date2);
        $diff = (int) $interval->format('%R%a');
        if ($diff < $trialTime) {
            $trial = $trialTime - $diff;
        } else {
            $trial = 0;
        }
        $plan = $_POST["plan"];
        if ($plan == '1') {
            $appPrice = $pricePremium;
            $planName = 'premium';
        } else {
            $appPrice = $priceAdvanced;
            $planName = 'advanced';
        }
        // charge fee
        $charge = array(
            "recurring_application_charge" => array(
                "name" => $chargeTitle,
                "price" => $appPrice,
                "return_url" => "$rootLink/charge.php?shop=$shop",
                "test" => $testMode,
                "trial_days" => $trial
            )
        );
        $recu = $shopify("POST", "/admin/recurring_application_charges.json", $charge);
        $confirmation_url = $recu["confirmation_url"];
        if ($confirmation_url != '') {
            $db->query("update tbl_usersettings set confirmation_url = '$confirmation_url',plan_name = '$planName' where store_name = '$shop' and app_id = $appId");
            $success = 1;
        } else {
            $success = 0;
        }
        echo $success;
    }
    if ($action == "addSnippetFile") {
        $shopify    = shopifyInit($db, $shop, $appId);
        $theme = $shopify("GET", "/admin/api/" . apiVersion . "/themes.json", array("role" => "main"));
        $data = array(
            "asset" => array(
                "key" => "snippets/ot-product-reviews-core.liquid",
                "src" => "$rootLink/ot-product-reviews-core.liquid"
            )
        );
        $snippet = $shopify("PUT", "/admin/api/2020-07/themes/" . $theme[0]["id"] . "/assets.json", $data);

        $themeFile = $shopify("GET", "/admin/api/2020-07/themes/" . $theme[0]["id"] . "/assets.json?asset[key]=layout/theme.liquid");
        // $themeFile["value"] = str_replace("</head>","{% include 'ot-product-reviews-core' %}\n</head>",$themeFile["value"]);

        $themeFile["value"] = str_replace('"', "'", $themeFile["value"]);
        $data1 = array(
            "asset" => array(
                "key" => "layout/theme.liquid",
                "value" => $themeFile["value"]
            )
        );
        $update = $shopify("PUT", "/admin/api/2020-07/themes/" . $theme[0]["id"] . "/assets.json", $data1);
    }
}
// function updateProductToCache($shopify, $shop)
// {
//     if (!is_dir(CACHE_PATH . "/" . $shop)) {
//         mkdir(CACHE_PATH . "/" . $shop, 0755, true);
//     }
//     $count = $shopify("GET", "/admin/api/" . apiVersion . "/products/count.json");
//     if ($count > 0) {
//         $pages = ceil($count / LIMIT_PRODUCT_PER_PAGE);
//         for ($i = 0; $i < $pages; $i++) {
//             $key_path = CACHE_PATH . "/" . $shop . "/product_page_" . ($i + 1);
//             $getProducts = $shopify("GET", "/admin/api/" . apiVersion . "/products.json?limit=" . LIMIT_PRODUCT_PER_PAGE . "&page=" . ($i + 1) . "&fields=id,title,handle,image");
//             if (is_array($getProducts) && count($getProducts) > 0) {
//                 file_put_contents($key_path, is_array($getProducts) ? json_encode($getProducts) : $getProducts);
//             }
//         }
//     }
// }
