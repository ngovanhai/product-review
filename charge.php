<?php
require 'help.php';

session_start(); ?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Recurring Application Charges</title>
</head>

<body>
    <?php

    if (isset($_GET['charge_id'])) {
        $charge_id = $_GET['charge_id'];
        $shop = $_GET['shop'];
        if (isset($_GET['plan'])) {
            $plan = $_GET['plan'];
        } else {
            $plan = 'free';
        }

        $shopify = shopifyInit($db, $shop, $appId);
        $theCharge = $shopify("GET", "/admin/api/$api_version/recurring_application_charges/$charge_id.json");

        if ($theCharge['status'] == 'accepted' || $theCharge['status'] == 'active') {
            activeClient($appId, $shop, $db, $shopify, $charge_id, $rootLink, $plan, $api_version);
        } else {
            header('Location: ' . $rootLink . '/declineCharge.php?shop=' . $shop);
        }
    }
    function activeClient($appId, $shop, $db, $shopify, $charge_id, $rootLink, $plan, $api_version)
    {
        // $recu = $shopify("POST", "/admin/api/$api_version/recurring_application_charges/$charge_id/activate.json");
        db_update(
            "tbl_usersettings",
            [
                'status' => 'active',
                'plan_name' => $plan,
            ],
            "app_id = $appId and store_name = '$shop'"
        );
        header('Location: https://' . $shop . '/admin/apps/customer-reviews-by-omega');
    }
    ?>

</body>

</html>