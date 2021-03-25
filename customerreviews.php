<?php
ini_set('display_errors', TRUE);
error_reporting(E_ALL);
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

require 'vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/phpmailer/phpmailer/src/PHPMailer.php';
require 'vendor/phpmailer/phpmailer/src/SMTP.php';
require 'vendor/phpmailer/phpmailer/src/Exception.php';


use sandeepshetty\shopify_api;

require 'conn-shopify.php';
require 'help.php';
require 'functions.php';
if (isset($_GET["action"])) {
    $action = $_GET["action"];
    $shop = $_GET["shop"];
    $shopify = shopifyInit($db, $shop, $appId);
    $settings = getShopSettings($db, $shop);
    if ($action == "getShopSettings") {
        $expired = checkExpired($db, $shop, $appId, $trialTime);
        $theme = strtolower(getMainThemeName($shopify, $api_version));
        $themeLists = file_get_contents(APP_PATH . "/checkTheme.json");
        $themeLists = json_decode($themeLists);
        $settings['position'] = ".page-container .product-single";
        // $settings['position'] = "";
        $settings['class'] = "ot-customer-reviews insert-automatic";
        if ($theme == "boundless") $settings['class'] .= " container";
        elseif ($theme == "empire") $settings['class'] .= " product-section--container";
        foreach ($themeLists as $value) {
            if ($value->name == $theme) {
                $settings['position'] = $value->product_content;
            }
        }
        $response = array(
            "settings"  => $settings,
            "expired"   => $expired
        );
        echo json_encode($response);
    }
    if ($action == "getCustomerReviews") {
        $productid = isset($_GET["productid"]) ? $_GET["productid"] : 0;
        if ($productid !== 0) {
            $isCustomer = $_GET["customer"];
            $data = $shopify("GET", "/admin/api/" . $api_version . "/products/$productid.json?fields=id,title,handle");
            $productname = $data["title"];
            $allReviews = getAllReviews($db, $shop, $productid, $settings["show_featured"]);
            $countAll = countAllReviews($db, $shop, $productid, $settings["show_featured"]);
            $html = loadGlobalStyle($settings, $countAll, $isCustomer);
            if ($settings["app_layout"] == 1) {
                include('layout/overstock.php');
            } elseif ($settings["app_layout"] == 2) {
                include('layout/collateral.php');
            } elseif ($settings["app_layout"] == 3) {
                include('layout/masonry.php');
            }
            $response = array(
                "html" => $html,
            );
            echo json_encode($response);
        }
    }
    if ($action == "getProductStarReviews") {
        $productId = isset($_GET["productid"]) ? $_GET["productid"] : 0;
        if ($productId !== 0) {

            $reviews = getAllReviews($db, $shop, $productId, $settings["show_featured"]);

            $html = "<style>" . changeRatingStarStyle(0, $settings['star_style']) . "</style>";
            if (count($reviews) == 0) {
                $avarage_point = 0;
                $avarage_review = 0;
            } else {
                $avarage_point = averageRatingPoint($reviews);
                $avarage_review = ($avarage_point / 5) * 100;
            }
            $html .= "";
            for ($i = 5; $i > 0; $i--) {
                $html .= appCartRating($rootLink, $reviews, $i, $settings['star_style']);
            }
            $response = array(
                "count" => count($reviews),
                "avarage_point" => $avarage_point,
                "avarage_review" => $avarage_review,
                "html" => $html,
            );
            echo json_encode($response);
        }
    }
    if ($action == "getProductReviews") {
        $productId = isset($_GET["productid"]) ? $_GET["productid"] : 0;
        if ($productId !== 0) {
            $reviews = getAllReviews($db, $shop, $productId, $settings["show_featured"]);
            $html = changeRatingStarStyle(0, $settings['star_style']);
            $count = "";
            $avarage = 0;
            if (count($reviews) > 0) {
                if (count($reviews) == 1) $count = '1 review';
                else $count = count($reviews) . ' reviews';
                $avarage_point = averageRatingPoint($reviews);
                $avarage = ($avarage_point / 5) * 100;
                $html = changeRatingStarStyle($avarage_point, $settings['star_style']);
            }
            $response = array(
                "html" => $html,
                "count" => $count,
                "avarage" => $avarage,
            );
            echo json_encode($response);
        }
    }
    // Asking customer for a review
    if ($action == "lastBoughtProductReview") {
        $boughtProducts = array();
        if (isset($_GET["customerId"])) {
            $customerId = $_GET["customerId"];
            $numberBoughtProduct = intval($_GET["numberBoughtProduct"]);
            $customer = $shopify('GET', "/admin/api/" . $api_version . "/customers/{$customerId}.json");
            $customerEmail = $customer["email"];
            $orders = $shopify('GET', "/admin/api/" . $api_version . "/customers/$customerId/orders.json?financial_status='paid'");
            foreach ($orders as $order) {
                foreach ($order["line_items"] as $item) {
                    $id = strval($item["product_id"]);
                    if (checkExistBoughtProduct($id, $boughtProducts) == 0 && checkReviewBoughtProduct($db, $shop, $id, $customerEmail) == true && $key < $numberBoughtProduct) {
                        $product = $shopify("GET", "/admin/api/" . $api_version . "/products/$id.json?fields=id,title,handle,image");
                        if (is_array($product)) {
                            $boughtProducts[] = $product;
                        }
                    }
                }
            }
        }
        echo json_encode($boughtProducts);
    }
    // Review Badge Box
    if ($action == "featuredReviewsBadgeBox") {
        $featuredReviews = getAllFeaturedReviews($db, $shop);
        if (count($featuredReviews) > 0) {
            $avarage_point = averageRatingPoint($featuredReviews);
            $avarage_review = ($avarage_point / 5) * 100;
        } else {
            $avarage_point = 0;
            $avarage_review = 0;
        }
        $response = array(
            "count" => count($featuredReviews),
            "avarage_point" => $avarage_point,
            "avarage_review" => $avarage_review,
        );
        echo json_encode($response);
    }
    if ($action == "getTotalPage") {
        $id = $_GET["id"];
        $condition1 = $_GET["condition1"];
        $condition2 = $_GET["condition2"];
        $count = countAllReviewsByCondition($db, $shop, $id, $settings["show_featured"], $condition1, $condition2);
        $pages = ceil($count / $settings["reviews_per_page"]);
        echo json_encode($pages);
    }
    if ($action == "loadReviewContent") {
        $id = $_GET["id"];
        $condition1 = $_GET["condition1"];
        $condition2 = $_GET["condition2"];
        $data = $shopify("GET", "/admin/api/" . $api_version . "/products/$id.json?fields=id,title,handle");
        $producturl = "https://" . $shop . "/products/" . $data["handle"];
        $page = $_GET["page"];
        $limit = $_GET["limit"];
        $reviews = getShopReviews($db, $shop, $id, $settings["show_featured"], $limit, $page, $condition1, $condition2);
        $html = "";
        if ($settings["app_layout"] == 1) {
            foreach ($reviews as $review) {
                $html .= genHtmlReviewLayoutOverstock($rootLink, $settings["show_purchase"], $settings["show_recommend"], $review, $shop, $producturl, $settings);
            }
        } elseif ($settings["app_layout"] == 2) {
            foreach ($reviews as $review) {
                $html .= genHtmlReviewLayoutCollateral($rootLink, $review, $shop, $producturl, $settings["show_purchase"], $settings["show_recommend"], $settings["form_rating"], $settings);
            }
        } elseif ($settings["app_layout"] == 3) {
            foreach ($reviews as $review) {
                $html .= genHtmlReviewLayoutMasonry($rootLink, $review, $shop, $producturl, $settings["show_purchase"], $settings["show_recommend"], $settings);
            }
        }
        echo json_encode($html);
    }
}
if (isset($_POST['action'])) {
    $action     = $_POST['action'];
    $shop       = $_POST["shop"];
    if ($action == "voteUpReview") {
        $id = $_POST["reviewId"];
        $thanked = intval($_POST["thanked"]);
        $thanked++;
        $db->query("UPDATE custom_reviews_database SET review_thanked='$thanked' WHERE shop = '$shop' AND id = '$id'");
        echo $thanked;
    }
    if ($action == "voteDownReview") {
        $id = $_POST["reviewId"];
        $thanked = intval($_POST["thanked"]);
        $thanked--;
        $db->query("UPDATE custom_reviews_database SET review_thanked='$thanked' WHERE shop = '$shop' AND id = '$id'");
        echo $thanked;
    }
    if ($action == "submitReviewForm") {
        $shopify = shopifyInit($db, $shop, $appId);
        $shopInfo = $shopify("GET", "/admin/api/" . $api_version . "/shop.json");
        $productid = $_POST['productid'];
        $data = $shopify("GET", "/admin/api/" . $api_version . "/products/$productid.json");
        $productname = $data["title"];
        $producturl = "<a target='_blank' href='https://" . $shop . "/products/" . $data["handle"] . "'>" . $productname . "</a>";
        $product_url = "https://" . $shop . "/products/" . $data["handle"];
        $product_recommend = $_POST['data']['product_recommend'];
        $reviewer_name = testInputData($_POST['data']['reviewer_name']);
        $reviewer_title = testInputData($_POST['data']['reviewer_title']);
        $reviewer_mess = testInputData($_POST['data']['reviewer_mess']);
        $reviewer_email = testInputData($_POST['data']['reviewer_email']);
        $publishdate = date("Y-m-d H:i:s");
        $settings = getShopSettings($db, $shop);
        $orders = $shopify("GET", "/admin/api/" . $api_version . "/orders.json");
        $purchase = checkPurchase($shopify, $reviewer_email, $api_version);
        if ($settings["auto_publish"] == 1) $publish = 1;
        else $publish = 0;
        $reviewer_rating = $_POST['data']['reviewer_rating'];

        $recaptcha_url = 'https://www.google.com/recaptcha/api/siteverify';
        $recaptcha_secret = $_POST['data']['secretKey'];
        $recaptcha_response = $_POST['data']['token'];
        $statusCaptcha = $_POST['data']['statusCaptcha'];
        if ($statusCaptcha == 'yesCaptcha' && $recaptcha_secret !== '' && $recaptcha_secret !== null &&  $recaptcha_response !== '') { //nếu khách đang enable captcha
            $recaptcha = file_get_contents($recaptcha_url . '?secret=' . $recaptcha_secret . '&response=' . $recaptcha_response);
            $recaptcha = json_decode($recaptcha);
            if ($recaptcha->success == true) {  //nếu captcha đúng
                if ($recaptcha->score >= 0.5) {
                    if ($settings['admin_send_mail'] == 1 && $settings['admin_email'] != '') {
                        $notification_subject = 'New review for "%s" product';
                        $notification_content = '<p>You have new review:</p><p>Product: %s</p><p>Name: %s</p><p>Rating: %d</p><p>Review: %s</p>';
                        $mail = emailInit();
                        $mail->setFrom('do_not_reply@omegatheme.com', $shopInfo["name"]);
                        $mail->addAddress($settings['admin_email']);
                        //Content
                        $mail->isHTML(true);                                  // Set email format to HTML
                        $mail->Subject = sprintf($notification_subject, $productname);
                        $mail->Body    = sprintf($notification_content, $producturl, $reviewer_name, $reviewer_rating, $reviewer_mess);

                        $mail->send();
                    }
                    if ($settings['send_mail'] == 1) {
                        $confirm_subject = 'Thanks for your review';
                        $confirm_content = "<p>Dear %s,</p><p>Thank you for sending us a review about one of our products</p><p>We'll check and approve it later.</p>";
                        $mail = emailInit();
                        $mail->setFrom('do_not_reply@omegatheme.com', $shopInfo["name"]);
                        $mail->addAddress($reviewer_email, $reviewer_title);     // Add a recipient

                        //Content
                        $mail->isHTML(true);                                  // Set email format to HTML
                        $mail->Subject = $confirm_subject;
                        $mail->Body    = sprintf($confirm_content, $reviewer_name);

                        $mail->send();
                    }
                    $checkSize = true;
                    if (isset($_POST['data']["statusImage"]) && $_POST['data']["statusImage"] == 'true') {
                        $sql = "insert into custom_reviews_database(reviewer_rating, product_id, reviewer_name, reviewer_email, reviewer_title, reviewer_mess, product_recommend, purchase, publish, publishdate, shop) values('" . $reviewer_rating . "', '" . 1 . "', '" . $reviewer_name . "', '" . $reviewer_email . "', '" . $reviewer_title . "', '" . $reviewer_mess . "', '" . $product_recommend . "', '" . $purchase . "', '" . $publish . "', '" . $publishdate . "', '" . $shop . "')";
                        $query = $db->query($sql);
                        $id = mysqli_insert_id($db);
                        $newReviewProduct = [
                            "shop" => $shop,
                            "review_id" => $id,
                            "product_id" => $productid
                        ];
                        db_insert('custom_reviews_connect_products_and_reviews', $newReviewProduct);
                        if ($query) {
                            $flag = 0;
                            $insertImagesSql = "";
                            if (isset($_POST['data']["review_images"]) && count($_POST['data']["review_images"]) > 0) {
                                for ($i = 0; $i < count($_POST['data']["review_images"]); $i++) {
                                    if ($flag == 0) $insertImagesSql .= "('" . $id . "', '" . $_POST['data']["review_images"][$i]["url"] . "', '" . $_POST['data']["review_images"][$i]["name"] . "',  '" . $productid . "', '" . $shop . "')";
                                    else $insertImagesSql .= ",('" . $id . "', '" . $_POST['data']["review_images"][$i]["url"] . "', '" . $_POST['data']["review_images"][$i]["name"] . "', '" . $productid . "', '" . $shop . "')";
                                    $flag++;
                                }
                            }
                            if ($insertImagesSql != "") {
                                $sql = "INSERT INTO custom_reviews_images (review_id, url, name, product_id, shop) VALUES " . $insertImagesSql . ";";
                                $db->query($sql);
                            }
                            echo json_encode('success');
                        } else {
                            echo json_encode('fail');
                        }
                    } else {
                        echo json_encode('errorImages');
                    }
                    exit;
                } else {
                    echo json_encode('fail');
                    exit;
                }
            } else { //nếu captcha sai -> vẫn cho khách đánh giá review nhưng k đc captcha bảo vệ
                if ($settings['admin_send_mail'] == 1 && $settings['admin_email'] != '') {
                    $notification_subject = 'New review for "%s" product';
                    $notification_content = '<p>You have new review:</p><p>Product: %s</p><p>Name: %s</p><p>Rating: %d</p><p>Review: %s</p>';
                    $mail = emailInit();
                    $mail->setFrom('do_not_reply@omegatheme.com', $shopInfo["name"]);
                    $mail->addAddress($settings['admin_email']);     // Add a recipient
                    //Content
                    $mail->isHTML(true);                                  // Set email format to HTML
                    $mail->Subject = sprintf($notification_subject, $productname);
                    $mail->Body    = sprintf($notification_content, $producturl, $reviewer_name, $reviewer_rating, $reviewer_mess);

                    $mail->send();
                    // echo pr($mail);
                }
                if ($settings['send_mail'] == 1) {
                    $confirm_subject = 'Thanks for your review';
                    $confirm_content = "<p>Dear %s,</p><p>Thank you for sending us a review about one of our products</p><p>We'll check and approve it later.</p>";
                    $mail = emailInit();
                    $mail->setFrom('do_not_reply@omegatheme.com', $shopInfo["name"]);
                    $mail->addAddress($reviewer_email, $reviewer_title);     // Add a recipient

                    //Content
                    $mail->isHTML(true);                                  // Set email format to HTML
                    $mail->Subject = $confirm_subject;
                    $mail->Body    = sprintf($confirm_content, $reviewer_name);

                    $mail->send();
                }
                $checkSize = true;
                if (isset($_POST['data']["statusImage"]) && $_POST['data']["statusImage"] == 'true') {
                    $sql = "insert into custom_reviews_database(reviewer_rating, product_id, reviewer_name, reviewer_email, reviewer_title, reviewer_mess, product_recommend, purchase, publish, publishdate, shop) values('" . $reviewer_rating . "', '" . 1 . "', '" . $reviewer_name . "', '" . $reviewer_email . "', '" . $reviewer_title . "', '" . $reviewer_mess . "', '" . $product_recommend . "', '" . $purchase . "', '" . $publish . "', '" . $publishdate . "', '" . $shop . "')";
                    $query = $db->query($sql);
                    $id = mysqli_insert_id($db);
                    $newReviewProduct = [
                        "shop" => $shop,
                        "review_id" => $id,
                        "product_id" => $productid
                    ];
                    db_insert('custom_reviews_connect_products_and_reviews', $newReviewProduct);
                    if ($query) {
                        $flag = 0;
                        $insertImagesSql = "";
                        if (isset($_POST['data']["review_images"]) && count($_POST['data']["review_images"]) > 0) {
                            for ($i = 0; $i < count($_POST['data']["review_images"]); $i++) {
                                if ($flag == 0) $insertImagesSql .= "('" . $id . "', '" . $_POST['data']["review_images"][$i]["url"] . "', '" . $_POST['data']["review_images"][$i]["name"] . "',  '" . $productid . "', '" . $shop . "')";
                                else $insertImagesSql .= ",('" . $id . "', '" . $_POST['data']["review_images"][$i]["url"] . "', '" . $_POST['data']["review_images"][$i]["name"] . "', '" . $productid . "', '" . $shop . "')";
                                $flag++;
                            }
                        }
                        if ($insertImagesSql != "") {
                            $sql = "INSERT INTO custom_reviews_images (review_id, url, name, product_id, shop) VALUES " . $insertImagesSql . ";";
                            $db->query($sql);
                        }
                        echo json_encode('success');
                    } else {
                        echo json_encode('fail');
                    }
                } else {
                    echo json_encode('errorImages');
                }
                exit;
            }
        } else { //nếu khách chua enable captcha
            if ($settings['admin_send_mail'] == 1 && $settings['admin_email'] != '') {
                $notification_subject = 'New review for "%s" product';
                $notification_content = '<p>You have new review:</p><p>Product: %s</p><p>Name: %s</p><p>Rating: %d</p><p>Review: %s</p>';
                $mail = emailInit();
                $mail->setFrom('do_not_reply@omegatheme.com', $shopInfo["name"]);
                $mail->addAddress($settings['admin_email']);     // Add a recipient
                //Content
                $mail->isHTML(true);                                  // Set email format to HTML
                $mail->Subject = sprintf($notification_subject, $productname);
                $mail->Body    = sprintf($notification_content, $producturl, $reviewer_name, $reviewer_rating, $reviewer_mess);

                $mail->send();
                // echo pr($mail);
            }
            if ($settings['send_mail'] == 1) {
                $confirm_subject = 'Thanks for your review';
                $confirm_content = "<p>Dear %s,</p><p>Thank you for sending us a review about one of our products</p><p>We'll check and approve it later.</p>";
                $mail = emailInit();
                $mail->setFrom('do_not_reply@omegatheme.com', $shopInfo["name"]);
                $mail->addAddress($reviewer_email, $reviewer_title);     // Add a recipient

                //Content
                $mail->isHTML(true);                                  // Set email format to HTML
                $mail->Subject = $confirm_subject;
                $mail->Body    = sprintf($confirm_content, $reviewer_name);

                $mail->send();
            }
            $checkSize = true;
            if (isset($_POST['data']["statusImage"]) && $_POST['data']["statusImage"] == 'true') {
                $sql = "insert into custom_reviews_database(reviewer_rating, product_id, reviewer_name, reviewer_email, reviewer_title, reviewer_mess, product_recommend, purchase, publish, publishdate, shop) values('" . $reviewer_rating . "', '" . 1 . "', '" . $reviewer_name . "', '" . $reviewer_email . "', '" . $reviewer_title . "', '" . $reviewer_mess . "', '" . $product_recommend . "', '" . $purchase . "', '" . $publish . "', '" . $publishdate . "', '" . $shop . "')";
                $query = $db->query($sql);
                $id = mysqli_insert_id($db);
                $newReviewProduct = [
                    "shop" => $shop,
                    "review_id" => $id,
                    "product_id" => $productid
                ];
                db_insert('custom_reviews_connect_products_and_reviews', $newReviewProduct);
                if ($query) {
                    $flag = 0;
                    $insertImagesSql = "";
                    if (isset($_POST['data']["review_images"]) && count($_POST['data']["review_images"]) > 0) {
                        for ($i = 0; $i < count($_POST['data']["review_images"]); $i++) {
                            if ($flag == 0) $insertImagesSql .= "('" . $id . "', '" . $_POST['data']["review_images"][$i]["url"] . "', '" . $_POST['data']["review_images"][$i]["name"] . "',  '" . $productid . "', '" . $shop . "')";
                            else $insertImagesSql .= ",('" . $id . "', '" . $_POST['data']["review_images"][$i]["url"] . "', '" . $_POST['data']["review_images"][$i]["name"] . "', '" . $productid . "', '" . $shop . "')";
                            $flag++;
                        }
                    }
                    if ($insertImagesSql != "") {
                        $sql = "INSERT INTO custom_reviews_images (review_id, url, name, product_id, shop) VALUES " . $insertImagesSql . ";";
                        $db->query($sql);
                    }
                    echo json_encode('success');
                } else {
                    echo json_encode('fail');
                }
            } else {
                echo json_encode('errorImages');
            }
        }
    }
}
if (isset($_POST['uploadReviewImages'])) {
    $shop = $_POST['uploadReviewImages'];
    $numberOfImages = $_POST['numberOfImages'];
    $shopify = shopifyInit($db, $shop, $appId);
    $themeId = getMainThemeId($shopify, $api_version);
    $images = array();
    $checkSize = true;
    for ($i = 0; $i < $numberOfImages; $i++) {
        if (isset($_FILES['image' . $i]["name"])) {
            $fileSize = $_FILES['image' . $i]['size'];
            if ($fileSize > 1048576) {
                $checkSize = false;
            }
        }
    }
    if ($checkSize) {
        for ($i = 0; $i < $numberOfImages; $i++) {
            if (isset($_FILES['image' . $i]["name"])) {
                $filename = $_FILES['image' . $i]['name'];
                $tmpname = $_FILES['image' . $i]['tmp_name'];
                $filename = FixSpecialChars($filename);
                $tmpname = FixSpecialChars($tmpname);
                $target_file =  "/upload/" . basename($filename);
                move_uploaded_file($tmpname, APP_PATH . $target_file);

                $rand = rand(0, 10000);
                $imgUrl = $rootLink . $target_file;

                $result = $shopify('PUT', "/admin/api/$api_version/themes/" . $themeId . '/assets.json', array('asset' => array('key' => 'assets/' . $rand . '_' . $filename . '', 'src' => $imgUrl)));
                unlink(APP_PATH . $target_file);
                if (isset($result['public_url'])) {
                    $image = array(
                        "url" => $result['public_url'],
                        "name" => $rand . '_' . $filename
                    );
                    $images[] = (object)$image;
                }
            }
        }
    }
    $response = [
        'images' => $images,
        'status' => $checkSize
    ];
    echo json_encode($response);
}
function getMainThemeId($shopify, $api_version)
{
    $themes = $shopify('GET', "/admin/api/" . $api_version . "/themes.json");
    foreach ($themes as $theme) {
        if ($theme["role"] == 'main') $id = $theme["id"];
    }
    return $id;
}
function getMainThemeName($shopify, $api_version)
{
    $themes = $shopify('GET', "/admin/api/" . $api_version . "/themes.json");
    foreach ($themes as $theme) {
        if ($theme["role"] == 'main') $result = $theme["name"];
    }
    return $result;
}
function loadGlobalStyle($settings, $count, $isCustomer)
{
    $html = "<style>";
    if ($count == 0) $html .= '.ot-customer-reviews .customer-reviews-content{display: none;}';
    if ($isCustomer == '') $html .= '.ot-customer-reviews .reviewLink .reviewLink-question,.ot-customer-reviews .reviewLink .review-vote-button,.ot-customer-reviews .reviewLink .reviewLink-masonry-result{display: none;}';
    $html .= " .ot-customer-reviews .review-pagination .page-link {color:" . $settings["button_color"] . "}
                .ot-customer-reviews #submit-review-submit,.ot-customer-reviews #submit-review-submit:hover,
                .ot-customer-reviews .review-button button,.ot-customer-reviews .review-button button:hover,.ot-customer-reviews .review-button button:focus,
                .ot-customer-reviews .reviews-form #ot-file-upload-btn,.ot-customer-reviews .reviews-form #ot-file-upload-btn:hover {background: " . $settings["button_color"] . ";color: " . $settings["button_textcolor"] . ";border: none;}
                .ot-customer-reviews .review-pagination .page-item.active .page-link{border-color:" . $settings["button_color"] . "}
                .ot-customer-reviews .customer-reviews-col-1 .progress-value,.ot-product-star-reviews .progress-value{background: " . $settings["progress_color"] . ";}"
        // . changeRatingStarStyle($settings["star_style"])
        . $settings["customcss"]
        . "</style><input type=hidden value='' name=ot_recaptcha_response id=ot_recaptchaResponse>";
    return $html;
}
// <span class='reviewTitle'>" . $review["reviewer_title"] . "</span><span class='reviewName'>By " . $review["reviewer_name"] . "</span> " . $purchase

function genHtmlReviewLayoutOverstock($rootLink, $show_purchase, $show_recommend, $review, $shop, $producturl, $settings)
{
    $vote = $review['reviewer_rating'] * 15;
    $reviewAgo = publishDateCalculate($review["publishdate"]);
    if ($show_recommend == '1') $recommend = checkRecommendCustomer($rootLink, $review['product_recommend']);
    else $recommend = "";
    if ($show_purchase == '1') $purchase = checkPurchasedCustomer($review['purchase']);
    else $purchase = "";
    $review['review_thanked'] = intval($review['review_thanked']);
    $reviewthank = '<span id="text-success-' . $review['id'] . '" class="text-success"></span>';
    if ($review['review_thanked'] == 1) $reviewthank = '<span id="text-success-' . $review['id'] . '" class="text-success">1 customer thought this review helpful!</span>';
    elseif ($review['review_thanked'] > 1) $reviewthank = '<span id="text-success-' . $review['id'] . '" class="text-success">' . $review['review_thanked'] . ' customers thought this review helpful!</span>';
    $reviewImages = genReviewImages($review['id'], $review['images']);
    $styleStar = changeRatingStarStyle($review['reviewer_rating'], $settings['star_style']);
    $html = "<div class='review-item' id='review-item-" . $review["id"] . "' data-thank='" . $review["review_thanked"] . "' data-purchase=" . $review["purchase"] . " data-time='" . strtotime($review["publishdate"]) . "' data-rating='" . $review['reviewer_rating'] . "'>
            " . $styleStar . "
            <div class='avatarAndName'><i  class='fas fa-user-circle avatar'></i><span class='reviewName'>" . $review["reviewer_name"] . "</span> " . $purchase . "<p style='color:#22b345;margin:0px 10px 0px'>|</p>" . $recommend . " </div>"
        . "<div class='reviewDate'>- " . $reviewAgo . " -</div>
                <span class='reviewTitle'>" . $review["reviewer_title"] . "</span>
        
                <div class='reviewContent'>
                    <div>" . $review["reviewer_mess"] . "</div>
                </div>
                " . $reviewImages . "
                <div class='reviewLink'>
                    " . $reviewthank . "
                    <span class='reviewLink-question' id='reviewLink-question-" . $review['id'] . "'>Was this review helpful to you?</span>
                    <a id='review-vote-up-" . $review['id'] . "' class='review-vote-button review-vote-up' onclick='voteUpReview({$review['id']})'></a>";
    if ($review['review_thanked'] > 0) {
        $html .=    "<a id='review-vote-down-" . $review['id'] . "' class='review-vote-button review-vote-down' onclick='voteDownReview({$review['id']})'></a>";
    } else {
        $html .=    "<a id='review-vote-down-" . $review['id'] . "' class='review-vote-button review-vote-down hideButton' onclick='voteDownReview({$review['id']})'></a>";
    }
    $html .=        "<input type='hidden' id='vote_review_" . $review['id'] . "' value='" . $review["review_thanked"] . "'>
                </div>
            </div>";
    return $html;
}
function genHtmlReviewLayoutCollateral($rootLink, $review, $shop, $producturl, $show_purchase, $show_recommend, $form_rating, $settings)
{
    $vote = $review['reviewer_rating'] * 15;
    $reviewAgo = publishDateCalculate($review["publishdate"]);
    if ($show_recommend == '1') $recommend = checkRecommendCustomer($rootLink, $review['product_recommend']);
    else $recommend = "";
    if ($show_purchase == '1') $purchase = checkPurchasedCustomer($review['purchase']);
    else $purchase = "";
    $review['review_thanked'] = intval($review['review_thanked']);
    $reviewthank = '<span id="text-success-' . $review['id'] . '" class="text-success"></span>';
    if ($review['review_thanked'] == 1) $reviewthank = '<span id="text-success-' . $review['id'] . '" class="text-success">1 customer thought this review helpful!</span>';
    elseif ($review['review_thanked'] > 1) $reviewthank = '<span id="text-success-' . $review['id'] . '" class="text-success">' . $review['review_thanked'] . ' customers thought this review helpful!</span>';
    $reviewImages = genReviewImages($review['id'], $review['images']);
    $styleStar = changeRatingStarStyle($review['reviewer_rating'], $settings['star_style']);
    $html = "<div class='review-item' data-thank='" . $review["review_thanked"] . "' data-purchase=" . $review["purchase"] . " data-time='" . strtotime($review["publishdate"]) . "' data-rating='" . $review['reviewer_rating'] . "'>
                <div class='reviewPreContent'>
                    <span class='reviewTitle'>" . $review["reviewer_title"] . "</span>
                    <span class='reviewName'>Reviewed by " . $review["reviewer_name"] . " (" . $reviewAgo . ")</span>
                </div>
                <div class='reviewContent'>"
        . $recommend . " " . $purchase
        . "<div>" . $review["reviewer_mess"] . "</div>
                    <label class='rating-title'>" . $form_rating . ":</label>
                    " . $styleStar . "
                </div>
                " . $reviewImages . "
                <div class='reviewLink'>
                    " . $reviewthank . "
                    <span class='reviewLink-question' id='reviewLink-question-" . $review['id'] . "'>Was this review helpful to you?</span>
                    <a id='review-vote-up-" . $review['id'] . "' class='review-vote-button review-vote-up' onclick='voteUpReview({$review['id']})'></a>";
    if ($review['review_thanked'] > 0) {
        $html .=    "<a id='review-vote-down-" . $review['id'] . "' class='review-vote-button review-vote-down' onclick='voteDownReview({$review['id']})'></a>";
    } else {
        $html .=    "<a id='review-vote-down-" . $review['id'] . "' class='review-vote-button review-vote-down hideButton' onclick='voteDownReview({$review['id']})'></a>";
    }
    $html .=        "<input type='hidden' id='vote_review_" . $review['id'] . "' value='" . $review["review_thanked"] . "'>
                </div>
            </div>";
    return $html;
}
function genHtmlReviewLayoutMasonry($rootLink, $review, $shop, $producturl, $show_purchase, $show_recommend, $settings)
{
    $vote = $review['reviewer_rating'] * 15;
    if ($show_recommend == '1') $recommend = checkRecommendCustomerMasonryLayout($rootLink, $review['product_recommend']);
    else $recommend = "";
    if ($show_purchase == '1') $purchase = checkPurchasedCustomerMasonryLayout($rootLink, $review['purchase']);
    else $purchase = "";
    $review['review_thanked'] = intval($review['review_thanked']);
    $reviewImages = genReviewImages($review['id'], $review['images']);

    $html = "<div class='review-item' data-thank='" . $review["review_thanked"] . "' data-purchase=" . $review["purchase"] . " data-time='" . strtotime($review["publishdate"]) . "' data-rating='" . $review['reviewer_rating'] . "'>
                <div class='review-item-wrap'>
                    <div class='review-item-thumbnail'>";
    if (count($review['images']) > 0) {
        if (count($review['images']) > 1) {
            $html .=    "<div class='count-img' count-img='" . count($review['images']) . "'>" . count($review['images']) . "</div>";
        }
        $html .=        $reviewImages;
    }
    $styleStar = changeRatingStarStyle($review['reviewer_rating'], $settings['star_style']);
    $html .= "<div class='reviewName'><div class='avatarAndName'><i  class='fas fa-user-circle avatar'></i><span>" . $review["reviewer_name"] . "</span>" . $purchase . "</div></div>
    </div>
    <div class='review-item-desc'>
        <div class='review-item-desc-content'>
            <div class='review-item-header clearfix'>
            " . $styleStar . "
            </div>
            <div class='reviewTitle'>" . $recommend . $review["reviewer_title"] . "</div>
            <div class='review-item-mess'>" . $review["reviewer_mess"] . "</div>
            <div class='reviewLink'>
                <span class='reviewLink-question' id='reviewLink-question-" . $review['id'] . "'></span>
                <span id='reviewLink-masonry-result-" . $review['id'] . "' class='reviewLink-masonry-result'>" . $review["review_thanked"] . "</span>
                <a id='review-vote-up-" . $review['id'] . "' class='review-vote-button review-vote-up' onclick='voteUpMasonryReview({$review['id']})'></a>";
    if ($review['review_thanked'] > 0) {
        $html .=                "<a id='review-vote-down-" . $review['id'] . "' class='review-vote-button review-vote-down' onclick='voteDownMasonryReview({$review['id']})'></a>";
    } else {
        $html .=                "<a id='review-vote-down-" . $review['id'] . "' class='review-vote-button review-vote-down hideButton' onclick='voteDownReview({$review['id']})'></a>";
    }
    $html .=                    "<input type='hidden' id='vote_review_" . $review['id'] . "' value='" . $review["review_thanked"] . "'>
                                <time class='reviewDate'> " . date("m/d/Y", strtotime($review["publishdate"])) . "</time>
                            </div>
                        </div>
                    </div>
                </div>
            </div>";

    return $html;
}
function getAllReviews($db, $shop, $id, $show_featured)
{

    $result = array();
    if ($show_featured == "1") {

        $reviewIDInProducts = db_fetch_array("SELECT review_id FROM custom_reviews_connect_products_and_reviews WHERE shop = '$shop' AND product_id = $id");
        foreach ($reviewIDInProducts as $objIDInProducts) {
            $id_ReviewProduct = $objIDInProducts["review_id"];
            $arrayReviewIDProducts = db_fetch_array("SELECT * FROM custom_reviews_database WHERE shop = '$shop' AND id = $id_ReviewProduct AND featured = '1' AND publish = '1'");
            $result = array_merge($result, $arrayReviewIDProducts);
        }

        $arrayProductType = db_fetch_array("SELECT product_type FROM custom_reviewss_products WHERE shop = '$shop' AND products_id = $id");
        $productType = isset($arrayProductType[0]["product_type"]) ? $arrayProductType[0]["product_type"] : "";
        $arrayIDInType = db_fetch_array("SELECT id FROM custom_reviews_product_type WHERE shop = '$shop' AND product_type = '$productType'");
        foreach ($arrayIDInType as $objType) {
            $id_type = $objType["id"];
            $arrayReviewIDTypes = db_fetch_array("SELECT review_id FROM custom_reviews_connect_product_types_and_reviews WHERE shop = '$shop' AND id_product_type = $id_type");
            foreach ($arrayReviewIDTypes as $idReviewsInType) {
                $idReviewInType = $idReviewsInType["review_id"];
                $allReviewInType = db_fetch_array("SELECT * FROM custom_reviews_database WHERE shop = '$shop' AND id = $idReviewInType AND featured = '1' AND publish = '1'");
                $result = array_merge($result, $allReviewInType);
            }
        }
        $arrayIdCollection = db_fetch_array("SELECT collection_id FROM custom_reviews_connect_collections_and_products WHERE shop = '$shop' AND product_id = $id");
        foreach ($arrayIdCollection as $objCollection) {
            $id_collection = $objCollection["collection_id"];
            $reviewIDInCollection = db_fetch_array("SELECT review_id FROM custom_reviews_connect_collections_and_reviews WHERE shop = '$shop' AND collection_id = $id_collection");
            foreach ($reviewIDInCollection as $reviewInCollection) {
                $idReview = $reviewInCollection["review_id"];
                $allReviewInCollection = db_fetch_array("SELECT * FROM custom_reviews_database WHERE shop = '$shop' AND id = $idReview AND featured = '1' AND publish = '1'");
                $result = array_merge($result, $allReviewInCollection);
            }
        }
    } else {
        $reviewIDInProducts = db_fetch_array("SELECT review_id FROM custom_reviews_connect_products_and_reviews WHERE shop = '$shop' AND product_id = $id");
        foreach ($reviewIDInProducts as $objIDInProducts) {
            $id_ReviewProduct = $objIDInProducts["review_id"];
            $arrayReviewIDProducts = db_fetch_array("SELECT * FROM custom_reviews_database WHERE shop = '$shop' AND id = $id_ReviewProduct AND publish = '1'");
            $result = array_merge($result, $arrayReviewIDProducts);
        }

        $arrayProductType = db_fetch_array("SELECT product_type FROM custom_reviewss_products WHERE shop = '$shop' AND products_id = $id");
        $productType = isset($arrayProductType[0]["product_type"]) ? $arrayProductType[0]["product_type"] : "";
        $arrayIDInType = db_fetch_array("SELECT id FROM custom_reviews_product_type WHERE shop = '$shop' AND product_type = '$productType'");
        foreach ($arrayIDInType as $objType) {
            $id_type = $objType["id"];
            $arrayReviewIDTypes = db_fetch_array("SELECT review_id FROM custom_reviews_connect_product_types_and_reviews WHERE shop = '$shop' AND id_product_type = $id_type");
            foreach ($arrayReviewIDTypes as $idReviewsInType) {
                $idReviewInType = $idReviewsInType["review_id"];
                $allReviewInType = db_fetch_array("SELECT * FROM custom_reviews_database WHERE shop = '$shop' AND id = $idReviewInType AND publish = '1'");
                $result = array_merge($result, $allReviewInType);
            }
        }
        $arrayIdCollection = db_fetch_array("SELECT collection_id FROM custom_reviews_connect_collections_and_products WHERE shop = '$shop' AND product_id = $id");
        foreach ($arrayIdCollection as $objCollection) {
            $id_collection = $objCollection["collection_id"];
            $reviewIDInCollection = db_fetch_array("SELECT review_id FROM custom_reviews_connect_collections_and_reviews WHERE shop = '$shop' AND collection_id = $id_collection");
            foreach ($reviewIDInCollection as $reviewInCollection) {
                $idReview = $reviewInCollection["review_id"];
                $allReviewInCollection = db_fetch_array("SELECT * FROM custom_reviews_database WHERE shop = '$shop' AND id = $idReview AND publish = '1'");
                $result = array_merge($result, $allReviewInCollection);
            }
        }
    }

    $lists = array();
    if (count($result) > 0) {
        $key = 0;
        foreach ($result as $row) {
            $lists[$key] = $row;
            $key++;
        }
    }
    return $lists;
}
// function getAllReviewsByProduct($db, $shop, $id)
// {
//     $sql = "SELECT * FROM custom_reviews_database WHERE shop = '$shop' AND product_id = '$id' ORDER BY publishdate DESC";
//     $query = $db->query($sql);
//     $lists = array();
//     if ($query) {
//         while ($row = $query->fetch_assoc()) {
//             $row["reviewer_name"] = testOutputData($row["reviewer_name"]);
//             $row["reviewer_email"] = testOutputData($row["reviewer_email"]);
//             $row["reviewer_title"] = testOutputData($row["reviewer_title"]);
//             $row["reviewer_mess"] = testOutputData($row["reviewer_mess"]);
//             $row["publishdate"] = date("m/d/Y H:i", strtotime($row["publishdate"]));
//             $lists[] = $row;
//         }
//     }
//     return $lists;
// }
function checkHasImportedReviews($db, $shop, $productid)
{
    $sql = "SELECT * FROM custom_reviews_imported WHERE shop = '$shop' AND product_id= '$productid'";
    $query = $db->query($sql);
    if ($query->num_rows > 0) {
        return 1;
    } else {
        return 0;
    }
}
function countAllReviews($db, $shop, $id, $show_featured)
{
    $result = array();
    if ($show_featured == "1") {

        $reviewIDInProducts = db_fetch_array("SELECT review_id FROM custom_reviews_connect_products_and_reviews WHERE shop = '$shop' AND product_id = $id");
        foreach ($reviewIDInProducts as $objIDInProducts) {
            $id_ReviewProduct = $objIDInProducts["review_id"];
            $arrayReviewIDProducts = db_fetch_array("SELECT * FROM custom_reviews_database WHERE shop = '$shop' AND id = $id_ReviewProduct AND featured = '1' AND publish = '1'");
            $result = array_merge($result, $arrayReviewIDProducts);
        }

        $arrayProductType = db_fetch_array("SELECT product_type FROM custom_reviewss_products WHERE shop = '$shop' AND products_id = $id");
        $productType = isset($arrayProductType[0]["product_type"]) ? $arrayProductType[0]["product_type"] : "";
        $arrayIDInType = db_fetch_array("SELECT id FROM custom_reviews_product_type WHERE shop = '$shop' AND product_type = '$productType'");
        foreach ($arrayIDInType as $objType) {
            $id_type = $objType["id"];
            $arrayReviewIDTypes = db_fetch_array("SELECT review_id FROM custom_reviews_connect_product_types_and_reviews WHERE shop = '$shop' AND id_product_type = $id_type");
            foreach ($arrayReviewIDTypes as $idReviewsInType) {
                $idReviewInType = $idReviewsInType["review_id"];
                $allReviewInType = db_fetch_array("SELECT * FROM custom_reviews_database WHERE shop = '$shop' AND id = $idReviewInType AND featured = '1' AND publish = '1'");
                $result = array_merge($result, $allReviewInType);
            }
        }
        $arrayIdCollection = db_fetch_array("SELECT collection_id FROM custom_reviews_connect_collections_and_products WHERE shop = '$shop' AND product_id = $id");
        foreach ($arrayIdCollection as $objCollection) {
            $id_collection = $objCollection["collection_id"];
            $reviewIDInCollection = db_fetch_array("SELECT review_id FROM custom_reviews_connect_collections_and_reviews WHERE shop = '$shop' AND collection_id = $id_collection");
            foreach ($reviewIDInCollection as $reviewInCollection) {
                $idReview = $reviewInCollection["review_id"];
                $allReviewInCollection = db_fetch_array("SELECT * FROM custom_reviews_database WHERE shop = '$shop' AND id = $idReview AND featured = '1' AND publish = '1'");
                $result = array_merge($result, $allReviewInCollection);
            }
        }
    } else {
        $reviewIDInProducts = db_fetch_array("SELECT review_id FROM custom_reviews_connect_products_and_reviews WHERE shop = '$shop' AND product_id = $id");
        foreach ($reviewIDInProducts as $objIDInProducts) {
            $id_ReviewProduct = $objIDInProducts["review_id"];
            $arrayReviewIDProducts = db_fetch_array("SELECT * FROM custom_reviews_database WHERE shop = '$shop' AND id = $id_ReviewProduct AND publish = '1'");
            $result = array_merge($result, $arrayReviewIDProducts);
        }

        $arrayProductType = db_fetch_array("SELECT product_type FROM custom_reviewss_products WHERE shop = '$shop' AND products_id = $id");
        $productType = isset($arrayProductType[0]["product_type"]) ? $arrayProductType[0]["product_type"] : "";
        $arrayIDInType = db_fetch_array("SELECT id FROM custom_reviews_product_type WHERE shop = '$shop' AND product_type = '$productType'");
        foreach ($arrayIDInType as $objType) {
            $id_type = $objType["id"];
            $arrayReviewIDTypes = db_fetch_array("SELECT review_id FROM custom_reviews_connect_product_types_and_reviews WHERE shop = '$shop' AND id_product_type = $id_type");
            foreach ($arrayReviewIDTypes as $idReviewsInType) {
                $idReviewInType = $idReviewsInType["review_id"];
                $allReviewInType = db_fetch_array("SELECT * FROM custom_reviews_database WHERE shop = '$shop' AND id = $idReviewInType AND publish = '1'");
                $result = array_merge($result, $allReviewInType);
            }
        }
        $arrayIdCollection = db_fetch_array("SELECT collection_id FROM custom_reviews_connect_collections_and_products WHERE shop = '$shop' AND product_id = $id");
        foreach ($arrayIdCollection as $objCollection) {
            $id_collection = $objCollection["collection_id"];
            $reviewIDInCollection = db_fetch_array("SELECT review_id FROM custom_reviews_connect_collections_and_reviews WHERE shop = '$shop' AND collection_id = $id_collection");
            foreach ($reviewIDInCollection as $reviewInCollection) {
                $idReview = $reviewInCollection["review_id"];
                $allReviewInCollection = db_fetch_array("SELECT * FROM custom_reviews_database WHERE shop = '$shop' AND id = $idReview AND publish = '1'");
                $result = array_merge($result, $allReviewInCollection);
            }
        }
    }

    $lists = array();
    if (count($result) > 0) {
        $key = 0;
        foreach ($result as $row) {
            $lists[$key] = $row;
            $key++;
        }
    }
    return count($lists);
    // if ($show_featured == "1") {
    //     $count = db_fetch_row("SELECT COUNT(*) FROM custom_reviews_database WHERE shop ='$shop' and featured = '1' and product_id = '$id' and publish = '1'");
    // } else {
    //     $count = db_fetch_row("SELECT COUNT(*) FROM custom_reviews_database WHERE shop ='$shop' and product_id = '$id' and publish = '1'");
    // }
    // return $count['COUNT(*)'];
}
function countAllReviewsByCondition($db, $shop, $id, $show_featured, $condition1, $condition2)
{
    $where = checkCondition($condition1, $condition2);
    $result = array();

    if ($show_featured == "1") {

        $reviewIDInProducts = db_fetch_array("SELECT review_id FROM custom_reviews_connect_products_and_reviews WHERE shop = '$shop' AND product_id = $id");
        foreach ($reviewIDInProducts as $objIDInProducts) {
            $id_ReviewProduct = $objIDInProducts["review_id"];
            $arrayReviewIDProducts = db_fetch_array("SELECT * FROM custom_reviews_database WHERE shop = '$shop' AND id = $id_ReviewProduct AND featured = '1' AND publish = '1'" . $where);
            $result = array_merge($result, $arrayReviewIDProducts);
        }

        $arrayProductType = db_fetch_array("SELECT product_type FROM custom_reviewss_products WHERE shop = '$shop' AND products_id = $id");
        $productType = isset($arrayProductType[0]["product_type"]) ? $arrayProductType[0]["product_type"] : "";
        $arrayIDInType = db_fetch_array("SELECT id FROM custom_reviews_product_type WHERE shop = '$shop' AND product_type = '$productType'");
        foreach ($arrayIDInType as $objType) {
            $id_type = $objType["id"];
            $arrayReviewIDTypes = db_fetch_array("SELECT review_id FROM custom_reviews_connect_product_types_and_reviews WHERE shop = '$shop' AND id_product_type = $id_type");
            foreach ($arrayReviewIDTypes as $idReviewsInType) {
                $idReviewInType = $idReviewsInType["review_id"];
                $allReviewInType = db_fetch_array("SELECT * FROM custom_reviews_database WHERE shop = '$shop' AND id = $idReviewInType AND featured = '1' AND publish = '1'" . $where);
                $result = array_merge($result, $allReviewInType);
            }
        }
        $arrayIdCollection = db_fetch_array("SELECT collection_id FROM custom_reviews_connect_collections_and_products WHERE shop = '$shop' AND product_id = $id");
        foreach ($arrayIdCollection as $objCollection) {
            $id_collection = $objCollection["collection_id"];
            $reviewIDInCollection = db_fetch_array("SELECT review_id FROM custom_reviews_connect_collections_and_reviews WHERE shop = '$shop' AND collection_id = $id_collection");
            foreach ($reviewIDInCollection as $reviewInCollection) {
                $idReview = $reviewInCollection["review_id"];
                $allReviewInCollection = db_fetch_array("SELECT * FROM custom_reviews_database WHERE shop = '$shop' AND id = $idReview AND featured = '1' AND publish = '1'" . $where);
                $result = array_merge($result, $allReviewInCollection);
            }
        }
    } else {
        $reviewIDInProducts = db_fetch_array("SELECT review_id FROM custom_reviews_connect_products_and_reviews WHERE shop = '$shop' AND product_id = $id");
        foreach ($reviewIDInProducts as $objIDInProducts) {
            $id_ReviewProduct = $objIDInProducts["review_id"];
            $arrayReviewIDProducts = db_fetch_array("SELECT * FROM custom_reviews_database WHERE shop = '$shop' AND id = $id_ReviewProduct AND publish = '1'" . $where);
            $result = array_merge($result, $arrayReviewIDProducts);
        }

        $arrayProductType = db_fetch_array("SELECT product_type FROM custom_reviewss_products WHERE shop = '$shop' AND products_id = $id");
        $productType = isset($arrayProductType[0]["product_type"]) ? $arrayProductType[0]["product_type"] : "";
        $arrayIDInType = db_fetch_array("SELECT id FROM custom_reviews_product_type WHERE shop = '$shop' AND product_type = '$productType'");
        foreach ($arrayIDInType as $objType) {
            $id_type = $objType["id"];
            $arrayReviewIDTypes = db_fetch_array("SELECT review_id FROM custom_reviews_connect_product_types_and_reviews WHERE shop = '$shop' AND id_product_type = $id_type");
            foreach ($arrayReviewIDTypes as $idReviewsInType) {
                $idReviewInType = $idReviewsInType["review_id"];
                $allReviewInType = db_fetch_array("SELECT * FROM custom_reviews_database WHERE shop = '$shop' AND id = $idReviewInType AND publish = '1'" . $where);
                $result = array_merge($result, $allReviewInType);
            }
        }
        $arrayIdCollection = db_fetch_array("SELECT collection_id FROM custom_reviews_connect_collections_and_products WHERE shop = '$shop' AND product_id = $id");
        foreach ($arrayIdCollection as $objCollection) {
            $id_collection = $objCollection["collection_id"];
            $reviewIDInCollection = db_fetch_array("SELECT review_id FROM custom_reviews_connect_collections_and_reviews WHERE shop = '$shop' AND collection_id = $id_collection");
            foreach ($reviewIDInCollection as $reviewInCollection) {
                $idReview = $reviewInCollection["review_id"];
                $allReviewInCollection = db_fetch_array("SELECT * FROM custom_reviews_database WHERE shop = '$shop' AND id = $idReview AND publish = '1'" . $where);

                $result = array_merge($result, $allReviewInCollection);
            }
        }
    }
    $lists = array();
    if (count($result) > 0) {
        $key = 0;
        foreach ($result as $row) {
            $lists[$key] = $row;
            $key++;
        }
    }
    $order = checkOrderByCondition($condition2, $result);

    // if ($condition2 == 'hight-rate') {
    //     usort($result, function ($a, $b) {
    //         return strcmp($a['reviewer_rating'], $b['reviewer_rating']);
    //     });
    //     $result = array_reverse($result);
    // }
    // if ($condition2 == 'low-rate') {
    //     usort($result, function ($a, $b) {
    //         return strcmp($a['reviewer_rating'], $b['reviewer_rating']);
    //     });
    // }


    return count($order);
    // if ($show_featured == "1") {
    //     $count = db_fetch_row("SELECT COUNT(*) FROM custom_reviews_database WHERE shop ='$shop' and featured = '1' and product_id = '$id' and publish = '1' " . $where . $order);
    // } else {
    //     $count = db_fetch_row("SELECT COUNT(*) FROM custom_reviews_database WHERE shop ='$shop' and product_id = '$id' and publish = '1' " . $where . $order);
    // }
    // return $count['COUNT(*)'];
}
function getShopReviews($db, $shop, $id, $show_featured, $limit, $currentpage, $condition1, $condition2)
{
    $where = checkCondition($condition1, $condition2);
    $page = $currentpage * $limit;
    // $offset = ($_GET['offset'] + 1) * 25;
    $start = $page - $limit;
    $result = array();
    if ($show_featured == "1") {

        $reviewIDInProducts = db_fetch_array("SELECT review_id FROM custom_reviews_connect_products_and_reviews WHERE shop = '$shop' AND product_id = $id");
        foreach ($reviewIDInProducts as $objIDInProducts) {
            $id_ReviewProduct = $objIDInProducts["review_id"];
            $arrayReviewIDProducts = db_fetch_array("SELECT * FROM custom_reviews_database WHERE shop = '$shop' AND id = $id_ReviewProduct AND featured = '1' AND publish = '1'" . $where);
            $result = array_merge($result, $arrayReviewIDProducts);
        }

        $arrayProductType = db_fetch_array("SELECT product_type FROM custom_reviewss_products WHERE shop = '$shop' AND products_id = $id");
        $productType = isset($arrayProductType[0]["product_type"]) ? $arrayProductType[0]["product_type"] : "";
        $arrayIDInType = db_fetch_array("SELECT id FROM custom_reviews_product_type WHERE shop = '$shop' AND product_type = '$productType'");
        foreach ($arrayIDInType as $objType) {
            $id_type = $objType["id"];
            $arrayReviewIDTypes = db_fetch_array("SELECT review_id FROM custom_reviews_connect_product_types_and_reviews WHERE shop = '$shop' AND id_product_type = $id_type");
            foreach ($arrayReviewIDTypes as $idReviewsInType) {
                $idReviewInType = $idReviewsInType["review_id"];
                $allReviewInType = db_fetch_array("SELECT * FROM custom_reviews_database WHERE shop = '$shop' AND id = $idReviewInType AND featured = '1' AND publish = '1'" . $where);
                $result = array_merge($result, $allReviewInType);
            }
        }
        $arrayIdCollection = db_fetch_array("SELECT collection_id FROM custom_reviews_connect_collections_and_products WHERE shop = '$shop' AND product_id = $id");
        foreach ($arrayIdCollection as $objCollection) {
            $id_collection = $objCollection["collection_id"];
            $reviewIDInCollection = db_fetch_array("SELECT review_id FROM custom_reviews_connect_collections_and_reviews WHERE shop = '$shop' AND collection_id = $id_collection");
            foreach ($reviewIDInCollection as $reviewInCollection) {
                $idReview = $reviewInCollection["review_id"];
                $allReviewInCollection = db_fetch_array("SELECT * FROM custom_reviews_database WHERE shop = '$shop' AND id = $idReview AND featured = '1' AND publish = '1'" . $where);
                $result = array_merge($result, $allReviewInCollection);
            }
        }
    } else {
        $reviewIDInProducts = db_fetch_array("SELECT review_id FROM custom_reviews_connect_products_and_reviews WHERE shop = '$shop' AND product_id = $id");
        foreach ($reviewIDInProducts as $objIDInProducts) {
            $id_ReviewProduct = $objIDInProducts["review_id"];
            $arrayReviewIDProducts = db_fetch_array("SELECT * FROM custom_reviews_database WHERE shop = '$shop' AND id = $id_ReviewProduct AND publish = '1'" . $where);
            $result = array_merge($result, $arrayReviewIDProducts);
        }

        $arrayProductType = db_fetch_array("SELECT product_type FROM custom_reviewss_products WHERE shop = '$shop' AND products_id = $id");
        $productType = isset($arrayProductType[0]["product_type"]) ? $arrayProductType[0]["product_type"] : "";
        $arrayIDInType = db_fetch_array("SELECT id FROM custom_reviews_product_type WHERE shop = '$shop' AND product_type = '$productType'");
        foreach ($arrayIDInType as $objType) {
            $id_type = $objType["id"];
            $arrayReviewIDTypes = db_fetch_array("SELECT review_id FROM custom_reviews_connect_product_types_and_reviews WHERE shop = '$shop' AND id_product_type = $id_type");
            foreach ($arrayReviewIDTypes as $idReviewsInType) {
                $idReviewInType = $idReviewsInType["review_id"];
                $allReviewInType = db_fetch_array("SELECT * FROM custom_reviews_database WHERE shop = '$shop' AND id = $idReviewInType AND publish = '1'" . $where);
                $result = array_merge($result, $allReviewInType);
            }
        }
        $arrayIdCollection = db_fetch_array("SELECT collection_id FROM custom_reviews_connect_collections_and_products WHERE shop = '$shop' AND product_id = $id");
        foreach ($arrayIdCollection as $objCollection) {
            $id_collection = $objCollection["collection_id"];
            $reviewIDInCollection = db_fetch_array("SELECT review_id FROM custom_reviews_connect_collections_and_reviews WHERE shop = '$shop' AND collection_id = $id_collection");
            foreach ($reviewIDInCollection as $reviewInCollection) {
                $idReview = $reviewInCollection["review_id"];
                $allReviewInCollection = db_fetch_array("SELECT * FROM custom_reviews_database WHERE shop = '$shop' AND id = $idReview AND publish = '1'" . $where);
                $result = array_merge($result, $allReviewInCollection);
            }
        }
    }
    $result = checkOrderByCondition($condition2, $result);
    $response = array();
    for ($start; $start < $page; $start++) {
        if (isset($result[$start])) {
            $response = array_merge($response, array($result[$start]));
        }
    }
    $lists = array();
    if (count($response) > 0) {
        foreach ($response as $row) {
            $row["reviewer_name"] = testOutputData($row["reviewer_name"]);
            $row["reviewer_email"] = testOutputData($row["reviewer_email"]);
            $row["reviewer_title"] = testOutputData($row["reviewer_title"]);
            $row["reviewer_mess"] = testOutputData($row["reviewer_mess"]);
            $row["images"] = getReviewImagesByReviewId($db, $shop, $row["id"]);
            $lists[] = $row;
        }
    }

    return $lists;
}
function getReviewImagesByReviewId($db, $shop, $id)
{
    $sql = "SELECT * FROM custom_reviews_images WHERE shop = '$shop' AND review_id = '$id'";
    $query = $db->query($sql);
    $lists = array();
    if ($query) {
        while ($row = $query->fetch_assoc()) {
            $lists[] = $row;
        }
    }
    return $lists;
}
function getAllFeaturedReviews($db, $shop)
{
    $sql = "SELECT * FROM custom_reviews_database WHERE shop = '$shop' and publish = '1' and featured = '1' ORDER BY review_thanked DESC,publishdate DESC";
    $query = $db->query($sql);
    $lists = array();
    if ($query) {
        $key = 0;
        while ($row = $query->fetch_assoc()) {
            $lists[$key] = $row;
            $key++;
        }
    }
    return $lists;
}
function getShopSettings($db, $shop)
{
    $sql = "select * from custom_reviews_settings where shop = '$shop'";
    $query = $db->query($sql);
    $settings = array();
    if ($query) {
        while ($row = $query->fetch_assoc()) {
            $row["ver"] = filemtime(APP_PATH . '/app.js');
            $row["ver_last_bought"] = filemtime(APP_PATH . '/layout/lastBoughtProduct.js');
            $row["ver_product_star"] = filemtime(APP_PATH . '/layout/productStarReviews.js');
            $settings = $row;
        }
    }
    return $settings;
}
function checkExpired($db, $shop, $appId, $trialTime)
{
    $shop_data = $db->query("select * from tbl_usersettings where store_name = '" . $shop . "' and app_id = $appId");
    $shop_data = $shop_data->fetch_object();
    $installedDate = $shop_data->installed_date;
    //$confirmation_url = $shop_data->confirmation_url;
    $clientStatus = $shop_data->status;

    $date1 = new DateTime($installedDate);
    $date2 = new DateTime("now");
    $interval = date_diff($date1, $date2);
    $diff = (int)$interval->format('%R%a');
    if ($diff > $trialTime && $clientStatus != 'active') {
        return true;
    } else {
        return false;
    }
}
// function shopifyInit($db, $shop, $appId) {
//     $select_settings = $db->query("SELECT * FROM tbl_appsettings WHERE id = $appId");
//     $app_settings = $select_settings->fetch_object();
//     $shop_data = $db->query("select * from tbl_usersettings where store_name = '" . $shop . "' and app_id = $appId");
//     $shop_data = $shop_data->fetch_object();
//     $shopify = shopify_api\client(
//         $shop, $shop_data->access_token, $app_settings->api_key, $app_settings->shared_secret
//     );
//     return $shopify;
// }
// function emailInit()
// {
//     $mail = new PHPMailer();
//     //Server settings
//     $mail->SMTPDebug = 0;                                 // Enable verbose debug output
//     $mail->isSMTP();                                      // Set mailer to use SMTP
//     $mail->Host = 'email-smtp.eu-west-1.amazonaws.com';  // Specify main and backup SMTP servers
//     $mail->SMTPAuth = true;                               // Enable SMTP authentication
//     $mail->Username = 'AKIAJSJRBNA6PRNK2YEQ';                 // SMTP username
//     $mail->Password = 'Aq2E9Q2CY6Q1KEbu2J2NYnbTE88lX9mm6SitjvuBqlsa';                           // SMTP password
//     $mail->SMTPSecure = 'tls';                            // Enable TLS encryption, `ssl` also accepted
//     $mail->Port = 587;                                    // TCP port to connect to

//     return $mail;
// }
function emailInit()
{
    $mail = new PHPMailer(true);
    //Server settings
    $mail->ErrorInfo;
    // try {
    //Server settings
    $mail->CharSet = "utf-8";
    $mail->SMTPDebug = 0;
    $mail->isSMTP();

    $mail->Host = 'email-smtp.eu-west-1.amazonaws.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'AKIARCFWEUWYBPLTP3FP';
    $mail->Password = 'BHuUmqQnKqp8a1svVMryBc0dvErEhMgNKgvRgmCr3imD';
    $mail->SMTPSecure = 'ssl';
    $mail->Port = 465;

    return $mail;
    // $mail->setfrom('contact@omegatheme.com', 'Omegatheme Support');
    // $mail->addAddress($emailTo, $title);
    // $mail->addreplyto('contact@omegatheme.com', 'Omegatheme Support');
    // //Content
    // $mail->isHTML(true);
    // $mail->Subject = $title;
    // $mail->Body = $body;
    // $mail->send();

    //     return true;
    // } catch (Exception $e) {
    //     return 'Message could not be sent. Mailer Error: ' . $mail->ErrorInfo;
    // }
}
