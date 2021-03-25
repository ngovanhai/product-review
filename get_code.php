<?php
ini_set('display_errors', TRUE);
error_reporting(E_ALL);
require 'vendor/autoload.php';

use sandeepshetty\shopify_api;

require 'help.php';
if (!empty($_GET['shop']) && !empty($_GET['code'])) {
    $shop = $_GET['shop'];
    $app_settings = db_fetch_row("SELECT * FROM tbl_appsettings WHERE id = $appId");
    $access_token = shopify_api\oauth_access_token($_GET['shop'], $app_settings['api_key'], $app_settings['shared_secret'], $_GET['code']);
    $installed = checkInstalled($db, $shop, $appId);

    // $informationShop =  $shopify("GET", "/admin/api/$api_version/shop.json");
    if ($installed["installed"]) {
        $date_installed = $installed["installed_date"];
        db_insert("tbl_usersettings", [
            'access_token' => $access_token,
            'store_name' => $shop,
            'app_id' => $appId,
            'installed_date' => $date_installed,
            'confirmation_url' => ''
        ]);
        // db_update("shop_installed", [
        //     'email_shop' => $informationShop['email'],
        // ], "shop = '$shop'");
        $date1 = new DateTime($installed["installed_date"]);
        $date2 = new DateTime("now");
        $interval = date_diff($date1, $date2);
        $diff = (int)$interval->format('%R%a');
        $trialTime = $trialTime - $diff;
        if ($trialTime < 0) {
            $trialTime = 0;
        }
    } else {
        db_insert("tbl_usersettings", [
            'access_token' => $access_token,
            'store_name' => $shop,
            'app_id' => $appId,
            'installed_date' => date("Y-m-d H:i:s"),
            'confirmation_url' => ''
        ]);
        db_insert("shop_installed", [
            'shop' => $shop,
            'app_id' => $appId,
            // 'email_shop' => $informationShop['email'],
            'date_installed' => date("Y-m-d H:i:s")
        ]);
    }
    $shopify = shopifyInit($db, $shop, $appId);
    $informationShop =  $shopify("GET", "/admin/api/$api_version/shop.json");
    $email_shop = $informationShop['email'];

    if (getShopSettings($db, $shop) == false) {
        $db->query("insert into custom_reviews_settings(shop,admin_email) values('$shop','$email_shop')");
    } else if (getShopSettings($db, $shop)) {
        db_update("custom_reviews_settings", [
            'admin_email' => $informationShop['email'],
        ], "shop='$shop'");
    }

    //---- CHARGE FEE ----
    $charge = array(
        "recurring_application_charge" => array(
            "name" => $chargeTitle,
            "price" => $price,
            "return_url" => "$rootLink/charge.php?shop=$shop",
            "test" => $testMode,
            "trial_days" => $trialTime
        )
    );
    if ($chargeType == "one-time") {
        $recu = $shopify("POST", "/admin/api/$api_version/application_charges.json", $charge);
    } else {
        $recu = $shopify("POST", "/admin/api/$api_version/recurring_application_charges.json", $charge);
    }
    if (isset($recu["confirmation_url"])) {
        $confirmation_url = $recu["confirmation_url"];
    } else {
        $confirmation_url =  NULL;
    }
    db_update("tbl_usersettings", ['confirmation_url' => $confirmation_url], "store_name = '$shop' and app_id = $appId");

    //hook when user remove app
    $shopify('POST', "/admin/api/$api_version/webhooks.json", array('webhook' => array('topic' => 'app/uninstalled', 'address' => $rootLink . "/webhooks/uninstall.php?shop=$shop", 'format' => 'json')));
    //hook when remove collection
    $shopify('POST', "/admin/api/$api_version/webhooks.json", array('webhook' => array('topic' => 'collections/delete', 'address' => $rootLink . "/webhooks/deleteCollection.php?shop=$shop", 'format' => 'json')));
    //hook when remove products
    $shopify('POST', "/admin/api/$api_version/webhooks.json", array('webhook' => array('topic' => 'products/delete', 'address' => $rootLink . "/webhooks/deleteProduct.php?shop=$shop", 'format' => 'json')));
    $updateStorePlanUrl = $rootLink . "/services.php?action=getStorePlanChange&shop=" . $shop;
    $dataUpdateStorePlan = [
        "webhook" => [
            "topic" => "shop/update",
            "address" =>  $updateStorePlanUrl,
            "format" => "json",
        ]
    ];
    $shopify("POST", "/admin/api/$api_version/webhooks.json", $dataUpdateStorePlan);

    // Gui email cho customer khi cai dat
    require 'plugin/email/install_email.php';
    //put add-compare snippet
    $theme = $shopify("GET", "/admin/api/$api_version/themes.json", array("role" => "main"));
    $data = array(
        "asset" => array(
            "key" => "snippets/ot-collection-reviews.liquid",
            "src" => "$rootLink/ot-collection-reviews.liquid"
        )
    );
    $snippet = $shopify("PUT", "/admin/api/$api_version/themes/" . $theme[0]["id"] . "/assets.json", $data);
    $data1 = array(
        "asset" => array(
            "key" => "snippets/ot-product-reviews-core.liquid",
            "src" => "$rootLink/ot-product-reviews-core.liquid"
        )
    );
    $snippet = $shopify("PUT", "/admin/api/$api_version/themes/" . $theme[0]["id"] . "/assets.json", $data1);

    //add js to shop
    $check = true;
    $putjs1 = $shopify('GET', "/admin/api/$api_version/script_tags.json");
    $script_tagid = 0;
    if ($putjs1) {
        foreach ($putjs1 as $value) {
            if ($value["src"] == $rootLink . '/customerreviews.js') {
                $check = false;
                $script_tagid = $value["id"];
                break;
            }
        }
    }
    if ($check) {
        $putjs = $shopify('POST', "/admin/api/$api_version/script_tags.json", array('script_tag' => array('event' => 'onload', 'src' => $rootLink . '/customerreviews.js?v=' . time())));
        $script_tagid = $putjs["id"];
    }
    // Update script_tag id to database
    $db->query("update custom_reviews_settings set script_tagid = '$script_tagid' where shop = '$shop'");
    if ($chargeType == "free") {
        db_update("tbl_usersettings", ['confirmation_url' => $confirmation_url], "store_name = '$shop' and app_id = $appId");
        header('Location: ' . $rootLink . '/client/build/?shop=' . $shop);
    } else {
        header('Location: ' . $confirmation_url);
    }
}
function checkInstalled($db, $shop, $appId)
{
    $shop_installled = db_fetch_row("select * from shop_installed where shop = '$shop' and app_id = $appId");
    if (count($shop_installled) > 0) {
        $date_instaled = $shop_installled["date_installed"];
        $result = array(
            "installed_date" => $date_instaled,
            "installed" => true
        );
        return $result;
    } else {
        $result = array(
            "installed" => false
        );
        return $result;
    }
}

//huy add
function getShopSettings($db, $shop)
{
    $sql = "SELECT * FROM custom_reviews_settings WHERE shop = '$shop'";
    $query = $db->query($sql);
    if ($query->num_rows > 0) {
        return true;
    } else {
        return false;
    }
}
