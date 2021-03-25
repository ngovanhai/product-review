<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type,Accept,Authorization, X-Requested-With');

require '../vendor/autoload.php';
require '../help.php';

$api_version = '2020-10';
// $shop = isset($_GET['shop']) ? $_GET['shop'] : "nguyen-q-huy.myshopify.com";
$_POST = json_decode(file_get_contents("php://input"), true);
if (isset($_POST["action"])) {
    if ($_POST['action'] == "testKey") {
        $data = json_decode(file_get_contents('php://input'), true);
        $recaptcha_url = 'https://www.google.com/recaptcha/api/siteverify';
        $recaptcha_secret = $data['secret'];
        $recaptcha_response = $data['token'];
        $recaptcha = file_get_contents($recaptcha_url . '?secret=' . $recaptcha_secret . '&response=' . $recaptcha_response);
        $recaptcha = json_decode($recaptcha);
        if ($recaptcha->success == true) {
            echo 'success';
        } else {
            echo 'falsed';
        }
    }
}
