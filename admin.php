<?php
header('Set-Cookie: cross-site-cookie=name; SameSite=None; Secure');

use sandeepshetty\shopify_api;

require 'vendor/autoload.php';
require 'conn-shopify.php';

if (isset($_GET['shop'])) {
    $shop = $_GET['shop'];
    header('Location: ' . $rootLink . '/client/build/?shop=' . $shop);
} else {
?>

    <head>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>

        <script src="https://cdn.shopify.com/s/assets/external/app.js"></script>

    </head>
    <div class="container">
        <h1 class="page-heading">Input your shop name to continue: </h1>
        <form class="form-inline">
            <input type="text" name = "shopName" style="width: 500px" class="inputShop form-control">
            <button class="btn btn-primary submitShop" type="submit">Continue</button>
        </form>
    </div>
    <script>
        $('.submitShop').click(function(e) {
            e.preventDefault();
            window.location = 'https://' + $('.inputShop').val() + '/admin/api/auth?api_key=<?php echo $apiKey; ?>';
            <?php $shop = $_POST['shopName']; header('Location: ' . $rootLink . "/client/build/?shop=$shop") ?>
        });
    </script>
<?php
    die();
}

// $shop_data = $db->query("select * from tbl_usersettings where store_name = '" . $shop . "' and app_id = $appId");
// $shop_data = $shop_data->fetch_object();
// $installedDate = $shop_data->installed_date;
// $confirmation_url = $shop_data->confirmation_url;
// $clientStatus = $shop_data->status;

// $date1 = new DateTime($installedDate);
// $date2 = new DateTime("now");
// $interval = date_diff($date1, $date2);
// $diff = (int) $interval->format('%R%a');
// if ($clientStatus != 'active') {
//     header('Location: ' . $rootLink . '/chargeRequire.php?shop=' . $shop);
// } else {

//     $select_settings = $db->query("SELECT * FROM tbl_appsettings WHERE id = $appId");
//     $app_settings = $select_settings->fetch_object();
//     $shop_data = $db->query("select * from tbl_usersettings where store_name = '" . $shop . "' and app_id = $appId");
//     $shop_data = $shop_data->fetch_object();
//     $shop_plan = $shop_data->plan_name;
//     $shopify = shopify_api\client(
//         $shop,
//         $shop_data->access_token,
//         $app_settings->api_key,
//         $app_settings->shared_secret
//     );
//     $shopInfo = $shopify("GET", "/admin/api/2020-10/shop.json");
//     $version = 16; // 10
// ?>
//     <!DOCTYPE html>

//     <head>
//         <title>Product Reviews by Omega Admin</title>
//         <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no">
//         <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Open+Sans:400,300|Roboto:300,400,500,700,400italic|Material+Icons">
//         <link rel='stylesheet' href='https://use.fontawesome.com/releases/v5.2.0/css/all.css'>
//         <link rel="stylesheet" href="//cdn.materialdesignicons.com/2.0.46/css/materialdesignicons.min.css">
//         <link rel="stylesheet" href="admin/lib/vue-material.min.css">
//         <link type="text/css" rel="stylesheet" href="//unpkg.com/bootstrap/dist/css/bootstrap.min.css" />
//         <link type="text/css" rel="stylesheet" href="//unpkg.com/bootstrap-vue@latest/dist/bootstrap-vue.min.css" />

//         <!-- Load polyfills to support older browsers -->
//         <script src="//polyfill.io/v3/polyfill.min.js?features=es2015%2CIntersectionObserver" crossorigin="anonymous"></script>

//         <!-- Load Vue followed by BootstrapVue -->
//         <script src="//unpkg.com/vue@latest/dist/vue.min.js"></script>
//         <script src="//unpkg.com/bootstrap-vue@latest/dist/bootstrap-vue.min.js"></script>

//         <!-- Load the following for BootstrapVueIcons support -->
//         <script src="//unpkg.com/bootstrap-vue@latest/dist/bootstrap-vue-icons.min.js"></script>
//         <link rel="stylesheet" href="admin/lib/default.css">
//         <link rel="stylesheet" href="admin/lib/flatpickr.min.css">
//         <link rel="stylesheet" href="admin/lib/buefy.min.css">
//         <link rel="stylesheet" href="admin/lib/vue2Dropzone.css">
//         <link rel="stylesheet" href="admin/lib/vue-multiselect.min.css">
//         <link rel="stylesheet" type="text/css" href="admin/styles/customBuefy.css?v=<?php echo $version ?>">
//         <link rel="stylesheet" type="text/css" href="admin/styles/appStyles.css?v=<?php echo $version ?>">
//         <script src="admin/lib/jquery.min.js"></script>
//         <script async src="https://apps.omegatheme.com/helpdesk/plugin.js?appId=28&v=<?php echo time(); ?>"></script>
//         <script src="https://sak.userreport.com/xipat/launcher.js" async id="userreport-launcher-script"></script>
//     </head>

//     <body>
//         <div id="reviewsProductsApp">
//             <div class="ot-header">
//                 <div style="width:50%; float:left">
//                     <h1 class="title-heading">Product Reviews admin page | <a href="guide.html" target="_blank">Document here !</a></h1>
//                 </div>
//                 <div style="margin:20px;width:40%; float:left; text-align: right;">
//                     <a class="button-menu" :href="settingsLink">Settings</a>
//                     <a class="button-menu" :href="introLink">Instructions</a>
//                 </div>
//                 <div style="clear:both"></div>
//             </div>

//             <div layout-padding style="width: 100%">
//                 <div>
//                     <div class="page-container">
//                         <all-reviews v-if="showProductReviewDetail == false" v-on:get-product-review-detail="getProductReviewDetail"></all-reviews>
//                         <product-reviews-detail v-else :is-fetching="isFetching" :products-detail="productsDetail" :all-reviews="allReviews" :app-cart-rating="appCartRating" :product-id="productId" :settings="settings" v-on:get-product-review-detail="getProductReviewDetail" v-on:get-reviews-by-product-id="getReviewsByProductId"></product-reviews-detail>
//                     </div>
//                 </div>
//             </div>
//             <div class="app-footer">
//                 <div class="footer-header">Some other sweet <strong>Omega</strong> apps you might like! <a target="_blank" href="https://apps.shopify.com/partners/developer-30c7ea676d888492">(View all app)</a></div>
//                 <div class="omg-more-app">
//                     <div>
//                         <p><a href="https://apps.shopify.com/quantity-price-breaks-limit-purchase?utm_source=customer_reviews_admin" target="_blank"><img alt="Quantity Price Breaks by Omega" src="https://s3.amazonaws.com/shopify-app-store/shopify_applications/small_banners/5143/splash.png?1452220345"></a></p>
//                     </div>
//                     <div>
//                         <p><a href="https://apps.shopify.com/facebook-reviews-1?utm_source=customer_reviews_admin" target="_blank"><img alt="Facebook Reviews by Omega" src="https://s3.amazonaws.com/shopify-app-store/shopify_applications/small_banners/13331/splash.png?1499916138"></a></p>
//                     </div>
//                     <div>
//                         <p><a href="https://apps.shopify.com/order-tagger-by-omega?utm_source=customer_reviews_admin" target="_blank"><img alt="Order Tagger by Omega" src="https://s3.amazonaws.com/shopify-app-store/shopify_applications/small_banners/17108/splash.png?1510565540"></a></p>
//                     </div>
//                 </div>
//             </div>
//         </div>
//         <?php require 'admin/review/star.php'; ?>
//         <?php include 'facebook-chat.html'; ?>
//         <!-- Global site tag (gtag.js) - Google Analytics -->
//         <script async src="https://www.googletagmanager.com/gtag/js?id=UA-126587266-1"></script>
//         <script>
//             window.dataLayer = window.dataLayer || [];

//             function gtag() {
//                 dataLayer.push(arguments);
//             }
//             gtag('js', new Date());
//             gtag('config', 'UA-126587266-1');
//         </script>
//         <script src="https://cdn.shopify.com/s/assets/external/app.js"></script>
//         <script type="text/javascript" src="admin/lib/bootstrap.min.js"></script>
//         <script type="text/javascript">
//             ShopifyApp.init({
//                 apiKey: '<?php echo $apiKey; ?>',
//                 shopOrigin: 'https://<?php echo $shop; ?>',
//             });
//         </script>
//         <script>
//             $(".closeNote").click(function(e) {
//                 e.preventDefault();
//                 $(".noteWrap").hide();
//             });
//             $(".refreshCharge").click(function(e) {
//                 e.preventDefault();
//                 $.get("recharge.php?shop=<?php echo $shop; ?>", function(result) {
//                     location.href = result;
//                 });
//             });
//             window.shop = "<?php echo $shop; ?>";
//             window.rootLink = "<?php echo $rootLink; ?>";
//             window.shopPlan = "<?php echo $shop_plan; ?>";
//             window.pricePremium = "<?php echo $pricePremium; ?>";
//             window.priceAdvanced = "<?php echo $priceAdvanced; ?>";
//             window.limitPremium = "<?php echo $limitPremium; ?>";
//             window.storeName = "<?php echo $shopInfo["name"]; ?>";
//             window.version = "<?php echo $version ?>";
//         </script>
//         <script type="text/javascript" src="admin/lib/flatpickr.js"></script>
//         <script type="text/javascript" src="admin/lib/vue.js"></script>
//         <script type="text/javascript" src="admin/lib/vue-multiselect.min.js"></script>
//         <script type="text/javascript" src="admin/lib/vue-flatpickr.js"></script>
//         <script type="text/javascript" src="admin/lib/httpVueLoader.js"></script>
//         <script type="text/javascript" src="admin/lib/vue-resource.min.js"></script>
//         <script type="text/javascript" src="admin/lib/vue-material.min.js"></script>
//         <script type="text/javascript" src="admin/lib/axios.min.js"></script>
//         <script type="text/javascript" src="admin/lib/buefy.min.js"></script>
//         <script type="text/javascript" src="admin/lib/vue2Dropzone.js"></script>
//         <script type="text/javascript" src="admin/scripts/main.js?v=<?php echo $version ?>"></script>
//     </body>
<?php } ?>