<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type,Accept,Authorization, X-Requested-With');

require '../vendor/autoload.php';
require '../help.php';

// $shop = isset($_GET['shop']) ? $_GET['shop'] : "nguyen-q-huy.myshopify.com";
$_POST = json_decode(file_get_contents("php://input"), true);

if (isset($_GET["getSettings"])) {
    $shop = $_GET['shop'];
    $settings = getShopSettings($db, $shop);
    echo json_encode($settings);
}
if (isset($_POST["action"])) {
    if ($_POST['action'] == "saveSettingsReview") {

        $data = json_decode(file_get_contents('php://input'), true);
        $shop = $data['shop'];
        $shopify = shopifyInit($db, $shop, $appId);
        $settings = $data["settings"];
        $show_featured = $settings["show_featured"] == 'yesShowFeatured' ? 1  : 0;
        $show_purchase = $settings["show_purchase"] == 'yesShowPurchase' ? 1  : 0;
        $show_recommend = $settings["show_recommend"] == 'yesShowRecommend' ? 1  : 0;

        $app_layout = $settings["app_layout"];
        // $star_style = convertStringStarToInt($settings["star_style"]);
        $star_style = $settings["star_style"];
        $button_color = $settings["button_color"];
        $button_textcolor = $settings["button_textcolor"];
        $progress_color = $settings["progress_color"];

        $query = $db->query("UPDATE custom_reviews_settings SET "
            . "show_featured='$show_featured',show_purchase='$show_purchase',show_recommend='$show_recommend',"
            . "app_layout='$app_layout',star_style='$star_style',button_color='$button_color',button_textcolor='$button_textcolor',progress_color='$progress_color'"
            . " WHERE shop = '$shop'");

        // if ($query) {
        //     if ($settings["script_tagid"] == NULL || $settings["script_tagid"] == 0) {
        //         $settings["script_tagid"] = updateScriptTagid($db, $shop, $shopify);
        //     }
        //     // createShopCacheFile($rootLink, $shop, $settings, $shopify);
        // }
    }

    if ($_POST['action'] == "saveSettingsCustomize") {
        $data = json_decode(file_get_contents('php://input'), true);
        $shop = $data['shop'];
        $shopify = shopifyInit($db, $shop, $appId);
        $settings = $data["settings"];
        $form_author = $db->real_escape_string($settings["form_author"]);
        $form_author_desc = $db->real_escape_string($settings["form_author_desc"]);
        $form_email = $db->real_escape_string($settings["form_email"]);
        $form_email_desc = $db->real_escape_string($settings["form_email_desc"]);
        $form_title = $db->real_escape_string($settings["form_title"]);
        $form_title_desc = $db->real_escape_string($settings["form_title_desc"]);
        $form_review = $db->real_escape_string($settings["form_review"]);
        $form_review_desc = $db->real_escape_string($settings["form_review_desc"]);
        $form_button = $db->real_escape_string($settings["form_button"]);
        $form_button_submit = $db->real_escape_string($settings["form_button_submit"]);
        $submit_mess = $db->real_escape_string($settings["submit_mess"]);
        $submit_error_mess = $db->real_escape_string($settings["submit_error_mess"]);
        $form_rating = $db->real_escape_string($settings["form_rating"]);
        $form_recommend = $db->real_escape_string($settings["form_recommend"]);
        $form_upload = $db->real_escape_string($settings["form_upload"]);
        $text_agree = $db->real_escape_string($settings["text_agree"]);
        $text_decline = $db->real_escape_string($settings["text_decline"]);
        $reviews_title = $db->real_escape_string($settings["reviews_title"]);
        $text_average = $db->real_escape_string($settings["text_average"]);
        $siteKey = $db->real_escape_string($settings["siteKey"]);
        $secretKey = $db->real_escape_string($settings["secretKey"]);
        $captchaStatus = $db->real_escape_string($settings["captchaStatus"]);
        $query = $db->query("UPDATE custom_reviews_settings SET "
            . " form_author='$form_author',form_author_desc='$form_author_desc',form_email='$form_email',form_email_desc='$form_email_desc',form_title='$form_title',form_title_desc='$form_title_desc',form_review='$form_review',form_review_desc='$form_review_desc',"
            . " form_button='$form_button',form_button_submit='$form_button_submit',submit_mess='$submit_mess',submit_error_mess='$submit_error_mess',form_rating='$form_rating',form_recommend='$form_recommend',form_upload='$form_upload',text_agree='$text_agree',text_decline='$text_decline',"
            . " reviews_title='$reviews_title',text_average='$text_average',siteKey='$siteKey',secretkey='$secretKey',captcha='$captchaStatus'"
            . " WHERE shop = '$shop'");

        // if($query) {
        //     if($settings["script_tagid"] == NULL || $settings["script_tagid"] == 0) {
        //         $settings["script_tagid"] = updateScriptTagid($db, $shop, $shopify);
        //     }
        //     // createShopCacheFile($rootLink, $shop, $settings, $shopify);
        // }
    }
    if ($_POST['action'] == "saveSettingsAdvanced") {
        $data = json_decode(file_get_contents('php://input'), true);
        $shop = $data['shop'];
        $shopify = shopifyInit($db, $shop, $appId);
        $settings = $data["settings"];


        $auto_publish = $settings["auto_publish"] == "yesPublish" ? 1 : 0;
        $insert_code = $settings["insert_code"];
        $admin_send_mail  = returnBooleanData($settings["admin_send_mail"]);
        $admin_email = $settings["admin_email"];
        $send_mail = $settings["send_mail"] == 'yesSendEmail' ? 1 : 0;
        $reviews_per_page = $settings["reviews_per_page"];
        $maximum_reviews = $settings["maximum_reviews"];
        $maximum_uploaded_images = $settings["maximum_uploaded_images"];
        $show_notification = $settings["show_notification"] == 'yesShowNotification' ? 1 : 0;
        $numberBoughtProduct = $settings["numberBoughtProduct"];
        $timeLoop = $settings["timeLoop"];
        $timeDisplay = $settings["timeDisplay"];
        $effect_display = $settings["effect_display"];
        $effect_hidden = $settings["effect_hidden"];
        $notification_label = $settings["notification_label"];
        $writeareview_label = $settings["writeareview_label"];
        $writeareview_textcolor = $settings["writeareview_textcolor"];
        $writeareview_bgcolor = $settings["writeareview_bgcolor"];
        $notification_position = $settings["notification_position"];
        $show_box_badge = $settings["show_box_badge"] == 'yesShowBoxBadge' ? 1 : 0;
        $label_box_badge = $settings["label_box_badge"];
        $position_box_badge = $settings["position_box_badge"];
        $customcss = $settings["customcss"];

        // $row['insert_code'] ==  1 ? 'yesInsertCode'  : "noInsertCode";



        $query = $db->query("UPDATE custom_reviews_settings SET "
            . " auto_publish=$auto_publish,insert_code=$insert_code,admin_send_mail=$admin_send_mail,admin_email='$admin_email',send_mail=$send_mail,reviews_per_page=$reviews_per_page,"
            . " show_notification=$show_notification,numberBoughtProduct=$numberBoughtProduct,timeLoop=$timeLoop,timeDisplay=$timeDisplay,effect_display='$effect_display',effect_hidden='$effect_hidden',notification_label='$notification_label',"
            . " writeareview_label='$writeareview_label',writeareview_textcolor='$writeareview_textcolor',writeareview_bgcolor='$writeareview_bgcolor',notification_position='$notification_position',show_box_badge=$show_box_badge,label_box_badge='$label_box_badge',position_box_badge='$position_box_badge',customcss='$customcss',"
            . " maximum_reviews=$maximum_reviews,maximum_uploaded_images=$maximum_uploaded_images"
            . " WHERE shop = '$shop'");
        echo pr("UPDATE custom_reviews_settings SET "
            . " auto_publish=$auto_publish,insert_code=$insert_code,admin_send_mail=$admin_send_mail,admin_email='$admin_email',send_mail=$send_mail,reviews_per_page=$reviews_per_page,"
            . " show_notification=$show_notification,numberBoughtProduct=$numberBoughtProduct,timeLoop=$timeLoop,timeDisplay=$timeDisplay,effect_display='$effect_display',effect_hidden='$effect_hidden',notification_label='$notification_label',"
            . " writeareview_label='$writeareview_label',writeareview_textcolor='$writeareview_textcolor',writeareview_bgcolor='$writeareview_bgcolor',notification_position='$notification_position',show_box_badge=$show_box_badge,label_box_badge='$label_box_badge',position_box_badge='$position_box_badge',customcss='$customcss',"
            . " maximum_reviews=$maximum_reviews,maximum_uploaded_images=$maximum_uploaded_images"
            . " WHERE shop = '$shop'");
        // if ($query) {
        //     if ($settings["script_tagid"] == NULL || $settings["script_tagid"] == 0) {
        //         $settings["script_tagid"] = updateScriptTagid($db, $shop, $shopify);
        //     }
        //     // createShopCacheFile($rootLink, $shop, $settings, $shopify);
        // }
    }
}

//function............................................................................................................
function getShopSettings($db, $shop)
{
    $sql = "SELECT * FROM custom_reviews_settings WHERE shop = '$shop'";
    $query = $db->query($sql);
    $settings = array();
    if ($query) {
        while ($row = $query->fetch_assoc()) {
            // $row["star_style"] = convertIntStarToString($row["star_style"]);
            $row["admin_send_mail"] = returnDataBoolean($row["admin_send_mail"]);
            $row['auto_publish'] = $row['auto_publish'] ==  '1' ? "yesPublish" : "noPublish";
            // $row['insert_code'] ==  1 ? 'yesInsertCode'  : "noInsertCode";
            $row['send_mail'] = $row['send_mail'] == '1' ? 'yesSendEmail'  : "noSendEmail";
            $row['show_box_badge'] = $row['show_box_badge'] == '1' ? 'yesShowBoxBadge'  : "noShowBoxBadge";
            $row['show_featured'] = $row['show_featured'] == '1' ? 'yesShowFeatured'  : "noShowFeatured";
            $row['show_notification'] = $row['show_notification'] == '1' ? 'yesShowNotification'  : "noShowNotification";
            $row['show_purchase'] = $row['show_purchase'] == '1' ? 'yesShowPurchase'  : "noShowPurchase";
            $row['show_recommend'] = $row['show_recommend'] == '1' ? 'yesShowRecommend'  : "noShowRecommend";
            $settings = $row;
        }
    }
    return $settings;
}
// function convertIntStarToString($star)
// {
//     $starHasConvert = '';
//     if ($star === "1") $starHasConvert = "orange";
//     if ($star === "2") $starHasConvert = "red";
//     if ($star === "3") $starHasConvert = "green";
//     if ($star === "4") $starHasConvert = "blue";
//     if ($star === "5") $starHasConvert = "purple";
//     return $starHasConvert;
// }
// function convertStringStarToInt($star)
// {
//     $starHasConvert = '';
//     if ($star === "orange") $starHasConvert = "1";
//     if ($star === "red") $starHasConvert = "2";
//     if ($star === "green") $starHasConvert = "3";
//     if ($star === "blue") $starHasConvert = "4";
//     if ($star === "purple") $starHasConvert = "5";
//     return $starHasConvert;
// }

function returnDataBoolean($data)
{
    if ($data == '1') return true;
    else return false;
}
function returnBooleanData($data)
{
    if ($data == 'true') return 1;
    else return 0;
}
