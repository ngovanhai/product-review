<?php
// ini_set('display_errors', TRUE);
// error_reporting(E_ALL);
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type,Accept,Authorization, X-Requested-With');

use Reviews\CustomerReview;

require './importReviews/vendor/autoload.php';
require './importReviews/reviewImportUrl.php';
require '../vendor/autoload.php';
// require '../help.php';
require './importReviews/Classes/PHPExcel.php';

use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;


// if (isset($_GET['checkShopName'])) {
//     $offset = $_GET['ot_PR_Offset'];
//     $offset_set = $offset * 20;
//     $listProduct = db_fetch_array("select * from custom_reviewss_products where shop = '$shop' LIMIT 20 OFFSET $offset_set");
//     echo json_encode(
//         $listProduct
//     );
// }
// $api_version = '2020-10';

if (isset($_POST['action'])) {
    if ($_POST['action'] == 'importExcel') {
        $rand = rand(0, 10000);
        $filename = $_FILES['importFile']['name'];
        $shop = $_POST['shop'];
        $file  = $_FILES['importFile']['tmp_name'];
        /**  Create a new Reader of the type defined in $inputFileType  **/
        $objReader = \PhpOffice\PhpSpreadsheet\IOFactory::createReaderForFile($file);
        $objExcel = $objReader->load($file);
        $rowData = $objExcel->getActiveSheet()->toArray('null', true, true, true);

        if (count($rowData) > 0) {
            $count = 0;
            for ($i = 2; $i < count($rowData) + 1; $i++) {
                if ($count < 2001 && $rowData[$i]['A'] != null) {
                    $product_handle = $rowData[$i]['A'];
                    $array_id = db_fetch_array("select products_id,products_title from custom_reviewss_products where shop = '$shop' and products_handle = '$product_handle'");
                    $product_id = $array_id[0]["products_id"];
                    $product_title = $array_id[0]["products_title"];
                    if (isset($product_id)) {
                        $review_thanked =  $rowData[$i]['J'];
                        if ($review_thanked == 'yes') {
                            $review_thanked = 1;
                        } else {
                            $review_thanked = 0;
                        }
                        $product_recommend = $rowData[$i]['H'];
                        if ($product_recommend == 'yes') {
                            $product_recommend = 1;
                        } else {
                            $product_recommend = 0;
                        }
                        $purchase = $rowData[$i]['I'];
                        if ($purchase == 'yes') {
                            $purchase = 1;
                        } else {
                            $purchase = 0;
                        }
                        $publish = $rowData[$i]['B'];
                        if ($publish == 'yes') {
                            $publish = 1;
                        } else {
                            $publish = 0;
                        }
                        $featured = $rowData[$i]['K'];
                        if ($featured == 'yes') {
                            $featured = 1;
                        } else {
                            $featured = 0;
                        }
                        $item = array(
                            "shop" => $shop,
                            "product_title" => $product_title,
                            "product_id" => 1,
                            "publish" => $publish,
                            "reviewer_rating" => $rowData[$i]['C'],
                            "reviewer_title" => $rowData[$i]['D'],
                            "reviewer_name" => $rowData[$i]['E'],
                            "reviewer_email" => $rowData[$i]['F'],
                            "reviewer_mess" => $rowData[$i]['G'],
                            "product_recommend" => $product_recommend,
                            "purchase" => $purchase,
                            "review_thanked" => $review_thanked,
                            "featured" => $featured,
                            "publishdate" => $rowData[$i]['L'],
                            "import_source" => "Excel"
                        );
                        $data[] = $item;
                        $count++;
                        $id = db_insert('custom_reviews_database', $item);
                        $newReviewProduct = [
                            "shop" => $shop,
                            "review_id" => $id,
                            "product_id" => $product_id
                        ];
                        db_insert('custom_reviews_connect_products_and_reviews', $newReviewProduct);
                        $review = countAllReviewsByProduct($db, $shop, $product_id);
                        $data = [
                            "countReviews" => $review['countReviews'],
                            "ratingReviews" => $review['ratingReviews'],
                        ];
                        db_update('custom_reviewss_products', $data, "products_id = $product_id");
                    };
                }
            }
        }
        echo json_encode($data);
    }
}

//Statistical
if (isset($_GET['getStaticalReviewPublish'])) {
    $shop = $_GET['shop'];
    $allReview = db_fetch_array("select * from custom_reviews_database where shop = '$shop' and publish = 1");
    $oneStar = db_fetch_array("select * from custom_reviews_database where shop = '$shop' and publish = 1 and reviewer_rating = 1");
    $twoStars = db_fetch_array("select * from custom_reviews_database where shop = '$shop' and publish = 1 and reviewer_rating = 2");
    $threeStars = db_fetch_array("select * from custom_reviews_database where shop = '$shop' and publish = 1 and reviewer_rating = 3");
    $fourStars = db_fetch_array("select * from custom_reviews_database where shop = '$shop' and publish = 1 and reviewer_rating = 4");
    $fiveStars = db_fetch_array("select * from custom_reviews_database where shop = '$shop' and publish = 1 and reviewer_rating = 5");
    $rating = 0;
    if (count($allReview) > 0) {
        for ($i = 0; $i < count($allReview); $i++) {
            $rating += intval($allReview[$i]["reviewer_rating"]);
        }
    }
    $result["averageReview"] = count($allReview) > 0 ? $rating / count($allReview) : 0;
    $result["oneStar"] = count($oneStar);
    $result["twoStars"] = count($twoStars);
    $result["threeStars"] = count($threeStars);
    $result["fourStars"] = count($fourStars);
    $result["fiveStars"] = count($fiveStars);
    echo json_encode($result);
}

if (isset($_GET['getStaticalReviewPlace'])) {
    $shop = $_GET['shop'];
    $reviewForProducts = db_fetch_array("select * from custom_reviews_database where shop = '$shop' and product_id !=0");
    $reviewForCollection = db_fetch_array("select * from custom_reviews_database where shop = '$shop' and collection_id != 0");
    $reviewForProductTypes = db_fetch_array("select * from custom_reviews_database where shop = '$shop' and product_type != ''");
    $result["reviewForProducts"] = count($reviewForProducts);
    $result["reviewForCollection"] = count($reviewForCollection);
    $result["reviewForProductTypes"] = count($reviewForProductTypes);
    echo json_encode($result);
}
// if (isset($_GET['syncAllproduct'])) { {
//         $count = $shopify("GET", "/admin/api/$api_version/products/count.json");
//         if ($count > 0) {
//             $pages = ceil($count / 250);
//             $since_id = 0;
//             $allProduct = [];
//             for ($i = 0; $i < $pages; $i++) {
//                 $getProducts = $shopify("GET", "/admin/api/$api_version/products.json?limit=250&since_id=" . $since_id . "&fields=id,title,handle,image");
//                 $lastKey = count($getProducts) - 1;
//                 $since_id = isset($getProducts[$lastKey]['id']) ? $getProducts[$lastKey]['id'] : 0;
//                 $allProduct = array_merge($allProduct, $getProducts);
//             }
//         }
//         for ($i = 0; $i < count($allProduct); $i++) {
//             if (isset($allProduct[$i]["image"]["src"]) != '') {
//                 $allProduct[$i]["imageUrl"] = $allProduct[$i]["image"]["src"];
//             } else {
//                 $allProduct[$i]["imageUrl"] = $rootLink . "/client/public/images/no-image.png";
//             }
//             $allProduct[$i]["hasImported"] = checkHasImportedReviews($db, $shop, $allProduct[$i]["id"]);
//             $allProduct[$i]["productUrl"] = "https://" . $shop . "/products/" . $allProduct[$i]["handle"];
//             $allProduct[$i]["productReviewDetail"] = $rootLink . "/product-review-detail.php?shop=" . $shop . "&product_id=" . $allProduct[$i]["id"];
//             $reviews = countAllReviewsByProduct($db, $shop, $allProduct[$i]["id"]);
//             $allProduct[$i]["countReviews"] = $reviews["countReviews"];
//             $allProduct[$i]["ratingReviews"] = $reviews["ratingReviews"];
//         }
//         foreach ($allProduct as $v) {
//             if (isset($v['id'])) {
//                 $id = $v['id'];
//             };
//             $countReview = $v["countReviews"];
//             $ratingReview = $v["ratingReviews"];
//             $data = [
//                 'shop' => $shop,
//                 'products_id' => $id,
//                 'products_image_url' => $v['imageUrl'],
//                 'products_title' => $v['title'],
//                 'productUrl' => $v['productUrl'],
//                 'products_review_detail' => $v['productReviewDetail'],
//                 'products_handle' => $v['handle'],
//                 'countReviews' => $v['countReviews'],
//                 'hasImported' => $v['hasImported'],
//                 'productReviewDetail' => $v['productReviewDetail'],
//                 'image' => json_encode($v['image']),
//                 'ratingWidth' => isset($v['ratingWidth']) ? $v['ratingWidth'] : 0,
//                 'ratingTitle' => isset($v['ratingTitle']) ? $v['ratingTitle'] : 0,
//                 'ratingReviews' => isset($v['ratingReviews']) ? $v['ratingReviews'] : 0,
//             ];
//             db_duplicate("custom_reviewss_products", $data, "products_id = $id, countReviews = $countReview, ratingReviews = $ratingReview");
//         }
//         echo json_encode($allProduct);
//     }
// }

if (isset($_GET['getAllProduct'])) {
    $shop = $_GET['shop'];
    $offset = $_GET['ot_PR_Offset'];
    $offset_set = $offset * 20;
    $listProduct = db_fetch_array("select * from custom_reviewss_products where shop = '$shop' LIMIT 20 OFFSET $offset_set");
    echo json_encode(
        $listProduct
    );
}

// if (isset($_GET['postWebhookUninstall'])) {
//     $shop =$_GET['shop'];
//     $webhook = $shopify('POST', "/admin/api/$api_version/webhooks.json", array('webhook' => array('topic' => 'app/uninstalled', 'address' => $rootLink . "/webhooks/uninstall.php?shop=$shop", 'format' => 'json')));

//     echo json_encode($webhook);
// }
// if (isset($_GET['deleteWebhookUninstall'])) {
//     $webhook = $shopify('DELETE', "/admin/api/$api_version/webhooks/981458649247.json");
//     echo json_encode($webhook);
// }
// //981449638047
// if (isset($_GET['postWebhookDeleteCollection'])) {
//     $webhook = $shopify('POST', "/admin/api/$api_version/webhooks.json", array('webhook' => array('topic' => 'collections/delete', 'address' => $rootLink . "/webhooks/deleteCollection.php?shop=$shop", 'format' => 'json')));
//     echo json_encode($webhook);
// }
// if (isset($_GET['postWebhookDeleteProduct'])) {
//     $webhook = $shopify('POST', "/admin/api/$api_version/webhooks.json", array('webhook' => array('topic' => 'products/delete', 'address' => $rootLink . "/webhooks/deleteProduct.php?shop=$shop", 'format' => 'json')));
//     echo json_encode($webhook);
// }
// if (isset($_GET['getWebhook'])) {
//     $webhook = $shopify('GET', "/admin/api/2021-01/webhooks.json");
//     echo json_encode($webhook);
// }
if (isset($_GET['syncDataToDB'])) {
    $shop = $_GET['shop'];
    $shopify = shopifyInit($db, $shop, $appId);
    $count = $shopify("GET", "/admin/api/$api_version/products/count.json");
    if (isset($_GET['since_id'])) {
        $since_id = $_GET['since_id'];
        if ($count > 0) {
            // $pages = ceil($count / 250);
            // $allProduct = [];
            // for ($i = 0; $i < $pages; $i++) {
            $allProduct = $shopify("GET", "/admin/api/$api_version/products.json?limit=250&since_id=" . $since_id . "&fields=id,title,handle,image,product_type,vendor,tags");
            // $allProduct = array_merge($allProduct, $getProducts);
            // }
            if (is_array($allProduct)) {
                $lastKey = count($allProduct) - 1;
                $since_id = isset($allProduct[$lastKey]['id']) ? $allProduct[$lastKey]['id'] : 0;
                for ($i = 0; $i < count($allProduct); $i++) {
                    if (isset($allProduct[$i]["image"]["src"]) != '') {
                        $allProduct[$i]["imageUrl"] = $allProduct[$i]["image"]["src"];
                    } else {
                        $allProduct[$i]["imageUrl"] = $rootLink . "/client/public/images/no-image.png";
                    }
                    $allProduct[$i]["hasImported"] = checkHasImportedReviews($db, $shop, $allProduct[$i]["id"]);
                    $allProduct[$i]["productUrl"] = "https://" . $shop . "/products/" . $allProduct[$i]["handle"];
                    $allProduct[$i]["productReviewDetail"] = $rootLink . "/product-review-detail.php?shop=" . $shop . "&product_id=" . $allProduct[$i]["id"];
                    $reviews = countAllReviewsByProduct($db, $shop, $allProduct[$i]["id"]);
                    $allProduct[$i]["countReviews"] = $reviews["countReviews"];
                    $allProduct[$i]["ratingReviews"] = $reviews["ratingReviews"];
                }
                foreach ($allProduct as $product) {
                    if (isset($product['id'])) {
                        $id = $product['id'];
                    };
                    $countReview = $product["countReviews"];
                    $ratingReview = $product["ratingReviews"];
                    $imageUrl = $product['imageUrl'];
                    $product_type = $product['product_type'];
                    $tags = $product['tags'];
                    $vendor = $product['vendor'];
                    $product_title = $product['title'];
                    $dataProduct = [
                        'shop' => $shop,
                        'product_type' => $product_type,
                        'tags' => $tags,
                        'vendor' => $vendor,
                        'products_id' => $id,
                        'products_image_url' => $imageUrl,
                        'products_title' => $product_title,
                        'productUrl' => $product['productUrl'],
                        'products_review_detail' => $product['productReviewDetail'],
                        'products_handle' => $product['handle'],
                        'countReviews' => $countReview,
                        'hasImported' => $product['hasImported'],
                        'productReviewDetail' => $product['productReviewDetail'],
                        'image' => json_encode($product['image']),
                        'ratingWidth' => isset($product['ratingWidth']) ? $product['ratingWidth'] : 0,
                        'ratingTitle' => isset($product['ratingTitle']) ? $product['ratingTitle'] : 0,
                        'ratingReviews' => isset($ratingReview) ? $ratingReview : 0,
                    ];
                    $data = [
                        "vendor" => $vendor,
                        // "product_type" => $product_type,
                        "tags" => $tags,
                        "product_title" => $product_title
                    ];
                    db_update('custom_reviews_database', $data, "product_id = $id");
                    db_duplicate("custom_reviewss_products", $dataProduct, "product_type = '$product_type', tags = '$tags', vendor = '$vendor', countReviews = $countReview, ratingReviews = $ratingReview");
                    if ($vendor !== '') {
                        $dataVendor = [
                            'shop' => $shop,
                            'vendor' => $vendor,
                        ];
                        db_duplicate("custom_reviews_product_vendor", $dataVendor, "vendor = '$vendor'");
                    }
                    if ($product_type !== '') {
                        $reviewsProductTypes = countAllReviewsByProductTypes($db, $shop, $product_type);
                        $countReviews = $reviewsProductTypes["countReviews"];
                        $ratingReviews = $reviewsProductTypes["ratingReviews"];
                        $dataType = [
                            'shop' => $shop,
                            'product_type' => $product_type,
                            'countReviews' => $countReviews,
                            'ratingReviews' => $ratingReviews
                        ];
                        db_duplicate("custom_reviews_product_type", $dataType, "product_type = '$product_type',ratingReviews = '$ratingReviews', countReviews = '$countReviews'");
                    }
                }
                $response = array(
                    'countProducts' => count($allProduct),
                    'since_id' => $since_id,
                );
                echo json_encode($response);
            }
        }
    }
}

if (isset($_GET['syncDataToDBStart'])) {
    $shop = $_GET['shop'];
    $shopify = shopifyInit($db, $shop, $appId);
    $count = $shopify("GET", "/admin/api/$api_version/products/count.json");
    if (isset($_GET['since_id'])) {

        $since_id = $_GET['since_id'];
        if ($count > 0) {
            $allProduct = $shopify("GET", "/admin/api/$api_version/products.json?limit=20&since_id=" . $since_id . "&fields=id,title,handle,image,vendor,product_type,tags");
            if (is_array($allProduct)) {
                $lastKey = count($allProduct) - 1;
                $since_id = isset($allProduct[$lastKey]['id']) ? $allProduct[$lastKey]['id'] : 0;
                for ($i = 0; $i < count($allProduct); $i++) {
                    if (isset($allProduct[$i]["image"]["src"]) != '') {
                        $allProduct[$i]["imageUrl"] = $allProduct[$i]["image"]["src"];
                    } else {
                        $allProduct[$i]["imageUrl"] = $rootLink . "/client/public/images/no-image.png";
                    }
                    $allProduct[$i]["hasImported"] = checkHasImportedReviews($db, $shop, $allProduct[$i]["id"]);
                    $allProduct[$i]["productUrl"] = "https://" . $shop . "/products/" . $allProduct[$i]["handle"];
                    $allProduct[$i]["productReviewDetail"] = $rootLink . "/product-review-detail.php?shop=" . $shop . "&product_id=" . $allProduct[$i]["id"];
                    $reviews = countAllReviewsByProduct($db, $shop, $allProduct[$i]["id"]);
                    $allProduct[$i]["countReviews"] = $reviews["countReviews"];
                    $allProduct[$i]["ratingReviews"] = $reviews["ratingReviews"];
                }
                foreach ($allProduct as $v) {
                    if (isset($v['id'])) {
                        $id = $v['id'];
                    };
                    $countReview = $v["countReviews"];
                    $ratingReview = $v["ratingReviews"];
                    $product_type = $v['product_type'];
                    $tags = $v['tags'];
                    $vendor = $v['vendor'];
                    $product_title = $v['title'];
                    $dataProduct = [
                        'shop' => $shop,
                        'products_id' => $id,
                        'product_type' => $product_type,
                        'tags' => $tags,
                        'vendor' => $vendor,
                        'products_image_url' => $v['imageUrl'],
                        'products_title' => $product_title,
                        'productUrl' => $v['productUrl'],
                        'products_review_detail' => $v['productReviewDetail'],
                        'products_handle' => $v['handle'],
                        'countReviews' => $countReview,
                        'hasImported' => $v['hasImported'],
                        'productReviewDetail' => $v['productReviewDetail'],
                        'image' => json_encode($v['image']),
                        'ratingWidth' => isset($v['ratingWidth']) ? $v['ratingWidth'] : 0,
                        'ratingTitle' => isset($v['ratingTitle']) ? $v['ratingTitle'] : 0,
                        'ratingReviews' => isset($ratingReview) ? $ratingReview : 0,
                    ];
                    $data = [
                        "vendor" => $vendor,
                        // "product_type" => $product_type,
                        "tags" => $tags,
                        "product_title" => $product_title
                    ];
                    db_update('custom_reviews_database', $data, "product_id = $id");
                    db_duplicate("custom_reviewss_products", $dataProduct, "product_type = '$product_type', tags = '$tags', vendor = '$vendor', countReviews = $countReview, ratingReviews = $ratingReview");
                    if ($vendor !== '') {
                        $dataVendor = [
                            'shop' => $shop,
                            'vendor' => $vendor,
                        ];
                        db_duplicate("custom_reviews_product_vendor", $dataVendor, "vendor = '$vendor'");
                    }
                    if ($product_type !== '') {

                        $dataType = [
                            'shop' => $shop,
                            'product_type' => $product_type,
                        ];
                        db_duplicate("custom_reviews_product_type", $dataType, "product_type = '$product_type'");
                    }
                }
                $response = array(
                    'countProducts' => count($allProduct),
                    'since_id' => $since_id,
                );
                echo json_encode($response);
            }
        }
    }
}

if (isset($_GET['syncCollections'])) {
    $shop = $_GET['shop'];
    $shopify = shopifyInit($db, $shop, $appId);
    $collects = $shopify("GET", "/admin/api/$api_version/collects.json");
    if (is_array($collects)) {
        foreach ($collects as $collect) {
            $collection_id = $collect['collection_id'];
            $product_id = $collect['product_id'];
            $id_collect = $collect['id'];
            $dataCollects = [
                'shop' => $shop,
                'product_id' => $product_id,
                'collection_id' => $collection_id,
                "id_collect" => $id_collect
            ];
            db_duplicate("custom_reviews_connect_collections_and_products", $dataCollects, "id_collect = $id_collect");
            $collection = $shopify("GET", "/admin/api/$api_version/collections/$collection_id.json");
            $handle = isset($collection['handle']) ? $collection['handle'] : '';
            $title = isset($collection['title']) ? $collection['title'] : '';
            $image = isset($collection['image']['src']) ? $collection['image']['src'] : $rootLink . "/client/public/images/no-image.png";
            $url = "https://" . $shop . "/collections/" . $handle;
            $reviews = countAllReviewsByCollection($db, $shop, $collection_id);
            $countReviews = $reviews["countReviews"];
            $ratingReviews = $reviews["ratingReviews"];

            $dataCollection = [
                'shop' => $shop,
                'collection_id' => $collection_id,
                'handle' => $handle,
                'title' => $title,
                'image' => $image,
                'url' => $url,
                'countReviews' => $countReviews,
                'ratingReviews' => $ratingReviews,
                // 'body_html' => isset($collection['body_html']) ? $collection['body_html'] : '',
                // 'sort_order' => isset($collection['sort_order']) ? $collection['sort_order'] : '',
                // 'template_suffix' => isset($collection['template_suffix']) ? $collection['template_suffix'] : '',
                // 'products_count' => isset($collection['products_count']) ? $collection['products_count'] : '',
                // 'collection_type' => isset($collection['collection_type']) ? $collection['collection_type'] : '',
                // 'published_scope' => isset($collection['published_scope']) ? $collection['published_scope'] : '',
                // 'admin_graphql_api_id' => isset($collection['admin_graphql_api_id']) ? $collection['admin_graphql_api_id'] : '',
            ];
            db_duplicate("custom_reviews_collections", $dataCollection, "collection_id=$collection_id,handle='$handle',title='$title',image='$image',url='$url', countReviews = $countReviews, ratingReviews=$ratingReviews");
            // countAllReviewsByCollection
        }
        $dataAllCollections = db_fetch_array("select * from custom_reviews_collections where shop = '$shop'");
        $selected = array();
        for ($i = 0; $i < count($dataAllCollections); $i++) {
            $data =  [(object)[
                "label" => $dataAllCollections[$i]['title'],
                "value" => $dataAllCollections[$i]['collection_id'],
            ]];
            $selected = array_merge($selected, $data);
        }
        $response = [
            "selected"  => $selected,
            "data" => $dataAllCollections
        ];
        echo json_encode($response);
    } else {
        $response = array();
        echo json_encode($response);
    }
    // }
}

if (isset($_GET['getCollectionsSelect'])) {
    $shop = $_GET['shop'];
    $dataAllCollections = db_fetch_array("select * from custom_reviews_collections where shop = '$shop'");
    $response = array();
    for ($i = 0; $i < count($dataAllCollections); $i++) {
        $data =  [(object)[
            "label" => $dataAllCollections[$i]['title'],
            "value" => $dataAllCollections[$i]['collection_id'],
        ]];
        $response = array_merge($response, $data);
    }
    // $allReviews = getAllReviews($db, $shop);
    // $dataReviews = [
    //     "reviewer_name" => 'a',
    //     "date" => '2021-01-19 15:01:00'
    // ];
    // $arrId = checkDuplicateValue($dataReviews, $allReviews);
    // $allReviewConnect = db_fetch_array("select * from custom_reviews_connect_products_and_reviews where shop = '$shop'");
    // foreach ($arrId as $id) {
    //     $newReviewProduct = [
    //         "shop" => $shop,
    //         "review_id" => $id,
    //         "product_id" => '5889933770911'
    //     ];
    //     if (checkDuplicateValueProduct($newReviewProduct, $allReviewConnect) == 0) {
    //         echo pr($newReviewProduct);
    //     }
    // }
    echo json_encode($response);
}
if (isset($_GET['getProductTypeSelect'])) {
    $shop = $_GET['shop'];
    $dataAllProductType = db_fetch_array("select * from custom_reviews_product_type where shop = '$shop'");
    $response = array();
    for ($i = 0; $i < count($dataAllProductType); $i++) {
        $data =  [(object)[
            "label" => $dataAllProductType[$i]['product_type'],
            "value" => $dataAllProductType[$i]['id'],
        ]];
        $response = array_merge($response, $data);
    }
    echo json_encode($response);
}
if (isset($_GET['getCollections'])) {
    $shop = $_GET['shop'];
    $value = isset($_GET['value']) ? $_GET['value'] : '';
    $selected = isset($_GET['selected']) ? $_GET['selected'] : 'allReview';
    $offset = isset($_GET['offset']) ? $_GET['offset'] * 20 : 0;
    $result = array();
    if ($selected === 'allReview') {
        $result = db_fetch_array("select * from custom_reviews_collections where shop = '$shop' and lower(title) like '%$value%' limit 20 offset $offset");
    }
    if ($selected === 'noReview') {
        $result = db_fetch_array("select * from custom_reviews_collections where shop = '$shop' and lower(title) like '%$value%' and countReviews = 0 limit 20 offset $offset");
    }
    if ($selected === 'addedReview') {
        $result = db_fetch_array("select * from custom_reviews_collections where shop = '$shop' and lower(title) like '%$value%' and countReviews > 0 limit 20 offset $offset");
    }
    echo json_encode($result);
}
if (isset($_GET['getCountCollections'])) {
    $shop = $_GET['shop'];
    $value = isset($_GET['value']) ? $_GET['value'] : '';
    $selected = isset($_GET['selected']) ? $_GET['selected'] : 'allReview';
    $result = array();
    if ($selected === 'allReview') {
        $result = db_fetch_array("select * from custom_reviews_collections where shop = '$shop' and lower(title) like '%$value%'");
    }
    if ($selected === 'noReview') {
        $result = db_fetch_array("select * from custom_reviews_collections where shop = '$shop' and lower(title) like '%$value%' and countReviews = 0");
    }
    if ($selected === 'addedReview') {
        $result = db_fetch_array("select * from custom_reviews_collections where shop = '$shop' and lower(title) like '%$value%' and countReviews > 0");
    }
    echo count($result);
}
if (isset($_GET['getProductType'])) {
    $shop = $_GET['shop'];
    $value = isset($_GET['value']) ? $_GET['value'] : '';
    $selected = isset($_GET['selected']) ? $_GET['selected'] : 'allReview';
    $offset = isset($_GET['offset']) ? $_GET['offset'] * 20 : 0;
    $result = array();
    if ($selected === 'allReview') {
        $result = db_fetch_array("select * from custom_reviews_product_type where shop = '$shop' and lower(product_type) like '%$value%' limit 20 offset $offset");
    }
    if ($selected === 'noReview') {
        $result = db_fetch_array("select * from custom_reviews_product_type where shop = '$shop' and lower(product_type) like '%$value%' and countReviews = 0 limit 20 offset $offset");
    }
    if ($selected === 'addedReview') {
        $result = db_fetch_array("select * from custom_reviews_product_type where shop = '$shop' and lower(product_type) like '%$value%' and countReviews > 0 limit 20 offset $offset");
    }
    echo json_encode($result);
}
if (isset($_GET['getCountProductType'])) {
    $shop = $_GET['shop'];
    $value = isset($_GET['value']) ? $_GET['value'] : '';
    $selected = isset($_GET['selected']) ? $_GET['selected'] : 'allReview';
    $result = array();
    if ($selected === 'allReview') {
        $result = db_fetch_array("select * from custom_reviews_product_type where shop = '$shop' and lower(product_type) like '%$value%'");
    }
    if ($selected === 'noReview') {
        $result = db_fetch_array("select * from custom_reviews_product_type where shop = '$shop' and lower(product_type) like '%$value%' and countReviews = 0");
    }
    if ($selected === 'addedReview') {
        $result = db_fetch_array("select * from custom_reviews_product_type where shop = '$shop' and lower(product_type) like '%$value%' and countReviews > 0");
    }
    echo count($result);
}


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

function countReviewsOfProduct($db, $shop, $id)
{
    $count = db_fetch_row("SELECT COUNT(*) FROM custom_reviews_database WHERE shop ='$shop' AND product_id = '$id'");
    return $count['COUNT(*)'];
}

if (isset($_GET['getAllProductDB'])) {
    $shop = $_GET['shop'];
    $listProducts = db_fetch_array("select * from custom_reviewss_products where shop = '$shop'");
    echo json_encode($listProducts);
}

if (isset($_GET['countProductInShopify'])) {
    $shop = $_GET['shop'];
    $shopify = shopifyInit($db, $shop, $appId);
    $count = $shopify("GET", "/admin/api/$api_version/products/count.json");
    echo $count;
}
if (isset($_GET['getAllReviews'])) {
    $shop = $_GET['shop'];
    $sql = "SELECT * FROM custom_reviews_database WHERE shop = '$shop'";
    $query = $db->query($sql);
    echo mysqli_num_rows($query);
}
if (isset($_GET['getVendorProduct'])) {
    $shop = $_GET['shop'];
    $vendors = db_fetch_array("SELECT * FROM custom_reviews_product_vendor WHERE shop = '$shop'");
    $response = array();
    for ($i = 0; $i < count($vendors); $i++) {
        $data =  [(object)[
            "label" => $vendors[$i]['vendor'],
            "value" => $vendors[$i]['vendor'],
        ]];
        $response = array_merge($response, $data);
    }
    echo json_encode($response);
}
// if (isset($_GET['getProductByVendor'])) {
//     if (isset($_GET['vendor'])) {
//         $vendor = $_GET['vendor'];
//         $dataVendors = db_fetch_array("SELECT * FROM custom_reviewss_products WHERE shop = '$shop' AND vendor = '$vendor'");
//         echo json_encode($dataVendors);
//     }
// }

if (isset($_GET['getPublishReviews'])) {
    $shop = $_GET['shop'];
    $sql = "SELECT * FROM custom_reviews_database WHERE shop = '$shop' AND publish = 1";
    $query = $db->query($sql);
    echo mysqli_num_rows($query);
}
if (isset($_GET['getUnPublishReviews'])) {
    $shop = $_GET['shop'];
    $sql = "SELECT * FROM custom_reviews_database WHERE shop = '$shop' AND publish = 0";
    $query = $db->query($sql);
    echo mysqli_num_rows($query);
}
if (isset($_GET['searchProduct'])) {
    $shop = $_GET['shop'];
    $type = isset($_GET['type']) ? $_GET['type'] : "0";
    $productType = (isset($_GET['productType']) && $_GET['productType'] !== '') ? $_GET['productType'][0] : "";
    $value = isset($_GET['value']) ? fixCharQuery($_GET['value']) : '';
    $offset = $_GET['offset'] * 20;
    $listProduct = array();
    if (isset($_GET['vendor']) && (!isset($_GET['collectionID']) || $_GET['collectionID'] == '')) {
        $vendor = $_GET['vendor'] !== '' ? $_GET['vendor'][0] : $_GET['vendor'];
        $tags = $_GET['tags'];
        if ($type === "0") {
            $listProduct = db_fetch_array("SELECT * FROM custom_reviewss_products WHERE shop = '$shop' AND lower(vendor) like '%$vendor%' AND lower(product_type) like '%$productType%' AND lower(tags) like '%$tags%' AND lower(products_title) like '%$value%' LIMIT 20 OFFSET $offset");
        }
        if ($type === "1") {
            $listProduct = db_fetch_array("SELECT * FROM custom_reviewss_products WHERE shop = '$shop' AND lower(vendor) like '%$vendor%' AND lower(product_type) like '%$productType%' AND lower(tags) like '%$tags%' AND countReviews > 0 AND lower(products_title) like '%$value%' LIMIT 20 OFFSET $offset");
        }
        if ($type === "2") {
            $listProduct = db_fetch_array("SELECT * FROM custom_reviewss_products WHERE shop = '$shop' AND lower(vendor) like '%$vendor%' AND lower(product_type) like '%$productType%' AND lower(tags) like '%$tags%' AND countReviews = 0 AND lower(products_title) like '%$value%' LIMIT 20 OFFSET $offset");
        }
        echo json_encode($listProduct);
    }
    if (isset($_GET['vendor']) && isset($_GET['collectionID']) && $_GET['collectionID'] !== "") {
        $vendor = $_GET['vendor'] !== '' ? $_GET['vendor'][0] : $_GET['vendor'];
        $tags = $_GET['tags'];
        $idCollection = $_GET['collectionID'][0];
        $allProductsInCollection = db_fetch_array("SELECT * FROM custom_reviews_connect_collections_and_products WHERE shop = '$shop' AND collection_id = $idCollection");
        $response = array();

        if ($type === "0") {
            foreach ($allProductsInCollection as $productsInCollection) {
                $idProduct = $productsInCollection['product_id'];
                $productDetail = db_fetch_array("SELECT * FROM custom_reviewss_products WHERE shop = '$shop' AND products_id  = $idProduct AND lower(product_type) like '%$productType%' AND  lower(vendor) like '%$vendor%' AND lower(tags) like '%$tags%' AND lower(products_title) like '%$value%' LIMIT 20 OFFSET $offset");
                $response = array_merge($response, $productDetail);
            }
        }
        if ($type === "1") {
            foreach ($allProductsInCollection as $productsInCollection) {
                $idProduct = $productsInCollection['product_id'];
                $productDetail = db_fetch_array("SELECT * FROM custom_reviewss_products WHERE shop = '$shop' AND products_id  = $idProduct AND lower(product_type) like '%$productType%' AND countReviews > 0 AND lower(vendor) like '%$vendor%' AND lower(tags) like '%$tags%' AND lower(products_title) like '%$value%' LIMIT 20 OFFSET $offset");
                $response = array_merge($response, $productDetail);
            }
        }
        if ($type === "2") {
            foreach ($allProductsInCollection as $productsInCollection) {
                $idProduct = $productsInCollection['product_id'];
                $productDetail = db_fetch_array("SELECT * FROM custom_reviewss_products WHERE shop = '$shop' AND products_id  = $idProduct AND lower(product_type) like '%$productType%' AND countReviews = 0 AND lower(vendor) like '%$vendor%' AND lower(tags) like '%$tags%' AND lower(products_title) like '%$value%' LIMIT 20 OFFSET $offset");
                $response = array_merge($response, $productDetail);
            }
        }
        echo json_encode($response);
    } else if (!isset($_GET['vendor']) && !isset($_GET['collectionID'])) {
        if ($type === "0") {
            $listProduct = db_fetch_array("SELECT * FROM custom_reviewss_products WHERE shop = '$shop'  AND lower(products_title) like '%$value%' LIMIT 20 OFFSET $offset");
        }
        if ($type === "1") {
            $listProduct = db_fetch_array("SELECT * FROM custom_reviewss_products WHERE shop = '$shop' AND countReviews > 0 AND lower(products_title) like '%$value%' LIMIT 20 OFFSET $offset");
        }
        if ($type === "2") {
            $listProduct = db_fetch_array("SELECT * FROM custom_reviewss_products WHERE shop = '$shop'  AND countReviews = 0 AND lower(products_title) like '%$value%' LIMIT 20 OFFSET $offset");
        }
        echo json_encode($listProduct);
    }
}

if (isset($_GET['getCountProductSearch'])) {
    $shop = $_GET['shop'];
    $type = isset($_GET['type']) ? $_GET['type'] : "0";
    $productType = (isset($_GET['productType']) && $_GET['productType'] !== '') ? $_GET['productType'][0] : "";
    $value = isset($_GET['value']) ? fixCharQuery($_GET['value']) : '';
    $listProduct = array();
    if (isset($_GET['vendor']) && (!isset($_GET['collectionID']) || $_GET['collectionID'] == '')) {
        $vendor = $_GET['vendor'] !== '' ? $_GET['vendor'][0] : $_GET['vendor'];
        $tags = $_GET['tags'];
        if ($type === "0") {
            $listProduct = db_fetch_array("SELECT * FROM custom_reviewss_products WHERE shop = '$shop' AND lower(vendor) like '%$vendor%' AND lower(product_type) like '%$productType%' AND lower(tags) like '%$tags%' AND lower(products_title) like '%$value%'");
        }
        if ($type === "1") {
            $listProduct = db_fetch_array("SELECT * FROM custom_reviewss_products WHERE shop = '$shop' AND lower(vendor) like '%$vendor%' AND lower(product_type) like '%$productType%' AND lower(tags) like '%$tags%' AND countReviews > 0 AND lower(products_title) like '%$value%'");
        }
        if ($type === "2") {
            $listProduct = db_fetch_array("SELECT * FROM custom_reviewss_products WHERE shop = '$shop' AND lower(vendor) like '%$vendor%' AND lower(product_type) like '%$productType%' AND lower(tags) like '%$tags%' AND countReviews = 0 AND lower(products_title) like '%$value%'");
        }
        echo count($listProduct);
    }
    if (isset($_GET['vendor']) && isset($_GET['collectionID']) && $_GET['collectionID'] !== "") {
        $vendor = $_GET['vendor'] !== '' ? $_GET['vendor'][0] : $_GET['vendor'];
        $tags = $_GET['tags'];
        $idCollection = $_GET['collectionID'][0];
        $allProductsInCollection = db_fetch_array("SELECT * FROM custom_reviews_connect_collections_and_products WHERE shop = '$shop' AND collection_id = $idCollection");
        $response = array();

        if ($type === "0") {
            foreach ($allProductsInCollection as $productsInCollection) {
                $idProduct = $productsInCollection['product_id'];
                $productDetail = db_fetch_array("SELECT * FROM custom_reviewss_products WHERE shop = '$shop' AND products_id  = $idProduct AND lower(product_type) like '%$productType%' AND  lower(vendor) like '%$vendor%' AND lower(tags) like '%$tags%' AND lower(products_title) like '%$value%'");
                $response = array_merge($response, $productDetail);
            }
        }
        if ($type === "1") {
            foreach ($allProductsInCollection as $productsInCollection) {
                $idProduct = $productsInCollection['product_id'];
                $productDetail = db_fetch_array("SELECT * FROM custom_reviewss_products WHERE shop = '$shop' AND products_id  = $idProduct AND lower(product_type) like '%$productType%' AND countReviews > 0 AND lower(vendor) like '%$vendor%' AND lower(tags) like '%$tags%' AND lower(products_title) like '%$value%'");
                $response = array_merge($response, $productDetail);
            }
        }
        if ($type === "2") {
            foreach ($allProductsInCollection as $productsInCollection) {
                $idProduct = $productsInCollection['product_id'];
                $productDetail = db_fetch_array("SELECT * FROM custom_reviewss_products WHERE shop = '$shop' AND products_id  = $idProduct AND lower(product_type) like '%$productType%' AND countReviews = 0 AND lower(vendor) like '%$vendor%' AND lower(tags) like '%$tags%' AND lower(products_title) like '%$value%'");
                $response = array_merge($response, $productDetail);
            }
        }
        echo count($response);
    } else if (!isset($_GET['vendor']) && !isset($_GET['collectionID'])) {
        if ($type === "0") {
            $listProduct = db_fetch_array("SELECT * FROM custom_reviewss_products WHERE shop = '$shop'  AND lower(products_title) like '%$value%'");
        }
        if ($type === "1") {
            $listProduct = db_fetch_array("SELECT * FROM custom_reviewss_products WHERE shop = '$shop' AND countReviews > 0 AND lower(products_title) like '%$value%'");
        }
        if ($type === "2") {
            $listProduct = db_fetch_array("SELECT * FROM custom_reviewss_products WHERE shop = '$shop'  AND countReviews = 0 AND lower(products_title) like '%$value%'");
        }
        echo count($listProduct);
    }
}
// if (isset($_GET['searchReview'])) {
//     // $tabs = $_GET['vendor'] !== '' ? $_GET['vendor'][0] : $_GET['vendor'];

//     $type = isset($_GET['type']) ? $_GET['type'] : "allReview";
//     $tags = isset($_GET['tags']) ? $_GET['tags'] : "";
//     $productType = (isset($_GET['productType']) && $_GET['productType'] !== '') ? $_GET['productType'][0] : "";
//     $value = fixCharQuery($_GET['value']);
//     $offset = $_GET['offset'] * 20;
//     $end = ($_GET['offset'] + 1) * 20;
//     $start = $offset - 20;
//     $listProduct = array();
//     if (isset($_GET['productType']) && $_GET['productType'] !== '' && (!isset($_GET['collectionID']) || $_GET['collectionID'] == '')) {
//         $arrayReviewIDTypes = db_fetch_array("SELECT review_id FROM custom_reviews_connect_product_types_and_reviews WHERE shop = '$shop' AND id_product_type = $productType");
//         $result = array();
//         foreach ($arrayReviewIDTypes as $idReviewsInType) {
//             $idReviewInType = $idReviewsInType["review_id"];
//             $allReviewInType = db_fetch_array("SELECT * FROM custom_reviews_database WHERE shop = '$shop' AND id = $idReviewInType AND lower(tags) like '%$tags%' AND (lower(reviewer_title) like '%$value%' OR lower(reviewer_name) like '%$value%' OR lower(reviewer_mess) like '%$value%' OR lower(product_title) like '%$value%')");
//             $result = array_merge($result, $allReviewInType);
//         }
//         $response = array();
//         for ($start; $start < $end; $start++) {
//             if (isset($result[$start])) {
//                 $response = array_merge($response, array($result[$start]));
//             }
//         }
//         echo pr($response);
//     }
//     if (isset($_GET['collectionID']) && $_GET['collectionID'] !== "") {
//         $idCollection = $_GET['collectionID'][0];
//         $result = array();
//         $reviewIDInCollection = db_fetch_array("SELECT review_id FROM custom_reviews_connect_collections_and_reviews WHERE shop = '$shop' AND collection_id = $idCollection");
//         foreach ($reviewIDInCollection as $reviewInCollection) {
//             $idReview = $reviewInCollection["review_id"];
//             $allReviewInCollection = db_fetch_array("SELECT * FROM custom_reviews_database WHERE shop = '$shop' AND id = $idReview AND lower(tags) like '%$tags%' AND (lower(reviewer_title) like '%$value%' OR lower(reviewer_name) like '%$value%' OR lower(reviewer_mess) like '%$value%' OR lower(product_title) like '%$value%')");
//             $result = array_merge($result, $allReviewInCollection);
//         }
//         $response = array();
//         for ($start; $start < $end; $start++) {
//             if (isset($result[$start])) {
//                 $response = array_merge($response, array($result[$start]));
//             }
//         }
//         echo json_encode($response);
//     } else if ((!isset($_GET['productType']) && $productType !== '') && (!isset($_GET['collectionID']) && $_GET['collectionID'] == '')) {
//         $listProduct = db_fetch_array("SELECT * FROM custom_reviews_database WHERE shop = '$shop'  AND (lower(reviewer_title) like '%$value%' OR lower(reviewer_name) like '%$value%' OR lower(reviewer_mess) like '%$value%' OR lower(product_title) like '%$value%') LIMIT 20 OFFSET $offset");
//         echo json_encode($listProduct);
//     }
// }
if (isset($_GET['searchReview'])) {
    $shop = $_GET['shop'];
    $idFilterProduct = isset($_GET['idProduct']) ? $_GET['idProduct'] : '';
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 20;
    $sort = isset($_GET['sort']) ? $_GET['sort'] : 'id';
    $type = isset($_GET['selected']) ? $_GET['selected'] : 0;
    $productType = (isset($_GET['productType']) && $_GET['productType'] !== '') ? $_GET['productType'][0] : "";
    $value = isset($_GET['value']) ? fixCharQuery($_GET['value']) : '';
    $offset = $_GET['offset'] * $limit;
    $end = ($_GET['offset'] + 1) * $limit;
    $start = $offset - $limit;
    $listProduct = array();
    $vendor = "";
    if (isset($_GET['vendor']) && $_GET['vendor'] !== '') {
        $vendor = $_GET['vendor'][0];
    }
    $collection = isset($_GET['collectionID']) ? $_GET['collectionID'] : '';
    $productType = isset($_GET['productType']) ? $_GET['productType'] : '';
    if ($type == 0) {
        if ($productType !== '' && $collection == "") {
            $productTypeConvert = $productType[0];
            $arrayReviewIDTypes = db_fetch_array("SELECT review_id FROM custom_reviews_connect_product_types_and_reviews WHERE shop = '$shop' AND id_product_type = $productTypeConvert");
            $result = array();
            foreach ($arrayReviewIDTypes as $idReviewsInType) {
                $idReviewInType = $idReviewsInType["review_id"];
                $allReviewInType = db_fetch_array("SELECT * FROM custom_reviews_database WHERE shop = '$shop' AND id = $idReviewInType AND lower(reviewer_rating) like '%$vendor%' AND (lower(reviewer_title) like '%$value%' OR lower(reviewer_name) like '%$value%' OR lower(reviewer_mess) like '%$value%' )");
                $result = array_merge($result, $allReviewInType);
            }
            switch ($sort) {
                case 'reviewer_name': {
                        usort($result, function ($a, $b) {
                            return strcmp($a['reviewer_name'], $b['reviewer_name']);
                        });
                    }
                    break;
                case 'reviewer_rating': {
                        usort($result, function ($a, $b) {
                            return strcmp($a['reviewer_rating'], $b['reviewer_rating']);
                        });
                        $result = array_reverse($result);
                    }
                    break;
                case 'reviewer_title': {
                        usort($result, function ($a, $b) {
                            return strcmp($a['reviewer_title'], $b['reviewer_title']);
                        });
                    }
                    break;
                case 'import_source': {
                        usort($result, function ($a, $b) {
                            return strcmp($a['import_source'], $b['import_source']);
                        });
                    }
                    break;
            }
            for ($start; $start < $end; $start++) {
                if (isset($result[$start])) {
                    $listProduct = array_merge($listProduct, array($result[$start]));
                }
            }
        }
        if ($collection !== "" && $productType == "") {
            $idCollection = $_GET['collectionID'][0];
            $result = array();
            $reviewIDInCollection = db_fetch_array("SELECT review_id FROM custom_reviews_connect_collections_and_reviews WHERE shop = '$shop' AND collection_id = $idCollection");
            foreach ($reviewIDInCollection as $reviewInCollection) {
                $idReview = $reviewInCollection["review_id"];
                $allReviewInCollection = db_fetch_array("SELECT * FROM custom_reviews_database WHERE shop = '$shop' AND id = $idReview AND lower(reviewer_rating) like '%$vendor%'  AND (lower(reviewer_title) like '%$value%' OR lower(reviewer_name) like '%$value%' OR lower(reviewer_mess) like '%$value%' )");
                $result = array_merge($result, $allReviewInCollection);
            }
            switch ($sort) {
                case 'reviewer_name': {
                        usort($result, function ($a, $b) {
                            return strcmp($a['reviewer_name'], $b['reviewer_name']);
                        });
                    }
                    break;
                case 'reviewer_rating': {
                        usort($result, function ($a, $b) {
                            return strcmp($a['reviewer_rating'], $b['reviewer_rating']);
                        });
                        $result = array_reverse($result);
                    }
                    break;
                case 'reviewer_title': {
                        usort($result, function ($a, $b) {
                            return strcmp($a['reviewer_title'], $b['reviewer_title']);
                        });
                    }
                    break;
                case 'import_source': {
                        usort($result, function ($a, $b) {
                            return strcmp($a['import_source'], $b['import_source']);
                        });
                    }
                    break;
            }
            for ($start; $start < $end; $start++) {
                if (isset($result[$start])) {
                    $listProduct = array_merge($listProduct, array($result[$start]));
                }
            }
        }
        if ($collection !== "" && $productType !== "") {
            $idCollection = $_GET['collectionID'][0];
            $productTypeConvert = $productType[0];

            $result = array();
            $reviewIDInCollection = db_fetch_array("SELECT review_id FROM custom_reviews_connect_collections_and_reviews WHERE shop = '$shop' AND collection_id = $idCollection");
            $arrayReviewIDTypes = db_fetch_array("SELECT review_id FROM custom_reviews_connect_product_types_and_reviews WHERE shop = '$shop' AND id_product_type = $productTypeConvert");
            $arrayTempCollection = array();
            $arrayTempType = array();
            foreach ($reviewIDInCollection as $idCollectionNeedConverts) {
                $idCollectionNeedConvert = $idCollectionNeedConverts["review_id"];
                $arrayTempCollection = array_merge($arrayTempCollection, array($idCollectionNeedConvert));
            }
            foreach ($arrayReviewIDTypes as $idTypeNeedConverts) {
                $idTypeNeedConvert = $idTypeNeedConverts["review_id"];
                $arrayTempType = array_merge($arrayTempType, array($idTypeNeedConvert));
            }
            foreach ($arrayTempCollection as $eleTemCollections) {
                foreach ($arrayTempType as $eleTempType) {
                    if ($eleTempType === $eleTemCollections) {
                        $allReviewInType = db_fetch_array("SELECT * FROM custom_reviews_database WHERE shop = '$shop' AND id = $eleTempType AND lower(reviewer_rating) like '%$vendor%' AND (lower(reviewer_title) like '%$value%' OR lower(reviewer_name) like '%$value%' OR lower(reviewer_mess) like '%$value%' )");
                        $result = array_merge($result, $allReviewInType);
                    }
                }
            }
            switch ($sort) {
                case 'reviewer_name': {
                        usort($result, function ($a, $b) {
                            return strcmp($a['reviewer_name'], $b['reviewer_name']);
                        });
                    }
                    break;
                case 'reviewer_rating': {
                        usort($result, function ($a, $b) {
                            return strcmp($a['reviewer_rating'], $b['reviewer_rating']);
                        });
                        $result = array_reverse($result);
                    }
                    break;
                case 'reviewer_title': {
                        usort($result, function ($a, $b) {
                            return strcmp($a['reviewer_title'], $b['reviewer_title']);
                        });
                    }
                    break;
                case 'import_source': {
                        usort($result, function ($a, $b) {
                            return strcmp($a['import_source'], $b['import_source']);
                        });
                    }
                    break;
            }
            for ($start; $start < $end; $start++) {
                if (isset($result[$start])) {
                    $listProduct = array_merge($listProduct, array($result[$start]));
                }
            }
        } else if ($productType == "" && $collection == '') {

            if ($sort == 'id' || $sort == 'reviewer_rating') {
                $listProduct = db_fetch_array("SELECT * FROM custom_reviews_database WHERE shop = '$shop' AND lower(reviewer_rating) like '%$vendor%'   AND (lower(reviewer_title) like '%$value%' OR lower(reviewer_name) like '%$value%' OR lower(reviewer_mess) like '%$value%' ) ORDER BY $sort DESC LIMIT $limit OFFSET $offset ");
            } else {
                $listProduct = db_fetch_array("SELECT * FROM custom_reviews_database WHERE shop = '$shop' AND lower(reviewer_rating) like '%$vendor%'   AND (lower(reviewer_title) like '%$value%' OR lower(reviewer_name) like '%$value%' OR lower(reviewer_mess) like '%$value%' ) ORDER BY $sort ASC LIMIT $limit OFFSET $offset ");
            }
            // echo "SELECT * FROM custom_reviews_database WHERE shop = '$shop' AND lower(vendor) like '%$vendor%' AND lower(tags) like '%$tags%'  AND (lower(reviewer_title) like '%$value%' OR lower(reviewer_name) like '%$value%' OR lower(reviewer_mess) like '%$value%' ) ORDER BY $sort DESC LIMIT 20 OFFSET $offset";
        }
    }
    if ($type == 1) {
        $result = array();
        $key = array();
        $listProduct = array();
        $ArrIdReviewsHasImages = db_fetch_array("SELECT review_id FROM custom_reviews_images WHERE shop = '$shop'");
        foreach ($ArrIdReviewsHasImages as $objArrId) {
            $idReviewHasImages = $objArrId['review_id'];
            $key = array_merge($key, [$idReviewHasImages]);
        }
        $key = array_unique($key); //id review has images
        if ($productType !== '' && $collection == "") {
            $productTypeConvert = $productType[0];
            $arrayReviewIDTypes = db_fetch_array("SELECT review_id FROM custom_reviews_connect_product_types_and_reviews WHERE shop = '$shop' AND id_product_type = $productTypeConvert");
            $result = array();
            foreach ($arrayReviewIDTypes as $idReviewsInType) {
                $idReviewInType = $idReviewsInType["review_id"];
                foreach ($key as $eleKey) {
                    if ($idReviewInType == $eleKey) {
                        $allReviewInType = db_fetch_array("SELECT * FROM custom_reviews_database WHERE shop = '$shop' AND id = $idReviewInType AND lower(reviewer_rating) like '%$vendor%'AND  AND (lower(reviewer_title) like '%$value%' OR lower(reviewer_name) like '%$value%' OR lower(reviewer_mess) like '%$value%' )");
                        $result = array_merge($result, $allReviewInType);
                    }
                }
            }
            switch ($sort) {
                case 'reviewer_name': {
                        usort($result, function ($a, $b) {
                            return strcmp($a['reviewer_name'], $b['reviewer_name']);
                        });
                    }
                    break;
                case 'reviewer_rating': {
                        usort($result, function ($a, $b) {
                            return strcmp($a['reviewer_rating'], $b['reviewer_rating']);
                        });
                        $result = array_reverse($result);
                    }
                    break;
                case 'reviewer_title': {
                        usort($result, function ($a, $b) {
                            return strcmp($a['reviewer_title'], $b['reviewer_title']);
                        });
                    }
                    break;
                case 'import_source': {
                        usort($result, function ($a, $b) {
                            return strcmp($a['import_source'], $b['import_source']);
                        });
                    }
                    break;
            }
            for ($start; $start < $end; $start++) {
                if (isset($result[$start])) {
                    $listProduct = array_merge($listProduct, array($result[$start]));
                }
            }
        }
        if ($collection !== "" && $productType == "") {
            $idCollection = $_GET['collectionID'][0];
            $result = array();
            $reviewIDInCollection = db_fetch_array("SELECT review_id FROM custom_reviews_connect_collections_and_reviews WHERE shop = '$shop' AND collection_id = $idCollection");
            foreach ($reviewIDInCollection as $reviewInCollection) {
                $idReview = $reviewInCollection["review_id"];
                foreach ($key as $eleKey) {
                    if ($idReview == $eleKey) {
                        $allReviewInCollection = db_fetch_array("SELECT * FROM custom_reviews_database WHERE shop = '$shop' AND id = $idReview AND lower(reviewer_rating) like '%$vendor%'  AND (lower(reviewer_title) like '%$value%' OR lower(reviewer_name) like '%$value%' OR lower(reviewer_mess) like '%$value%' )");
                        $result = array_merge($result, $allReviewInCollection);
                    }
                }
            }
            switch ($sort) {
                case 'reviewer_name': {
                        usort($result, function ($a, $b) {
                            return strcmp($a['reviewer_name'], $b['reviewer_name']);
                        });
                    }
                    break;
                case 'reviewer_rating': {
                        usort($result, function ($a, $b) {
                            return strcmp($a['reviewer_rating'], $b['reviewer_rating']);
                        });
                        $result = array_reverse($result);
                    }
                    break;
                case 'reviewer_title': {
                        usort($result, function ($a, $b) {
                            return strcmp($a['reviewer_title'], $b['reviewer_title']);
                        });
                    }
                    break;
                case 'import_source': {
                        usort($result, function ($a, $b) {
                            return strcmp($a['import_source'], $b['import_source']);
                        });
                    }
                    break;
            }
            for ($start; $start < $end; $start++) {
                if (isset($result[$start])) {
                    $listProduct = array_merge($listProduct, array($result[$start]));
                }
            }
        }
        if ($collection !== "" && $productType !== "") {
            $idCollection = $_GET['collectionID'][0];
            $productTypeConvert = $productType[0];

            $result = array();
            $reviewIDInCollection = db_fetch_array("SELECT review_id FROM custom_reviews_connect_collections_and_reviews WHERE shop = '$shop' AND collection_id = $idCollection");
            $arrayReviewIDTypes = db_fetch_array("SELECT review_id FROM custom_reviews_connect_product_types_and_reviews WHERE shop = '$shop' AND id_product_type = $productTypeConvert");
            $arrayTempCollection = array();
            $arrayTempType = array();
            foreach ($reviewIDInCollection as $idCollectionNeedConverts) {
                $idCollectionNeedConvert = $idCollectionNeedConverts["review_id"];
                $arrayTempCollection = array_merge($arrayTempCollection, array($idCollectionNeedConvert));
            }
            foreach ($arrayReviewIDTypes as $idTypeNeedConverts) {
                $idTypeNeedConvert = $idTypeNeedConverts["review_id"];
                $arrayTempType = array_merge($arrayTempType, array($idTypeNeedConvert));
            }
            foreach ($arrayTempCollection as $eleTemCollections) {
                foreach ($arrayTempType as $eleTempType) {
                    foreach ($key as $eleKey) {
                        if ($eleTempType == $eleTemCollections && $eleTemCollections  == $eleKey) {
                            $allReviewInType = db_fetch_array("SELECT * FROM custom_reviews_database WHERE shop = '$shop' AND id = $eleTempType AND lower(reviewer_rating) like '%$vendor%'AND (lower(reviewer_title) like '%$value%' OR lower(reviewer_name) like '%$value%' OR lower(reviewer_mess) like '%$value%' )");
                            $result = array_merge($result, $allReviewInType);
                        }
                    }
                }
            }
            //huydangsua
            switch ($sort) {
                case 'reviewer_name': {
                        usort($result, function ($a, $b) {
                            return strcmp($a['reviewer_name'], $b['reviewer_name']);
                        });
                    }
                    break;
                case 'reviewer_rating': {
                        usort($result, function ($a, $b) {
                            return strcmp($a['reviewer_rating'], $b['reviewer_rating']);
                        });
                        $result = array_reverse($result);
                    }
                    break;
                case 'reviewer_title': {
                        usort($result, function ($a, $b) {
                            return strcmp($a['reviewer_title'], $b['reviewer_title']);
                        });
                    }
                    break;
                case 'import_source': {
                        usort($result, function ($a, $b) {
                            return strcmp($a['import_source'], $b['import_source']);
                        });
                    }
                    break;
            }
            for ($start; $start < $end; $start++) {
                if (isset($result[$start])) {
                    $listProduct = array_merge($listProduct, array($result[$start]));
                }
            }
        } else if ($productType == "" && $collection == '') {
            foreach ($key as $idReviewHasImages) {
                $resultReviewHasImages = db_fetch_array("SELECT * FROM custom_reviews_database WHERE shop = '$shop' AND id ='$idReviewHasImages' AND lower(reviewer_rating) like '%$vendor%'   AND (lower(reviewer_title) like '%$value%' OR lower(reviewer_name) like '%$value%' OR lower(reviewer_mess) like '%$value%' )");
                $result = array_merge($result, $resultReviewHasImages);
            }
            switch ($sort) {
                case 'reviewer_name': {
                        usort($result, function ($a, $b) {
                            return strcmp($a['reviewer_name'], $b['reviewer_name']);
                        });
                    }
                    break;
                case 'reviewer_rating': {
                        usort($result, function ($a, $b) {
                            return strcmp($a['reviewer_rating'], $b['reviewer_rating']);
                        });
                        $result = array_reverse($result);
                    }
                    break;
                case 'reviewer_title': {
                        usort($result, function ($a, $b) {
                            return strcmp($a['reviewer_title'], $b['reviewer_title']);
                        });
                    }
                    break;
                case 'import_source': {
                        usort($result, function ($a, $b) {
                            return strcmp($a['import_source'], $b['import_source']);
                        });
                    }
                    break;
            }
            for ($start; $start < $end; $start++) {
                if (isset($result[$start])) {
                    $listProduct = array_merge($listProduct, array($result[$start]));
                }
            }
        }
        // //end
    }
    if ($type == 2) {
        if ($productType !== '' && $collection == "") {
            $productTypeConvert = $productType[0];
            $arrayReviewIDTypes = db_fetch_array("SELECT review_id FROM custom_reviews_connect_product_types_and_reviews WHERE shop = '$shop' AND id_product_type = $productTypeConvert");
            $result = array();
            foreach ($arrayReviewIDTypes as $idReviewsInType) {
                $idReviewInType = $idReviewsInType["review_id"];
                $allReviewInType = db_fetch_array("SELECT * FROM custom_reviews_database WHERE shop = '$shop' AND id = $idReviewInType AND publish = 1 AND lower(reviewer_rating) like '%$vendor%' AND (lower(reviewer_title) like '%$value%' OR lower(reviewer_name) like '%$value%' OR lower(reviewer_mess) like '%$value%' )");
                $result = array_merge($result, $allReviewInType);
            }
            switch ($sort) {
                case 'reviewer_name': {
                        usort($result, function ($a, $b) {
                            return strcmp($a['reviewer_name'], $b['reviewer_name']);
                        });
                    }
                    break;
                case 'reviewer_rating': {
                        usort($result, function ($a, $b) {
                            return strcmp($a['reviewer_rating'], $b['reviewer_rating']);
                        });
                        $result = array_reverse($result);
                    }
                    break;
                case 'reviewer_title': {
                        usort($result, function ($a, $b) {
                            return strcmp($a['reviewer_title'], $b['reviewer_title']);
                        });
                    }
                    break;
                case 'import_source': {
                        usort($result, function ($a, $b) {
                            return strcmp($a['import_source'], $b['import_source']);
                        });
                    }
                    break;
            }
            for ($start; $start < $end; $start++) {
                if (isset($result[$start])) {
                    $listProduct = array_merge($listProduct, array($result[$start]));
                }
            }
        }
        if ($collection !== "" && $productType == "") {
            $idCollection = $_GET['collectionID'][0];
            $result = array();
            $reviewIDInCollection = db_fetch_array("SELECT review_id FROM custom_reviews_connect_collections_and_reviews WHERE shop = '$shop' AND collection_id = $idCollection");
            foreach ($reviewIDInCollection as $reviewInCollection) {
                $idReview = $reviewInCollection["review_id"];
                $allReviewInCollection = db_fetch_array("SELECT * FROM custom_reviews_database WHERE shop = '$shop' AND id = $idReview AND publish = 1 AND lower(reviewer_rating) like '%$vendor%'  AND (lower(reviewer_title) like '%$value%' OR lower(reviewer_name) like '%$value%' OR lower(reviewer_mess) like '%$value%' )");
                $result = array_merge($result, $allReviewInCollection);
            }
            switch ($sort) {
                case 'reviewer_name': {
                        usort($result, function ($a, $b) {
                            return strcmp($a['reviewer_name'], $b['reviewer_name']);
                        });
                    }
                    break;
                case 'reviewer_rating': {
                        usort($result, function ($a, $b) {
                            return strcmp($a['reviewer_rating'], $b['reviewer_rating']);
                        });
                        $result = array_reverse($result);
                    }
                    break;
                case 'reviewer_title': {
                        usort($result, function ($a, $b) {
                            return strcmp($a['reviewer_title'], $b['reviewer_title']);
                        });
                    }
                    break;
                case 'import_source': {
                        usort($result, function ($a, $b) {
                            return strcmp($a['import_source'], $b['import_source']);
                        });
                    }
                    break;
            }
            for ($start; $start < $end; $start++) {
                if (isset($result[$start])) {
                    $listProduct = array_merge($listProduct, array($result[$start]));
                }
            }
        }
        if ($collection !== "" && $productType !== "") {
            $idCollection = $_GET['collectionID'][0];
            $productTypeConvert = $productType[0];

            $result = array();
            $reviewIDInCollection = db_fetch_array("SELECT review_id FROM custom_reviews_connect_collections_and_reviews WHERE shop = '$shop' AND collection_id = $idCollection");
            $arrayReviewIDTypes = db_fetch_array("SELECT review_id FROM custom_reviews_connect_product_types_and_reviews WHERE shop = '$shop' AND id_product_type = $productTypeConvert");
            $arrayTempCollection = array();
            $arrayTempType = array();
            foreach ($reviewIDInCollection as $idCollectionNeedConverts) {
                $idCollectionNeedConvert = $idCollectionNeedConverts["review_id"];
                $arrayTempCollection = array_merge($arrayTempCollection, array($idCollectionNeedConvert));
            }
            foreach ($arrayReviewIDTypes as $idTypeNeedConverts) {
                $idTypeNeedConvert = $idTypeNeedConverts["review_id"];
                $arrayTempType = array_merge($arrayTempType, array($idTypeNeedConvert));
            }
            foreach ($arrayTempCollection as $eleTemCollections) {
                foreach ($arrayTempType as $eleTempType) {
                    if ($eleTempType === $eleTemCollections) {
                        $allReviewInType = db_fetch_array("SELECT * FROM custom_reviews_database WHERE shop = '$shop' AND id = $eleTempType AND publish = 1 AND lower(reviewer_rating) like '%$vendor%' AND (lower(reviewer_title) like '%$value%' OR lower(reviewer_name) like '%$value%' OR lower(reviewer_mess) like '%$value%' )");
                        $result = array_merge($result, $allReviewInType);
                    }
                }
            }
            switch ($sort) {
                case 'reviewer_name': {
                        usort($result, function ($a, $b) {
                            return strcmp($a['reviewer_name'], $b['reviewer_name']);
                        });
                    }
                    break;
                case 'reviewer_rating': {
                        usort($result, function ($a, $b) {
                            return strcmp($a['reviewer_rating'], $b['reviewer_rating']);
                        });
                        $result = array_reverse($result);
                    }
                    break;
                case 'reviewer_title': {
                        usort($result, function ($a, $b) {
                            return strcmp($a['reviewer_title'], $b['reviewer_title']);
                        });
                    }
                    break;
                case 'import_source': {
                        usort($result, function ($a, $b) {
                            return strcmp($a['import_source'], $b['import_source']);
                        });
                    }
                    break;
            }
            for ($start; $start < $end; $start++) {
                if (isset($result[$start])) {
                    $listProduct = array_merge($listProduct, array($result[$start]));
                }
            }
        } else if ($productType == "" && $collection == '') {
            if ($sort == 'id' || $sort == 'reviewer_rating') {
                $listProduct = db_fetch_array("SELECT * FROM custom_reviews_database WHERE shop = '$shop' AND publish = 1 AND lower(reviewer_rating) like '%$vendor%'   AND (lower(reviewer_title) like '%$value%' OR lower(reviewer_name) like '%$value%' OR lower(reviewer_mess) like '%$value%' ) ORDER BY $sort DESC LIMIT $limit OFFSET $offset ");
            } else {
                $listProduct = db_fetch_array("SELECT * FROM custom_reviews_database WHERE shop = '$shop' AND publish = 1 AND lower(reviewer_rating) like '%$vendor%'  AND (lower(reviewer_title) like '%$value%' OR lower(reviewer_name) like '%$value%' OR lower(reviewer_mess) like '%$value%' ) ORDER BY $sort ASC LIMIT $limit OFFSET $offset ");
            }
        }
    }
    if ($type == 3) {
        if ($productType !== '' && $collection == "") {
            $productTypeConvert = $productType[0];
            $arrayReviewIDTypes = db_fetch_array("SELECT review_id FROM custom_reviews_connect_product_types_and_reviews WHERE shop = '$shop' AND id_product_type = $productTypeConvert");
            $result = array();
            foreach ($arrayReviewIDTypes as $idReviewsInType) {
                $idReviewInType = $idReviewsInType["review_id"];
                $allReviewInType = db_fetch_array("SELECT * FROM custom_reviews_database WHERE shop = '$shop' AND id = $idReviewInType AND featured = 1 AND lower(reviewer_rating) like '%$vendor%' AND (lower(reviewer_title) like '%$value%' OR lower(reviewer_name) like '%$value%' OR lower(reviewer_mess) like '%$value%' )");
                $result = array_merge($result, $allReviewInType);
            }
            switch ($sort) {
                case 'reviewer_name': {
                        usort($result, function ($a, $b) {
                            return strcmp($a['reviewer_name'], $b['reviewer_name']);
                        });
                    }
                    break;
                case 'reviewer_rating': {
                        usort($result, function ($a, $b) {
                            return strcmp($a['reviewer_rating'], $b['reviewer_rating']);
                        });
                        $result = array_reverse($result);
                    }
                    break;
                case 'reviewer_title': {
                        usort($result, function ($a, $b) {
                            return strcmp($a['reviewer_title'], $b['reviewer_title']);
                        });
                    }
                    break;
                case 'import_source': {
                        usort($result, function ($a, $b) {
                            return strcmp($a['import_source'], $b['import_source']);
                        });
                    }
                    break;
            }
            for ($start; $start < $end; $start++) {
                if (isset($result[$start])) {
                    $listProduct = array_merge($listProduct, array($result[$start]));
                }
            }
        }
        if ($collection !== "" && $productType == "") {
            $idCollection = $_GET['collectionID'][0];
            $result = array();
            $reviewIDInCollection = db_fetch_array("SELECT review_id FROM custom_reviews_connect_collections_and_reviews WHERE shop = '$shop' AND collection_id = $idCollection");
            foreach ($reviewIDInCollection as $reviewInCollection) {
                $idReview = $reviewInCollection["review_id"];
                $allReviewInCollection = db_fetch_array("SELECT * FROM custom_reviews_database WHERE shop = '$shop' AND id = $idReview AND featured = 1 AND lower(reviewer_rating) like '%$vendor%' AND (lower(reviewer_title) like '%$value%' OR lower(reviewer_name) like '%$value%' OR lower(reviewer_mess) like '%$value%' )");
                $result = array_merge($result, $allReviewInCollection);
            }
            switch ($sort) {
                case 'reviewer_name': {
                        usort($result, function ($a, $b) {
                            return strcmp($a['reviewer_name'], $b['reviewer_name']);
                        });
                    }
                    break;
                case 'reviewer_rating': {
                        usort($result, function ($a, $b) {
                            return strcmp($a['reviewer_rating'], $b['reviewer_rating']);
                        });
                        $result = array_reverse($result);
                    }
                    break;
                case 'reviewer_title': {
                        usort($result, function ($a, $b) {
                            return strcmp($a['reviewer_title'], $b['reviewer_title']);
                        });
                    }
                    break;
                case 'import_source': {
                        usort($result, function ($a, $b) {
                            return strcmp($a['import_source'], $b['import_source']);
                        });
                    }
                    break;
            }
            for ($start; $start < $end; $start++) {
                if (isset($result[$start])) {
                    $listProduct = array_merge($listProduct, array($result[$start]));
                }
            }
        }
        if ($collection !== "" && $productType !== "") {
            $idCollection = $_GET['collectionID'][0];
            $productTypeConvert = $productType[0];

            $result = array();
            $reviewIDInCollection = db_fetch_array("SELECT review_id FROM custom_reviews_connect_collections_and_reviews WHERE shop = '$shop' AND collection_id = $idCollection");
            $arrayReviewIDTypes = db_fetch_array("SELECT review_id FROM custom_reviews_connect_product_types_and_reviews WHERE shop = '$shop' AND id_product_type = $productTypeConvert");
            $arrayTempCollection = array();
            $arrayTempType = array();
            foreach ($reviewIDInCollection as $idCollectionNeedConverts) {
                $idCollectionNeedConvert = $idCollectionNeedConverts["review_id"];
                $arrayTempCollection = array_merge($arrayTempCollection, array($idCollectionNeedConvert));
            }
            foreach ($arrayReviewIDTypes as $idTypeNeedConverts) {
                $idTypeNeedConvert = $idTypeNeedConverts["review_id"];
                $arrayTempType = array_merge($arrayTempType, array($idTypeNeedConvert));
            }
            foreach ($arrayTempCollection as $eleTemCollections) {
                foreach ($arrayTempType as $eleTempType) {
                    if ($eleTempType === $eleTemCollections) {
                        $allReviewInType = db_fetch_array("SELECT * FROM custom_reviews_database WHERE shop = '$shop' AND id = $eleTempType AND featured = 1 AND lower(reviewer_rating) like '%$vendor%' AND (lower(reviewer_title) like '%$value%' OR lower(reviewer_name) like '%$value%' OR lower(reviewer_mess) like '%$value%' )");
                        $result = array_merge($result, $allReviewInType);
                    }
                }
            }
            switch ($sort) {
                case 'reviewer_name': {
                        usort($result, function ($a, $b) {
                            return strcmp($a['reviewer_name'], $b['reviewer_name']);
                        });
                    }
                    break;
                case 'reviewer_rating': {
                        usort($result, function ($a, $b) {
                            return strcmp($a['reviewer_rating'], $b['reviewer_rating']);
                        });
                        $result = array_reverse($result);
                    }
                    break;
                case 'reviewer_title': {
                        usort($result, function ($a, $b) {
                            return strcmp($a['reviewer_title'], $b['reviewer_title']);
                        });
                    }
                    break;
                case 'import_source': {
                        usort($result, function ($a, $b) {
                            return strcmp($a['import_source'], $b['import_source']);
                        });
                    }
                    break;
            }
            for ($start; $start < $end; $start++) {
                if (isset($result[$start])) {
                    $listProduct = array_merge($listProduct, array($result[$start]));
                }
            }
        } else if ($productType == "" && $collection == '') {
            if ($sort == 'id' || $sort == 'reviewer_rating') {
                $listProduct = db_fetch_array("SELECT * FROM custom_reviews_database WHERE shop = '$shop' AND featured = 1 AND lower(reviewer_rating) like '%$vendor%'   AND (lower(reviewer_title) like '%$value%' OR lower(reviewer_name) like '%$value%' OR lower(reviewer_mess) like '%$value%' ) ORDER BY $sort DESC LIMIT $limit OFFSET $offset ");
            } else {
                $listProduct = db_fetch_array("SELECT * FROM custom_reviews_database WHERE shop = '$shop' AND featured = 1 AND lower(reviewer_rating) like '%$vendor%'   AND (lower(reviewer_title) like '%$value%' OR lower(reviewer_name) like '%$value%' OR lower(reviewer_mess) like '%$value%' ) ORDER BY $sort ASC LIMIT $limit OFFSET $offset ");
            }
        }
    }
    if ($idFilterProduct !== '') { //filter products
        $arrayIdCollection = db_fetch_array("SELECT collection_id FROM custom_reviews_connect_collections_and_products WHERE shop = '$shop' AND product_id = $idFilterProduct");
        $result = array();
        $listProduct = array();
        $reviewIDInProducts = db_fetch_array("SELECT review_id FROM custom_reviews_connect_products_and_reviews WHERE shop = '$shop' AND product_id = $idFilterProduct");
        foreach ($reviewIDInProducts as $objIDInProducts) {
            $id_ReviewProduct = $objIDInProducts["review_id"];
            $arrayReviewIDTypes = db_fetch_array("SELECT * FROM custom_reviews_database WHERE shop = '$shop' AND id = $id_ReviewProduct AND lower(reviewer_rating) like '%$vendor%'   AND (lower(reviewer_title) like '%$value%' OR lower(reviewer_name) like '%$value%' OR lower(reviewer_mess) like '%$value%' ) ORDER BY $sort DESC");
            $result = array_merge($result, $arrayReviewIDTypes);
        }

        $arrayProductType = db_fetch_array("SELECT product_type FROM custom_reviewss_products WHERE shop = '$shop' AND products_id = $idFilterProduct");
        $productType = isset($arrayProductType[0]["product_type"]) ? $arrayProductType[0]["product_type"] : "";
        $arrayIDInType = db_fetch_array("SELECT id FROM custom_reviews_product_type WHERE shop = '$shop' AND product_type = '$productType'");
        foreach ($arrayIDInType as $objType) {
            $id_type = $objType["id"];
            $arrayReviewIDTypes = db_fetch_array("SELECT review_id FROM custom_reviews_connect_product_types_and_reviews WHERE shop = '$shop' AND id_product_type = $id_type");
            foreach ($arrayReviewIDTypes as $idReviewsInType) {
                $idReviewInType = $idReviewsInType["review_id"];
                $allReviewInType = db_fetch_array("SELECT * FROM custom_reviews_database WHERE shop = '$shop' AND id = $idReviewInType AND lower(reviewer_rating) like '%$vendor%'  AND (lower(reviewer_title) like '%$value%' OR lower(reviewer_name) like '%$value%' OR lower(reviewer_mess) like '%$value%' ) ORDER BY $sort DESC");
                $result = array_merge($result, $allReviewInType);
            }
        }
        foreach ($arrayIdCollection as $objCollection) {
            $id_collection = $objCollection["collection_id"];
            $reviewIDInCollection = db_fetch_array("SELECT review_id FROM custom_reviews_connect_collections_and_reviews WHERE shop = '$shop' AND collection_id = $id_collection");
            foreach ($reviewIDInCollection as $reviewInCollection) {
                $idReview = $reviewInCollection["review_id"];
                $allReviewInCollection = db_fetch_array("SELECT * FROM custom_reviews_database WHERE shop = '$shop' AND id = $idReview AND lower(reviewer_rating) like '%$vendor%'   AND (lower(reviewer_title) like '%$value%' OR lower(reviewer_name) like '%$value%' OR lower(reviewer_mess) like '%$value%' ) ORDER BY $sort DESC");
                $result = array_merge($result, $allReviewInCollection);
            }
        }
        for ($start; $start < $end; $start++) {
            if (isset($result[$start])) {
                $listProduct = array_merge($listProduct, array($result[$start]));
            }
        }
    }

    // ORDER BY column1, column2, ... DESC|DESC;
    echo json_encode($listProduct);
}
if (isset($_GET['searchRequest'])) {
    $shop = $_GET['shop'];
    $sort = isset($_GET['sort']) ? $_GET['sort'] : 'id';
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 20;
    $type = isset($_GET['selected']) ? $_GET['selected'] : 0;
    $productType = (isset($_GET['productType']) && $_GET['productType'] !== '') ? $_GET['productType'][0] : "";
    $value = isset($_GET['value']) ? fixCharQuery($_GET['value']) : '';
    $offset = $_GET['offset'] * $limit;
    $end = ($_GET['offset'] + 1) * $limit;
    $start = $offset - $limit;
    $listProduct = array();
    $vendor = "";
    if (isset($_GET['vendor']) && $_GET['vendor'] !== '') {
        $vendor = $_GET['vendor'][0];
    }
    $collection = isset($_GET['collectionID']) ? $_GET['collectionID'] : '';
    $productType = isset($_GET['productType']) ? $_GET['productType'] : '';
    if ($type == 1) {
        $result = array();
        $key = array();
        $listProduct = array();
        $ArrIdReviewsHasImages = db_fetch_array("SELECT review_id FROM custom_reviews_images WHERE shop = '$shop'");
        foreach ($ArrIdReviewsHasImages as $objArrId) {
            $idReviewHasImages = $objArrId['review_id'];
            $key = array_merge($key, [$idReviewHasImages]);
        }
        $key = array_unique($key); //id review has images
        if ($productType !== '' && $collection == "") {
            $productTypeConvert = $productType[0];
            $arrayReviewIDTypes = db_fetch_array("SELECT review_id FROM custom_reviews_connect_product_types_and_reviews WHERE shop = '$shop' AND id_product_type = $productTypeConvert");
            $result = array();
            foreach ($arrayReviewIDTypes as $idReviewsInType) {
                $idReviewInType = $idReviewsInType["review_id"];
                foreach ($key as $eleKey) {
                    if ($idReviewInType == $eleKey) {
                        $allReviewInType = db_fetch_array("SELECT * FROM custom_reviews_database WHERE shop = '$shop' AND id = $idReviewInType AND publish = 0 AND lower(reviewer_rating) like '%$vendor%' AND (lower(reviewer_title) like '%$value%' OR lower(reviewer_name) like '%$value%' OR lower(reviewer_mess) like '%$value%' )");
                        $result = array_merge($result, $allReviewInType);
                    }
                }
            }
            switch ($sort) {
                case 'reviewer_name': {
                        usort($result, function ($a, $b) {
                            return strcmp($a['reviewer_name'], $b['reviewer_name']);
                        });
                    }
                    break;
                case 'reviewer_rating': {
                        usort($result, function ($a, $b) {
                            return strcmp($a['reviewer_rating'], $b['reviewer_rating']);
                        });
                        $result = array_reverse($result);
                    }
                    break;
                case 'reviewer_title': {
                        usort($result, function ($a, $b) {
                            return strcmp($a['reviewer_title'], $b['reviewer_title']);
                        });
                    }
                    break;
                case 'import_source': {
                        usort($result, function ($a, $b) {
                            return strcmp($a['import_source'], $b['import_source']);
                        });
                    }
                    break;
            }
            for ($start; $start < $end; $start++) {
                if (isset($result[$start])) {
                    $listProduct = array_merge($listProduct, array($result[$start]));
                }
            }
        }
        if ($collection !== "" && $productType == "") {
            $idCollection = $_GET['collectionID'][0];
            $result = array();
            $reviewIDInCollection = db_fetch_array("SELECT review_id FROM custom_reviews_connect_collections_and_reviews WHERE shop = '$shop' AND collection_id = $idCollection");
            foreach ($reviewIDInCollection as $reviewInCollection) {
                $idReview = $reviewInCollection["review_id"];
                foreach ($key as $eleKey) {
                    if ($idReview == $eleKey) {
                        $allReviewInCollection = db_fetch_array("SELECT * FROM custom_reviews_database WHERE shop = '$shop' AND id = $idReview AND publish = 0 AND lower(reviewer_rating)  like '%$vendor%'  AND (lower(reviewer_title) like '%$value%' OR lower(reviewer_name) like '%$value%' OR lower(reviewer_mess) like '%$value%' )");
                        $result = array_merge($result, $allReviewInCollection);
                    }
                }
            }
            switch ($sort) {
                case 'reviewer_name': {
                        usort($result, function ($a, $b) {
                            return strcmp($a['reviewer_name'], $b['reviewer_name']);
                        });
                    }
                    break;
                case 'reviewer_rating': {
                        usort($result, function ($a, $b) {
                            return strcmp($a['reviewer_rating'], $b['reviewer_rating']);
                        });
                        $result = array_reverse($result);
                    }
                    break;
                case 'reviewer_title': {
                        usort($result, function ($a, $b) {
                            return strcmp($a['reviewer_title'], $b['reviewer_title']);
                        });
                    }
                    break;
                case 'import_source': {
                        usort($result, function ($a, $b) {
                            return strcmp($a['import_source'], $b['import_source']);
                        });
                    }
                    break;
            }
            for ($start; $start < $end; $start++) {
                if (isset($result[$start])) {
                    $listProduct = array_merge($listProduct, array($result[$start]));
                }
            }
        }
        if ($collection !== "" && $productType !== "") {
            $idCollection = $_GET['collectionID'][0];
            $productTypeConvert = $productType[0];

            $result = array();
            $reviewIDInCollection = db_fetch_array("SELECT review_id FROM custom_reviews_connect_collections_and_reviews WHERE shop = '$shop' AND collection_id = $idCollection");
            $arrayReviewIDTypes = db_fetch_array("SELECT review_id FROM custom_reviews_connect_product_types_and_reviews WHERE shop = '$shop' AND id_product_type = $productTypeConvert");
            $arrayTempCollection = array();
            $arrayTempType = array();
            foreach ($reviewIDInCollection as $idCollectionNeedConverts) {
                $idCollectionNeedConvert = $idCollectionNeedConverts["review_id"];
                $arrayTempCollection = array_merge($arrayTempCollection, array($idCollectionNeedConvert));
            }
            foreach ($arrayReviewIDTypes as $idTypeNeedConverts) {
                $idTypeNeedConvert = $idTypeNeedConverts["review_id"];
                $arrayTempType = array_merge($arrayTempType, array($idTypeNeedConvert));
            }
            foreach ($arrayTempCollection as $eleTemCollections) {
                foreach ($arrayTempType as $eleTempType) {
                    foreach ($key as $eleKey) {
                        if ($eleTempType == $eleTemCollections && $eleTemCollections  == $eleKey) {
                            $allReviewInType = db_fetch_array("SELECT * FROM custom_reviews_database WHERE shop = '$shop' AND publish = 0 AND id = $eleTempType AND lower(reviewer_rating) like '%$vendor%' AND (lower(reviewer_title) like '%$value%' OR lower(reviewer_name) like '%$value%' OR lower(reviewer_mess) like '%$value%' )");
                            $result = array_merge($result, $allReviewInType);
                        }
                    }
                }
            }
            //huydangsua
            switch ($sort) {
                case 'reviewer_name': {
                        usort($result, function ($a, $b) {
                            return strcmp($a['reviewer_name'], $b['reviewer_name']);
                        });
                    }
                    break;
                case 'reviewer_rating': {
                        usort($result, function ($a, $b) {
                            return strcmp($a['reviewer_rating'], $b['reviewer_rating']);
                        });
                        $result = array_reverse($result);
                    }
                    break;
                case 'reviewer_title': {
                        usort($result, function ($a, $b) {
                            return strcmp($a['reviewer_title'], $b['reviewer_title']);
                        });
                    }
                    break;
                case 'import_source': {
                        usort($result, function ($a, $b) {
                            return strcmp($a['import_source'], $b['import_source']);
                        });
                    }
                    break;
            }
            for ($start; $start < $end; $start++) {
                if (isset($result[$start])) {
                    $listProduct = array_merge($listProduct, array($result[$start]));
                }
            }
        } else if ($productType == "" && $collection == '') {
            foreach ($key as $idReviewHasImages) {
                $resultReviewHasImages = db_fetch_array("SELECT * FROM custom_reviews_database WHERE shop = '$shop' AND id ='$idReviewHasImages' AND publish = 0 AND lower(reviewer_rating) like '%$vendor%'   AND (lower(reviewer_title) like '%$value%' OR lower(reviewer_name) like '%$value%' OR lower(reviewer_mess) like '%$value%' )");
                $result = array_merge($result, $resultReviewHasImages);
            }
            switch ($sort) {
                case 'reviewer_name': {
                        usort($result, function ($a, $b) {
                            return strcmp($a['reviewer_name'], $b['reviewer_name']);
                        });
                    }
                    break;
                case 'reviewer_rating': {
                        usort($result, function ($a, $b) {
                            return strcmp($a['reviewer_rating'], $b['reviewer_rating']);
                        });
                        $result = array_reverse($result);
                    }
                    break;
                case 'reviewer_title': {
                        usort($result, function ($a, $b) {
                            return strcmp($a['reviewer_title'], $b['reviewer_title']);
                        });
                    }
                    break;
                case 'import_source': {
                        usort($result, function ($a, $b) {
                            return strcmp($a['import_source'], $b['import_source']);
                        });
                    }
                    break;
            }
            for ($start; $start < $end; $start++) {
                if (isset($result[$start])) {
                    $listProduct = array_merge($listProduct, array($result[$start]));
                }
            }
        }
        // //end
    }
    if ($type == 0) {
        if ($productType !== '' && $collection == "") {
            $productTypeConvert = $productType[0];
            $arrayReviewIDTypes = db_fetch_array("SELECT review_id FROM custom_reviews_connect_product_types_and_reviews WHERE shop = '$shop' AND id_product_type = $productTypeConvert");
            $result = array();
            foreach ($arrayReviewIDTypes as $idReviewsInType) {
                $idReviewInType = $idReviewsInType["review_id"];
                $allReviewInType = db_fetch_array("SELECT * FROM custom_reviews_database WHERE shop = '$shop' AND id = $idReviewInType AND publish = 0 AND lower(reviewer_rating) like '%$vendor%' AND (lower(reviewer_title) like '%$value%' OR lower(reviewer_name) like '%$value%' OR lower(reviewer_mess) like '%$value%' )");
                $result = array_merge($result, $allReviewInType);
            }
            switch ($sort) {
                case 'reviewer_name': {
                        usort($result, function ($a, $b) {
                            return strcmp($a['reviewer_name'], $b['reviewer_name']);
                        });
                    }
                    break;
                case 'reviewer_rating': {
                        usort($result, function ($a, $b) {
                            return strcmp($a['reviewer_rating'], $b['reviewer_rating']);
                        });
                        $result = array_reverse($result);
                    }
                    break;
                case 'reviewer_title': {
                        usort($result, function ($a, $b) {
                            return strcmp($a['reviewer_title'], $b['reviewer_title']);
                        });
                    }
                    break;
                case 'import_source': {
                        usort($result, function ($a, $b) {
                            return strcmp($a['import_source'], $b['import_source']);
                        });
                    }
                    break;
            }
            for ($start; $start < $end; $start++) {
                if (isset($result[$start])) {
                    $listProduct = array_merge($listProduct, array($result[$start]));
                }
            }
        }
        if ($collection !== "" && $productType == "") {
            $idCollection = $_GET['collectionID'][0];
            $result = array();
            $reviewIDInCollection = db_fetch_array("SELECT review_id FROM custom_reviews_connect_collections_and_reviews WHERE shop = '$shop' AND collection_id = $idCollection");
            foreach ($reviewIDInCollection as $reviewInCollection) {
                $idReview = $reviewInCollection["review_id"];
                $allReviewInCollection = db_fetch_array("SELECT * FROM custom_reviews_database WHERE shop = '$shop' AND id = $idReview AND publish = 0 AND lower(reviewer_rating) like '%$vendor%'  AND (lower(reviewer_title) like '%$value%' OR lower(reviewer_name) like '%$value%' OR lower(reviewer_mess) like '%$value%' )");
                $result = array_merge($result, $allReviewInCollection);
            }
            switch ($sort) {
                case 'reviewer_name': {
                        usort($result, function ($a, $b) {
                            return strcmp($a['reviewer_name'], $b['reviewer_name']);
                        });
                    }
                    break;
                case 'reviewer_rating': {
                        usort($result, function ($a, $b) {
                            return strcmp($a['reviewer_rating'], $b['reviewer_rating']);
                        });
                        $result = array_reverse($result);
                    }
                    break;
                case 'reviewer_title': {
                        usort($result, function ($a, $b) {
                            return strcmp($a['reviewer_title'], $b['reviewer_title']);
                        });
                    }
                    break;
                case 'import_source': {
                        usort($result, function ($a, $b) {
                            return strcmp($a['import_source'], $b['import_source']);
                        });
                    }
                    break;
            }
            for ($start; $start < $end; $start++) {
                if (isset($result[$start])) {
                    $listProduct = array_merge($listProduct, array($result[$start]));
                }
            }
        }
        if ($collection !== "" && $productType !== "") {
            $idCollection = $_GET['collectionID'][0];
            $productTypeConvert = $productType[0];

            $result = array();
            $reviewIDInCollection = db_fetch_array("SELECT review_id FROM custom_reviews_connect_collections_and_reviews WHERE shop = '$shop' AND collection_id = $idCollection");
            $arrayReviewIDTypes = db_fetch_array("SELECT review_id FROM custom_reviews_connect_product_types_and_reviews WHERE shop = '$shop' AND id_product_type = $productTypeConvert");
            $arrayTempCollection = array();
            $arrayTempType = array();
            foreach ($reviewIDInCollection as $idCollectionNeedConverts) {
                $idCollectionNeedConvert = $idCollectionNeedConverts["review_id"];
                $arrayTempCollection = array_merge($arrayTempCollection, array($idCollectionNeedConvert));
            }
            foreach ($arrayReviewIDTypes as $idTypeNeedConverts) {
                $idTypeNeedConvert = $idTypeNeedConverts["review_id"];
                $arrayTempType = array_merge($arrayTempType, array($idTypeNeedConvert));
            }
            foreach ($arrayTempCollection as $eleTemCollections) {
                foreach ($arrayTempType as $eleTempType) {
                    if ($eleTempType === $eleTemCollections) {
                        $allReviewInType = db_fetch_array("SELECT * FROM custom_reviews_database WHERE shop = '$shop' AND id = $eleTempType AND publish = 0 AND lower(reviewer_rating) like '%$vendor%' AND (lower(reviewer_title) like '%$value%' OR lower(reviewer_name) like '%$value%' OR lower(reviewer_mess) like '%$value%' )");
                        $result = array_merge($result, $allReviewInType);
                    }
                }
            }
            switch ($sort) {
                case 'reviewer_name': {
                        usort($result, function ($a, $b) {
                            return strcmp($a['reviewer_name'], $b['reviewer_name']);
                        });
                    }
                    break;
                case 'reviewer_rating': {
                        usort($result, function ($a, $b) {
                            return strcmp($a['reviewer_rating'], $b['reviewer_rating']);
                        });
                        $result = array_reverse($result);
                    }
                    break;
                case 'reviewer_title': {
                        usort($result, function ($a, $b) {
                            return strcmp($a['reviewer_title'], $b['reviewer_title']);
                        });
                    }
                    break;
                case 'import_source': {
                        usort($result, function ($a, $b) {
                            return strcmp($a['import_source'], $b['import_source']);
                        });
                    }
                    break;
            }
            for ($start; $start < $end; $start++) {
                if (isset($result[$start])) {
                    $listProduct = array_merge($listProduct, array($result[$start]));
                }
            }
        } else if ($productType == "" && $collection == '') {
            if ($sort == 'id' || $sort == 'reviewer_rating') {
                $listProduct = db_fetch_array("SELECT * FROM custom_reviews_database WHERE shop = '$shop' AND publish = 0 AND lower(reviewer_rating) like '%$vendor%'   AND (lower(reviewer_title) like '%$value%' OR lower(reviewer_name) like '%$value%' OR lower(reviewer_mess) like '%$value%' ) ORDER BY $sort DESC LIMIT $limit OFFSET $offset ");
            } else {
                $listProduct = db_fetch_array("SELECT * FROM custom_reviews_database WHERE shop = '$shop' AND publish = 0 AND lower(reviewer_rating) like '%$vendor%'   AND (lower(reviewer_title) like '%$value%' OR lower(reviewer_name) like '%$value%' OR lower(reviewer_mess) like '%$value%' ) ORDER BY $sort ASC LIMIT $limit OFFSET $offset ");
            }
        }
    }

    // ORDER BY column1, column2, ... DESC|DESC;
    echo json_encode($listProduct);
}
if (isset($_GET['getCountAllReviewSearch'])) {
    echo "hello";
    $shop = $_GET['shop'];
    $idFilterProduct = isset($_GET['idProduct']) ? $_GET['idProduct'] : '';
    $type = isset($_GET['selected']) ? $_GET['selected'] : 0;
    $productType = (isset($_GET['productType']) && $_GET['productType'] !== '') ? $_GET['productType'][0] : "";
    $value = isset($_GET['value']) ? fixCharQuery($_GET['value']) : '';

    $listProduct = array();
    $vendor = "";
    if (isset($_GET['vendor']) && $_GET['vendor'] !== '') {
        $vendor = $_GET['vendor'][0];
    }
    $collection = isset($_GET['collectionID']) ? $_GET['collectionID'] : '';
    $productType = isset($_GET['productType']) ? $_GET['productType'] : '';
    if ($type == 0) {
        if ($productType !== '' && $collection == "") {
            $productTypeConvert = $productType[0];
            $arrayReviewIDTypes = db_fetch_array("SELECT review_id FROM custom_reviews_connect_product_types_and_reviews WHERE shop = '$shop' AND id_product_type = $productTypeConvert");
            $listProduct = array();
            foreach ($arrayReviewIDTypes as $idReviewsInType) {
                $idReviewInType = $idReviewsInType["review_id"];
                $allReviewInType = db_fetch_array("SELECT * FROM custom_reviews_database WHERE shop = '$shop' AND id = $idReviewInType AND lower(reviewer_rating) like '%$vendor%' AND (lower(reviewer_title) like '%$value%' OR lower(reviewer_name) like '%$value%' OR lower(reviewer_mess) like '%$value%' )");
                $listProduct = array_merge($listProduct, $allReviewInType);
            }
        }
        if ($collection !== "" && $productType == "") {
            $idCollection = $_GET['collectionID'][0];
            $listProduct = array();
            $reviewIDInCollection = db_fetch_array("SELECT review_id FROM custom_reviews_connect_collections_and_reviews WHERE shop = '$shop' AND collection_id = $idCollection");
            foreach ($reviewIDInCollection as $reviewInCollection) {
                $idReview = $reviewInCollection["review_id"];
                $allReviewInCollection = db_fetch_array("SELECT * FROM custom_reviews_database WHERE shop = '$shop' AND id = $idReview AND lower(reviewer_rating) like '%$vendor%'  AND (lower(reviewer_title) like '%$value%' OR lower(reviewer_name) like '%$value%' OR lower(reviewer_mess) like '%$value%' )");
                $listProduct = array_merge($listProduct, $allReviewInCollection);
            }
        }
        if ($collection !== "" && $productType !== "") {
            $idCollection = $_GET['collectionID'][0];
            $productTypeConvert = $productType[0];

            $listProduct = array();
            $reviewIDInCollection = db_fetch_array("SELECT review_id FROM custom_reviews_connect_collections_and_reviews WHERE shop = '$shop' AND collection_id = $idCollection");
            $arrayReviewIDTypes = db_fetch_array("SELECT review_id FROM custom_reviews_connect_product_types_and_reviews WHERE shop = '$shop' AND id_product_type = $productTypeConvert");
            $arrayTempCollection = array();
            $arrayTempType = array();
            foreach ($reviewIDInCollection as $idCollectionNeedConverts) {
                $idCollectionNeedConvert = $idCollectionNeedConverts["review_id"];
                $arrayTempCollection = array_merge($arrayTempCollection, array($idCollectionNeedConvert));
            }
            foreach ($arrayReviewIDTypes as $idTypeNeedConverts) {
                $idTypeNeedConvert = $idTypeNeedConverts["review_id"];
                $arrayTempType = array_merge($arrayTempType, array($idTypeNeedConvert));
            }
            foreach ($arrayTempCollection as $eleTemCollections) {
                foreach ($arrayTempType as $eleTempType) {
                    if ($eleTempType === $eleTemCollections) {
                        $allReviewInType = db_fetch_array("SELECT * FROM custom_reviews_database WHERE shop = '$shop' AND id = $eleTempType AND lower(reviewer_rating) like '%$vendor%' AND (lower(reviewer_title) like '%$value%' OR lower(reviewer_name) like '%$value%' OR lower(reviewer_mess) like '%$value%' )");
                        $listProduct = array_merge($listProduct, $allReviewInType);
                    }
                }
            }
        } else if ($productType == "" && $collection == '') {
            $listProduct = db_fetch_array("SELECT * FROM custom_reviews_database WHERE shop = '$shop' AND lower(reviewer_rating) like '%$vendor%'   AND (lower(reviewer_title) like '%$value%' OR lower(reviewer_name) like '%$value%' OR lower(reviewer_mess) like '%$value%' )");
        }
    }
    if ($type == 1) {
        $result = array();
        $key = array();
        $listProduct = array();
        $ArrIdReviewsHasImages = db_fetch_array("SELECT review_id FROM custom_reviews_images WHERE shop = '$shop'");
        foreach ($ArrIdReviewsHasImages as $objArrId) {
            $idReviewHasImages = $objArrId['review_id'];
            $key = array_merge($key, [$idReviewHasImages]);
        }
        $key = array_unique($key); //id review has images
        if ($productType !== '' && $collection == "") {
            $productTypeConvert = $productType[0];
            $arrayReviewIDTypes = db_fetch_array("SELECT review_id FROM custom_reviews_connect_product_types_and_reviews WHERE shop = '$shop' AND id_product_type = $productTypeConvert");
            $listProduct = array();
            foreach ($arrayReviewIDTypes as $idReviewsInType) {
                $idReviewInType = $idReviewsInType["review_id"];
                foreach ($key as $eleKey) {
                    if ($idReviewInType == $eleKey) {
                        $allReviewInType = db_fetch_array("SELECT * FROM custom_reviews_database WHERE shop = '$shop' AND id = $idReviewInType AND lower(reviewer_rating) like '%$vendor%'AND  AND (lower(reviewer_title) like '%$value%' OR lower(reviewer_name) like '%$value%' OR lower(reviewer_mess) like '%$value%' )");
                        $listProduct = array_merge($listProduct, $allReviewInType);
                    }
                }
            }
        }
        if ($collection !== "" && $productType == "") {
            $idCollection = $_GET['collectionID'][0];
            $listProduct = array();
            $reviewIDInCollection = db_fetch_array("SELECT review_id FROM custom_reviews_connect_collections_and_reviews WHERE shop = '$shop' AND collection_id = $idCollection");
            foreach ($reviewIDInCollection as $reviewInCollection) {
                $idReview = $reviewInCollection["review_id"];
                foreach ($key as $eleKey) {
                    if ($idReview == $eleKey) {
                        $allReviewInCollection = db_fetch_array("SELECT * FROM custom_reviews_database WHERE shop = '$shop' AND id = $idReview AND lower(reviewer_rating) like '%$vendor%'  AND (lower(reviewer_title) like '%$value%' OR lower(reviewer_name) like '%$value%' OR lower(reviewer_mess) like '%$value%' )");
                        $listProduct = array_merge($listProduct, $allReviewInCollection);
                    }
                }
            }
        }
        if ($collection !== "" && $productType !== "") {
            $idCollection = $_GET['collectionID'][0];
            $productTypeConvert = $productType[0];

            $listProduct = array();
            $reviewIDInCollection = db_fetch_array("SELECT review_id FROM custom_reviews_connect_collections_and_reviews WHERE shop = '$shop' AND collection_id = $idCollection");
            $arrayReviewIDTypes = db_fetch_array("SELECT review_id FROM custom_reviews_connect_product_types_and_reviews WHERE shop = '$shop' AND id_product_type = $productTypeConvert");
            $arrayTempCollection = array();
            $arrayTempType = array();
            foreach ($reviewIDInCollection as $idCollectionNeedConverts) {
                $idCollectionNeedConvert = $idCollectionNeedConverts["review_id"];
                $arrayTempCollection = array_merge($arrayTempCollection, array($idCollectionNeedConvert));
            }
            foreach ($arrayReviewIDTypes as $idTypeNeedConverts) {
                $idTypeNeedConvert = $idTypeNeedConverts["review_id"];
                $arrayTempType = array_merge($arrayTempType, array($idTypeNeedConvert));
            }
            foreach ($arrayTempCollection as $eleTemCollections) {
                foreach ($arrayTempType as $eleTempType) {
                    foreach ($key as $eleKey) {
                        if ($eleTempType == $eleTemCollections && $eleTemCollections  == $eleKey) {
                            $allReviewInType = db_fetch_array("SELECT * FROM custom_reviews_database WHERE shop = '$shop' AND id = $eleTempType AND lower(reviewer_rating) like '%$vendor%'AND (lower(reviewer_title) like '%$value%' OR lower(reviewer_name) like '%$value%' OR lower(reviewer_mess) like '%$value%' )");
                            $listProduct = array_merge($listProduct, $allReviewInType);
                        }
                    }
                }
            }
        } else if ($productType == "" && $collection == '') {
            foreach ($key as $idReviewHasImages) {
                $resultReviewHasImages = db_fetch_array("SELECT * FROM custom_reviews_database WHERE shop = '$shop' AND id ='$idReviewHasImages' AND lower(reviewer_rating) like '%$vendor%'   AND (lower(reviewer_title) like '%$value%' OR lower(reviewer_name) like '%$value%' OR lower(reviewer_mess) like '%$value%' )");
                $listProduct = array_merge($listProduct, $resultReviewHasImages);
            }
        }
        // //end
    }
    if ($type == 2) {
        if ($productType !== '' && $collection == "") {
            $productTypeConvert = $productType[0];
            $arrayReviewIDTypes = db_fetch_array("SELECT review_id FROM custom_reviews_connect_product_types_and_reviews WHERE shop = '$shop' AND id_product_type = $productTypeConvert");
            $listProduct = array();
            foreach ($arrayReviewIDTypes as $idReviewsInType) {
                $idReviewInType = $idReviewsInType["review_id"];
                $allReviewInType = db_fetch_array("SELECT * FROM custom_reviews_database WHERE shop = '$shop' AND id = $idReviewInType AND publish = 1 AND lower(reviewer_rating) like '%$vendor%' AND (lower(reviewer_title) like '%$value%' OR lower(reviewer_name) like '%$value%' OR lower(reviewer_mess) like '%$value%' )");
                $listProduct = array_merge($listProduct, $allReviewInType);
            }
        }
        if ($collection !== "" && $productType == "") {
            $idCollection = $_GET['collectionID'][0];
            $listProduct = array();
            $reviewIDInCollection = db_fetch_array("SELECT review_id FROM custom_reviews_connect_collections_and_reviews WHERE shop = '$shop' AND collection_id = $idCollection");
            foreach ($reviewIDInCollection as $reviewInCollection) {
                $idReview = $reviewInCollection["review_id"];
                $allReviewInCollection = db_fetch_array("SELECT * FROM custom_reviews_database WHERE shop = '$shop' AND id = $idReview AND publish = 1 AND lower(reviewer_rating) like '%$vendor%'  AND (lower(reviewer_title) like '%$value%' OR lower(reviewer_name) like '%$value%' OR lower(reviewer_mess) like '%$value%' )");
                $listProduct = array_merge($listProduct, $allReviewInCollection);
            }
        }
        if ($collection !== "" && $productType !== "") {
            $idCollection = $_GET['collectionID'][0];
            $productTypeConvert = $productType[0];

            $listProduct = array();
            $reviewIDInCollection = db_fetch_array("SELECT review_id FROM custom_reviews_connect_collections_and_reviews WHERE shop = '$shop' AND collection_id = $idCollection");
            $arrayReviewIDTypes = db_fetch_array("SELECT review_id FROM custom_reviews_connect_product_types_and_reviews WHERE shop = '$shop' AND id_product_type = $productTypeConvert");
            $arrayTempCollection = array();
            $arrayTempType = array();
            foreach ($reviewIDInCollection as $idCollectionNeedConverts) {
                $idCollectionNeedConvert = $idCollectionNeedConverts["review_id"];
                $arrayTempCollection = array_merge($arrayTempCollection, array($idCollectionNeedConvert));
            }
            foreach ($arrayReviewIDTypes as $idTypeNeedConverts) {
                $idTypeNeedConvert = $idTypeNeedConverts["review_id"];
                $arrayTempType = array_merge($arrayTempType, array($idTypeNeedConvert));
            }
            foreach ($arrayTempCollection as $eleTemCollections) {
                foreach ($arrayTempType as $eleTempType) {
                    if ($eleTempType === $eleTemCollections) {
                        $allReviewInType = db_fetch_array("SELECT * FROM custom_reviews_database WHERE shop = '$shop' AND id = $eleTempType AND publish = 1 AND lower(reviewer_rating) like '%$vendor%' AND (lower(reviewer_title) like '%$value%' OR lower(reviewer_name) like '%$value%' OR lower(reviewer_mess) like '%$value%' )");
                        $listProduct = array_merge($listProduct, $allReviewInType);
                    }
                }
            }
        } else if ($productType == "" && $collection == '') {
            $listProduct = db_fetch_array("SELECT * FROM custom_reviews_database WHERE shop = '$shop' AND publish = 1 AND lower(reviewer_rating) like '%$vendor%'   AND (lower(reviewer_title) like '%$value%' OR lower(reviewer_name) like '%$value%' OR lower(reviewer_mess) like '%$value%' )");
        }
    }
    if ($type == 3) {
        if ($productType !== '' && $collection == "") {
            $productTypeConvert = $productType[0];
            $arrayReviewIDTypes = db_fetch_array("SELECT review_id FROM custom_reviews_connect_product_types_and_reviews WHERE shop = '$shop' AND id_product_type = $productTypeConvert");
            $listProduct = array();
            foreach ($arrayReviewIDTypes as $idReviewsInType) {
                $idReviewInType = $idReviewsInType["review_id"];
                $allReviewInType = db_fetch_array("SELECT * FROM custom_reviews_database WHERE shop = '$shop' AND id = $idReviewInType AND featured = 1 AND lower(reviewer_rating) like '%$vendor%' AND (lower(reviewer_title) like '%$value%' OR lower(reviewer_name) like '%$value%' OR lower(reviewer_mess) like '%$value%' )");
                $listProduct = array_merge($listProduct, $allReviewInType);
            }
        }
        if ($collection !== "" && $productType == "") {
            $idCollection = $_GET['collectionID'][0];
            $listProduct = array();
            $reviewIDInCollection = db_fetch_array("SELECT review_id FROM custom_reviews_connect_collections_and_reviews WHERE shop = '$shop' AND collection_id = $idCollection");
            foreach ($reviewIDInCollection as $reviewInCollection) {
                $idReview = $reviewInCollection["review_id"];
                $allReviewInCollection = db_fetch_array("SELECT * FROM custom_reviews_database WHERE shop = '$shop' AND id = $idReview AND featured = 1 AND lower(reviewer_rating) like '%$vendor%' AND (lower(reviewer_title) like '%$value%' OR lower(reviewer_name) like '%$value%' OR lower(reviewer_mess) like '%$value%' )");
                $listProduct = array_merge($listProduct, $allReviewInCollection);
            }
        }
        if ($collection !== "" && $productType !== "") {
            $idCollection = $_GET['collectionID'][0];
            $productTypeConvert = $productType[0];

            $listProduct = array();
            $reviewIDInCollection = db_fetch_array("SELECT review_id FROM custom_reviews_connect_collections_and_reviews WHERE shop = '$shop' AND collection_id = $idCollection");
            $arrayReviewIDTypes = db_fetch_array("SELECT review_id FROM custom_reviews_connect_product_types_and_reviews WHERE shop = '$shop' AND id_product_type = $productTypeConvert");
            $arrayTempCollection = array();
            $arrayTempType = array();
            foreach ($reviewIDInCollection as $idCollectionNeedConverts) {
                $idCollectionNeedConvert = $idCollectionNeedConverts["review_id"];
                $arrayTempCollection = array_merge($arrayTempCollection, array($idCollectionNeedConvert));
            }
            foreach ($arrayReviewIDTypes as $idTypeNeedConverts) {
                $idTypeNeedConvert = $idTypeNeedConverts["review_id"];
                $arrayTempType = array_merge($arrayTempType, array($idTypeNeedConvert));
            }
            foreach ($arrayTempCollection as $eleTemCollections) {
                foreach ($arrayTempType as $eleTempType) {
                    if ($eleTempType === $eleTemCollections) {
                        $allReviewInType = db_fetch_array("SELECT * FROM custom_reviews_database WHERE shop = '$shop' AND id = $eleTempType AND featured = 1 AND lower(reviewer_rating) like '%$vendor%' AND (lower(reviewer_title) like '%$value%' OR lower(reviewer_name) like '%$value%' OR lower(reviewer_mess) like '%$value%' )");
                        $listProduct = array_merge($listProduct, $allReviewInType);
                    }
                }
            }
        } else if ($productType == "" && $collection == '') {
            $listProduct = db_fetch_array("SELECT * FROM custom_reviews_database WHERE shop = '$shop' AND featured = 1 AND lower(reviewer_rating) like '%$vendor%'   AND (lower(reviewer_title) like '%$value%' OR lower(reviewer_name) like '%$value%' OR lower(reviewer_mess) like '%$value%' )");
        }
    }
    if ($idFilterProduct !== '') { //filter products
        $arrayIdCollection = db_fetch_array("SELECT collection_id FROM custom_reviews_connect_collections_and_products WHERE shop = '$shop' AND product_id = $idFilterProduct");
        $listProduct = array();
        $reviewIDInProducts = db_fetch_array("SELECT review_id FROM custom_reviews_connect_products_and_reviews WHERE shop = '$shop' AND product_id = $idFilterProduct");
        foreach ($reviewIDInProducts as $objIDInProducts) {
            $id_ReviewProduct = $objIDInProducts["review_id"];
            $arrayReviewIDTypes = db_fetch_array("SELECT * FROM custom_reviews_database WHERE shop = '$shop' AND id = $id_ReviewProduct AND lower(reviewer_rating) like '%$vendor%'   AND (lower(reviewer_title) like '%$value%' OR lower(reviewer_name) like '%$value%' OR lower(reviewer_mess) like '%$value%' )");
            $listProduct = array_merge($listProduct, $arrayReviewIDTypes);
        }

        $arrayProductType = db_fetch_array("SELECT product_type FROM custom_reviewss_products WHERE shop = '$shop' AND products_id = $idFilterProduct");
        $productType = isset($arrayProductType[0]["product_type"]) ? $arrayProductType[0]["product_type"] : "";
        $arrayIDInType = db_fetch_array("SELECT id FROM custom_reviews_product_type WHERE shop = '$shop' AND product_type = '$productType'");
        foreach ($arrayIDInType as $objType) {
            $id_type = $objType["id"];
            $arrayReviewIDTypes = db_fetch_array("SELECT review_id FROM custom_reviews_connect_product_types_and_reviews WHERE shop = '$shop' AND id_product_type = $id_type");
            foreach ($arrayReviewIDTypes as $idReviewsInType) {
                $idReviewInType = $idReviewsInType["review_id"];
                $allReviewInType = db_fetch_array("SELECT * FROM custom_reviews_database WHERE shop = '$shop' AND id = $idReviewInType AND lower(reviewer_rating) like '%$vendor%'  AND (lower(reviewer_title) like '%$value%' OR lower(reviewer_name) like '%$value%' OR lower(reviewer_mess) like '%$value%' )");
                $listProduct = array_merge($listProduct, $allReviewInType);
            }
        }
        foreach ($arrayIdCollection as $objCollection) {
            $id_collection = $objCollection["collection_id"];
            $reviewIDInCollection = db_fetch_array("SELECT review_id FROM custom_reviews_connect_collections_and_reviews WHERE shop = '$shop' AND collection_id = $id_collection");
            foreach ($reviewIDInCollection as $reviewInCollection) {
                $idReview = $reviewInCollection["review_id"];
                $allReviewInCollection = db_fetch_array("SELECT * FROM custom_reviews_database WHERE shop = '$shop' AND id = $idReview AND lower(reviewer_rating) like '%$vendor%'   AND (lower(reviewer_title) like '%$value%' OR lower(reviewer_name) like '%$value%' OR lower(reviewer_mess) like '%$value%' )");
                $listProduct = array_merge($listProduct, $allReviewInCollection);
            }
        }
    }
    echo count($listProduct);
}
if (isset($_GET['getCountAllRequest'])) {
    $shop = $_GET['shop'];
    $sort = isset($_GET['sort']) ? $_GET['sort'] : 'id';
    // $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 20;
    $type = isset($_GET['selected']) ? $_GET['selected'] : 0;
    $productType = (isset($_GET['productType']) && $_GET['productType'] !== '') ? $_GET['productType'][0] : "";
    $value = isset($_GET['value']) ? fixCharQuery($_GET['value']) : '';
    // $offset = $_GET['offset'] * $limit;
    // $end = ($_GET['offset'] + 1) * $limit;
    // $start = $offset - $limit;
    $listProduct = array();
    $vendor = "";
    if (isset($_GET['vendor']) && $_GET['vendor'] !== '') {
        $vendor = $_GET['vendor'][0];
    }
    $collection = isset($_GET['collectionID']) ? $_GET['collectionID'] : '';
    $productType = isset($_GET['productType']) ? $_GET['productType'] : '';
    if ($type == 1) {
        $key = array();
        $listProduct = array();
        $ArrIdReviewsHasImages = db_fetch_array("SELECT review_id FROM custom_reviews_images WHERE shop = '$shop'");
        foreach ($ArrIdReviewsHasImages as $objArrId) {
            $idReviewHasImages = $objArrId['review_id'];
            $key = array_merge($key, [$idReviewHasImages]);
        }
        $key = array_unique($key); //id review has images
        if ($productType !== '' && $collection == "") {
            $productTypeConvert = $productType[0];
            $arrayReviewIDTypes = db_fetch_array("SELECT review_id FROM custom_reviews_connect_product_types_and_reviews WHERE shop = '$shop' AND id_product_type = $productTypeConvert");
            foreach ($arrayReviewIDTypes as $idReviewsInType) {
                $idReviewInType = $idReviewsInType["review_id"];
                foreach ($key as $eleKey) {
                    if ($idReviewInType == $eleKey) {
                        $allReviewInType = db_fetch_array("SELECT * FROM custom_reviews_database WHERE shop = '$shop' AND id = $idReviewInType AND publish = 0 AND lower(reviewer_rating) like '%$vendor%' AND (lower(reviewer_title) like '%$value%' OR lower(reviewer_name) like '%$value%' OR lower(reviewer_mess) like '%$value%' )");
                        $listProduct = array_merge($listProduct, $allReviewInType);
                    }
                }
            }
        }
        if ($collection !== "" && $productType == "") {
            $idCollection = $_GET['collectionID'][0];
            $listProduct = array();
            $reviewIDInCollection = db_fetch_array("SELECT review_id FROM custom_reviews_connect_collections_and_reviews WHERE shop = '$shop' AND collection_id = $idCollection");
            foreach ($reviewIDInCollection as $reviewInCollection) {
                $idReview = $reviewInCollection["review_id"];
                foreach ($key as $eleKey) {
                    if ($idReview == $eleKey) {
                        $allReviewInCollection = db_fetch_array("SELECT * FROM custom_reviews_database WHERE shop = '$shop' AND id = $idReview AND publish = 0 AND lower(reviewer_rating)  like '%$vendor%'  AND (lower(reviewer_title) like '%$value%' OR lower(reviewer_name) like '%$value%' OR lower(reviewer_mess) like '%$value%' )");
                        $listProduct = array_merge($listProduct, $allReviewInCollection);
                    }
                }
            }
        }
        if ($collection !== "" && $productType !== "") {
            $idCollection = $_GET['collectionID'][0];
            $productTypeConvert = $productType[0];

            $listProduct = array();
            $reviewIDInCollection = db_fetch_array("SELECT review_id FROM custom_reviews_connect_collections_and_reviews WHERE shop = '$shop' AND collection_id = $idCollection");
            $arrayReviewIDTypes = db_fetch_array("SELECT review_id FROM custom_reviews_connect_product_types_and_reviews WHERE shop = '$shop' AND id_product_type = $productTypeConvert");
            $arrayTempCollection = array();
            $arrayTempType = array();
            foreach ($reviewIDInCollection as $idCollectionNeedConverts) {
                $idCollectionNeedConvert = $idCollectionNeedConverts["review_id"];
                $arrayTempCollection = array_merge($arrayTempCollection, array($idCollectionNeedConvert));
            }
            foreach ($arrayReviewIDTypes as $idTypeNeedConverts) {
                $idTypeNeedConvert = $idTypeNeedConverts["review_id"];
                $arrayTempType = array_merge($arrayTempType, array($idTypeNeedConvert));
            }
            foreach ($arrayTempCollection as $eleTemCollections) {
                foreach ($arrayTempType as $eleTempType) {
                    foreach ($key as $eleKey) {
                        if ($eleTempType == $eleTemCollections && $eleTemCollections  == $eleKey) {
                            $allReviewInType = db_fetch_array("SELECT * FROM custom_reviews_database WHERE shop = '$shop' AND publish = 0 AND id = $eleTempType AND lower(reviewer_rating) like '%$vendor%' AND (lower(reviewer_title) like '%$value%' OR lower(reviewer_name) like '%$value%' OR lower(reviewer_mess) like '%$value%' )");
                            $listProduct = array_merge($listProduct, $allReviewInType);
                        }
                    }
                }
            }
        } else if ($productType == "" && $collection == '') {
            foreach ($key as $idReviewHasImages) {
                $resultReviewHasImages = db_fetch_array("SELECT * FROM custom_reviews_database WHERE shop = '$shop' AND id ='$idReviewHasImages' AND publish = 0 AND lower(reviewer_rating) like '%$vendor%'   AND (lower(reviewer_title) like '%$value%' OR lower(reviewer_name) like '%$value%' OR lower(reviewer_mess) like '%$value%' )");
                $listProduct = array_merge($listProduct, $resultReviewHasImages);
            }
        }
        // //end
    }
    if ($type == 0) {
        if ($productType !== '' && $collection == "") {
            $productTypeConvert = $productType[0];
            $arrayReviewIDTypes = db_fetch_array("SELECT review_id FROM custom_reviews_connect_product_types_and_reviews WHERE shop = '$shop' AND id_product_type = $productTypeConvert");
            $listProduct = array();
            foreach ($arrayReviewIDTypes as $idReviewsInType) {
                $idReviewInType = $idReviewsInType["review_id"];
                $allReviewInType = db_fetch_array("SELECT * FROM custom_reviews_database WHERE shop = '$shop' AND id = $idReviewInType AND publish = 0 AND lower(reviewer_rating) like '%$vendor%' AND (lower(reviewer_title) like '%$value%' OR lower(reviewer_name) like '%$value%' OR lower(reviewer_mess) like '%$value%' )");
                $listProduct = array_merge($listProduct, $allReviewInType);
            }
        }
        if ($collection !== "" && $productType == "") {
            $idCollection = $_GET['collectionID'][0];
            $listProduct = array();
            $reviewIDInCollection = db_fetch_array("SELECT review_id FROM custom_reviews_connect_collections_and_reviews WHERE shop = '$shop' AND collection_id = $idCollection");
            foreach ($reviewIDInCollection as $reviewInCollection) {
                $idReview = $reviewInCollection["review_id"];
                $allReviewInCollection = db_fetch_array("SELECT * FROM custom_reviews_database WHERE shop = '$shop' AND id = $idReview AND publish = 0 AND lower(reviewer_rating) like '%$vendor%'  AND (lower(reviewer_title) like '%$value%' OR lower(reviewer_name) like '%$value%' OR lower(reviewer_mess) like '%$value%' )");
                $listProduct = array_merge($listProduct, $allReviewInCollection);
            }
        }
        if ($collection !== "" && $productType !== "") {
            $idCollection = $_GET['collectionID'][0];
            $productTypeConvert = $productType[0];

            $listProduct = array();
            $reviewIDInCollection = db_fetch_array("SELECT review_id FROM custom_reviews_connect_collections_and_reviews WHERE shop = '$shop' AND collection_id = $idCollection");
            $arrayReviewIDTypes = db_fetch_array("SELECT review_id FROM custom_reviews_connect_product_types_and_reviews WHERE shop = '$shop' AND id_product_type = $productTypeConvert");
            $arrayTempCollection = array();
            $arrayTempType = array();
            foreach ($reviewIDInCollection as $idCollectionNeedConverts) {
                $idCollectionNeedConvert = $idCollectionNeedConverts["review_id"];
                $arrayTempCollection = array_merge($arrayTempCollection, array($idCollectionNeedConvert));
            }
            foreach ($arrayReviewIDTypes as $idTypeNeedConverts) {
                $idTypeNeedConvert = $idTypeNeedConverts["review_id"];
                $arrayTempType = array_merge($arrayTempType, array($idTypeNeedConvert));
            }
            foreach ($arrayTempCollection as $eleTemCollections) {
                foreach ($arrayTempType as $eleTempType) {
                    if ($eleTempType === $eleTemCollections) {
                        $allReviewInType = db_fetch_array("SELECT * FROM custom_reviews_database WHERE shop = '$shop' AND id = $eleTempType AND publish = 0 AND lower(reviewer_rating) like '%$vendor%' AND (lower(reviewer_title) like '%$value%' OR lower(reviewer_name) like '%$value%' OR lower(reviewer_mess) like '%$value%' )");
                        $listProduct = array_merge($listProduct, $allReviewInType);
                    }
                }
            }
        } else if ($productType == "" && $collection == '') {
            if ($sort == 'id' || $sort == 'reviewer_rating') {
                $listProduct = db_fetch_array("SELECT * FROM custom_reviews_database WHERE shop = '$shop' AND publish = 0 AND lower(reviewer_rating) like '%$vendor%'   AND (lower(reviewer_title) like '%$value%' OR lower(reviewer_name) like '%$value%' OR lower(reviewer_mess) like '%$value%' )");
            } else {
                $listProduct = db_fetch_array("SELECT * FROM custom_reviews_database WHERE shop = '$shop' AND publish = 0 AND lower(reviewer_rating) like '%$vendor%'   AND (lower(reviewer_title) like '%$value%' OR lower(reviewer_name) like '%$value%' OR lower(reviewer_mess) like '%$value%' )");
            }
        }
    }

    // ORDER BY column1, column2, ... DESC|DESC;
    echo count($listProduct);
}

if (isset($_GET['getProductsDetail'])) {
    $shop = $_GET['shop'];
    $idProduct = $_GET['id'];
    $productsDetail = db_fetch_array("SELECT * FROM custom_reviewss_products WHERE shop = '$shop' AND products_id = $idProduct");
    echo json_encode($productsDetail[0]);
}
if (isset($_GET['getAllReviewByProductInPage'])) {
    $shop = $_GET['shop'];
    $offset = ($_GET['offset'] + 1) * 25;
    $start = $offset - 25;
    $value = $_GET['value'];
    $idProduct = $_GET['id'];
    $result = array();
    $reviewIDInProducts = db_fetch_array("SELECT review_id FROM custom_reviews_connect_products_and_reviews WHERE shop = '$shop' AND product_id = $idProduct");
    foreach ($reviewIDInProducts as $objIDInProducts) {
        $id_ReviewProduct = $objIDInProducts["review_id"];
        $arrayReviewIDTypes = db_fetch_array("SELECT * FROM custom_reviews_database WHERE shop = '$shop' AND id = $id_ReviewProduct AND (lower(reviewer_title) like '%$value%' OR lower(reviewer_name) like '%$value%' OR lower(reviewer_mess) like '%$value%')");
        $result = array_merge($result, $arrayReviewIDTypes);
    }

    $arrayProductType = db_fetch_array("SELECT product_type FROM custom_reviewss_products WHERE shop = '$shop' AND products_id = $idProduct");
    $productType = isset($arrayProductType[0]["product_type"]) ? $arrayProductType[0]["product_type"] : "";
    $arrayIDInType = db_fetch_array("SELECT id FROM custom_reviews_product_type WHERE shop = '$shop' AND product_type = '$productType'");
    foreach ($arrayIDInType as $objType) {
        $id_type = $objType["id"];
        $arrayReviewIDTypes = db_fetch_array("SELECT review_id FROM custom_reviews_connect_product_types_and_reviews WHERE shop = '$shop' AND id_product_type = $id_type");
        foreach ($arrayReviewIDTypes as $idReviewsInType) {
            $idReviewInType = $idReviewsInType["review_id"];
            $allReviewInType = db_fetch_array("SELECT * FROM custom_reviews_database WHERE shop = '$shop' AND id = $idReviewInType AND (lower(reviewer_title) like '%$value%' OR lower(reviewer_name) like '%$value%' OR lower(reviewer_mess) like '%$value%')");
            $result = array_merge($result, $allReviewInType);
        }
    }
    $arrayIdCollection = db_fetch_array("SELECT collection_id FROM custom_reviews_connect_collections_and_products WHERE shop = '$shop' AND product_id = $idProduct");
    foreach ($arrayIdCollection as $objCollection) {
        $id_collection = $objCollection["collection_id"];
        $reviewIDInCollection = db_fetch_array("SELECT review_id FROM custom_reviews_connect_collections_and_reviews WHERE shop = '$shop' AND collection_id = $id_collection");
        foreach ($reviewIDInCollection as $reviewInCollection) {
            $idReview = $reviewInCollection["review_id"];
            $allReviewInCollection = db_fetch_array("SELECT * FROM custom_reviews_database WHERE shop = '$shop' AND id = $idReview AND (lower(reviewer_title) like '%$value%' OR lower(reviewer_name) like '%$value%' OR lower(reviewer_mess) like '%$value%')");
            $result = array_merge($result, $allReviewInCollection);
        }
    }
    $response = array();
    for ($start; $start < $offset; $start++) {
        if (isset($result[$start])) {
            $response = array_merge($response, array($result[$start]));
        }
    }
    echo json_encode($response);
}

if (isset($_GET['getAllReviewByProduct'])) {
    $shop = $_GET['shop'];
    $idProduct = $_GET['id'];
    $arrayIdCollection = db_fetch_array("SELECT collection_id FROM custom_reviews_connect_collections_and_products WHERE shop = '$shop' AND product_id = $idProduct");
    $result = array();
    $reviewIDInProducts = db_fetch_array("SELECT review_id FROM custom_reviews_connect_products_and_reviews WHERE shop = '$shop' AND product_id = $idProduct");
    foreach ($reviewIDInProducts as $objIDInProducts) {
        $id_ReviewProduct = $objIDInProducts["review_id"];
        $arrayReviewIDTypes = db_fetch_array("SELECT * FROM custom_reviews_database WHERE shop = '$shop' AND id = $id_ReviewProduct");
        $result = array_merge($result, $arrayReviewIDTypes);
    }

    $arrayProductType = db_fetch_array("SELECT product_type FROM custom_reviewss_products WHERE shop = '$shop' AND products_id = $idProduct");
    $productType = isset($arrayProductType[0]["product_type"]) ? $arrayProductType[0]["product_type"] : "";
    $arrayIDInType = db_fetch_array("SELECT id FROM custom_reviews_product_type WHERE shop = '$shop' AND product_type = '$productType'");
    foreach ($arrayIDInType as $objType) {
        $id_type = $objType["id"];
        $arrayReviewIDTypes = db_fetch_array("SELECT review_id FROM custom_reviews_connect_product_types_and_reviews WHERE shop = '$shop' AND id_product_type = $id_type");
        foreach ($arrayReviewIDTypes as $idReviewsInType) {
            $idReviewInType = $idReviewsInType["review_id"];
            $allReviewInType = db_fetch_array("SELECT * FROM custom_reviews_database WHERE shop = '$shop' AND id = $idReviewInType");
            $result = array_merge($result, $allReviewInType);
        }
    }
    foreach ($arrayIdCollection as $objCollection) {
        $id_collection = $objCollection["collection_id"];
        $reviewIDInCollection = db_fetch_array("SELECT review_id FROM custom_reviews_connect_collections_and_reviews WHERE shop = '$shop' AND collection_id = $id_collection");
        foreach ($reviewIDInCollection as $reviewInCollection) {
            $idReview = $reviewInCollection["review_id"];
            $allReviewInCollection = db_fetch_array("SELECT * FROM custom_reviews_database WHERE shop = '$shop' AND id = $idReview");
            $result = array_merge($result, $allReviewInCollection);
        }
    }

    echo json_encode($result);
}
if (isset($_GET['getReviewEdit'])) {
    $shop = $_GET['shop'];
    $idReview = $_GET['id'];
    $reviewEdit = db_fetch_array("SELECT * FROM custom_reviews_database WHERE shop = '$shop' AND id = $idReview");
    $arrayIdProductType = db_fetch_array("SELECT id_product_type FROM custom_reviews_connect_product_types_and_reviews WHERE shop = '$shop' AND review_id = $idReview");
    $allProductTypes = array();
    $arrCheckedProductTypes = array();
    // echo "SELECT id_product_type FROM custom_reviews_connect_product_types_and_reviews WHERE shop = '$shop' AND review_id = $idReview";

    foreach ($arrayIdProductType as $objIdProductType) {
        $idProductType = $objIdProductType["id_product_type"];
        $arrayProductType = db_fetch_array("SELECT id, product_type FROM custom_reviews_product_type WHERE shop = '$shop' AND id = $idProductType");

        foreach ($arrayProductType as $reviewIDProductType) {
            $idNeedProductType = $reviewIDProductType['id'];
            $arrCheckedProductTypes = array_merge($arrCheckedProductTypes, array($idNeedProductType));
        }
        $allProductTypes = array_merge($allProductTypes, $arrayProductType);
    }
    $arrayIDCollection = db_fetch_array("SELECT collection_id FROM custom_reviews_connect_collections_and_reviews WHERE shop = '$shop' AND review_id = $idReview");
    $allCollections = array();
    $arrCheckedCollections = array();
    foreach ($arrayIDCollection as $objIdCollection) {
        $idCollection = $objIdCollection["collection_id"];
        $arrayCollection = db_fetch_array("SELECT collection_id,title FROM custom_reviews_collections WHERE shop = '$shop' AND collection_id  = $idCollection");
        foreach ($arrayCollection as $reviewIDCollection) {
            $idNeedCollection = $reviewIDCollection['collection_id'];
            $arrCheckedCollections = array_merge($arrCheckedCollections, array($idNeedCollection));
        }
        $allCollections = array_merge($allCollections, $arrayCollection);
    }
    $reviewIDInProducts = db_fetch_array("SELECT product_id FROM custom_reviews_connect_products_and_reviews WHERE shop = '$shop' AND review_id = $idReview");
    $allProducts = array();
    $arrCheckedProduct = array();
    foreach ($reviewIDInProducts as $objIDInProducts) {
        $id_Product = $objIDInProducts["product_id"];
        $arrayReviewIDProduct = db_fetch_array("SELECT products_title,products_id FROM custom_reviewss_products WHERE shop = '$shop' AND products_id = $id_Product");
        // $arrayCheckedReviewIDProduct = db_fetch_array("SELECT products_id FROM custom_reviewss_products WHERE shop = '$shop' AND products_id = $id_Product");
        foreach ($arrayReviewIDProduct as $reviewIDProduct) {
            $idNeedProduct = $reviewIDProduct['products_id'];
            $arrCheckedProduct = array_merge($arrCheckedProduct, array($idNeedProduct));
        }
        $allProducts = array_merge($allProducts, $arrayReviewIDProduct);
    }
    $response = [
        'reviewEdit' => $reviewEdit,
        'listCollections' => $allCollections,
        'listProductTypes' => $allProductTypes,
        'listProducts' => $allProducts,
        'listArrCheckedProduct' => $arrCheckedProduct,
        'listArrCheckedCollection' => $arrCheckedCollections,
        'listArrCheckedProductType' => $arrCheckedProductTypes,
    ];
    echo json_encode($response);
}
if (isset($_GET['getCountReviewByProduct'])) {
    $shop = $_GET['shop'];
    $idProduct = $_GET['id'];
    $arrayIdCollection = db_fetch_array("SELECT collection_id FROM custom_reviews_connect_collections_and_products WHERE shop = '$shop' AND product_id = $idProduct");
    $result = array();
    $reviewIDInProducts = db_fetch_array("SELECT review_id FROM custom_reviews_connect_products_and_reviews WHERE shop = '$shop' AND product_id = $idProduct");
    foreach ($reviewIDInProducts as $objIDInProducts) {
        $id_ReviewProduct = $objIDInProducts["review_id"];
        $arrayReviewIDTypes = db_fetch_array("SELECT * FROM custom_reviews_database WHERE shop = '$shop' AND id = $id_ReviewProduct");
        $result = array_merge($result, $arrayReviewIDTypes);
    }

    $arrayProductType = db_fetch_array("SELECT product_type FROM custom_reviewss_products WHERE shop = '$shop' AND products_id = $idProduct");
    $productType = isset($arrayProductType[0]["product_type"]) ? $arrayProductType[0]["product_type"] : "";
    $arrayIDInType = db_fetch_array("SELECT id FROM custom_reviews_product_type WHERE shop = '$shop' AND product_type = '$productType'");
    foreach ($arrayIDInType as $objType) {
        $id_type = $objType["id"];
        $arrayReviewIDTypes = db_fetch_array("SELECT review_id FROM custom_reviews_connect_product_types_and_reviews WHERE shop = '$shop' AND id_product_type = $id_type");
        foreach ($arrayReviewIDTypes as $idReviewsInType) {
            $idReviewInType = $idReviewsInType["review_id"];
            $allReviewInType = db_fetch_array("SELECT * FROM custom_reviews_database WHERE shop = '$shop' AND id = $idReviewInType");
            $result = array_merge($result, $allReviewInType);
        }
    }
    foreach ($arrayIdCollection as $objCollection) {
        $id_collection = $objCollection["collection_id"];
        $reviewIDInCollection = db_fetch_array("SELECT review_id FROM custom_reviews_connect_collections_and_reviews WHERE shop = '$shop' AND collection_id = $id_collection");
        foreach ($reviewIDInCollection as $reviewInCollection) {
            $idReview = $reviewInCollection["review_id"];
            $allReviewInCollection = db_fetch_array("SELECT * FROM custom_reviews_database WHERE shop = '$shop' AND id = $idReview");
            $result = array_merge($result, $allReviewInCollection);
        }
    }

    echo count($result);
}

//MODAL STEP IMPORT
if (isset($_GET['getAutoCompleteProducts'])) {
    $shop = $_GET['shop'];
    $listProducts = db_fetch_array("select products_title,products_id from custom_reviewss_products where shop = '$shop'");
    echo json_encode($listProducts);
}
if (isset($_GET['getAutoCompleteCollections'])) {
    $shop = $_GET['shop'];
    $listCollections = db_fetch_array("select collection_id,title from custom_reviews_collections where shop = '$shop'");
    echo json_encode($listCollections);
}
if (isset($_GET['getAutoCompleteProductTypes'])) {
    $shop = $_GET['shop'];
    $listProductTypes = db_fetch_array("select id,product_type from custom_reviews_product_type where shop = '$shop'");
    echo json_encode($listProductTypes);
}
if (isset($_GET['getArrProductsImport'])) {
    $shop = $_GET['shop'];
    if (isset($_GET['arrId'])) {
        $arrId = $_GET['arrId'];
        $allProductImport = array();
        if (count($arrId) > 0) {
            for ($i = 0; $i < count($arrId); $i++) {
                $productImport = db_fetch_array("SELECT products_title,products_id  FROM custom_reviewss_products WHERE shop = '$shop' AND products_id = $arrId[$i]");
                $allProductImport = array_merge($allProductImport, $productImport);
            }
            echo json_encode($allProductImport);
        }
    } else {
        $allProductImport = array();
        echo json_encode($allProductImport);
    }
}
if (isset($_GET['getArrCollectionsImport'])) {
    $shop = $_GET['shop'];
    if (isset($_GET['arrId'])) {
        $arrId = $_GET['arrId'];
        $allCollectionsImport = array();
        if (count($arrId) > 0) {
            for ($i = 0; $i < count($arrId); $i++) {
                $collectionImport = db_fetch_array("SELECT collection_id,title  FROM custom_reviews_collections WHERE shop = '$shop' AND collection_id = $arrId[$i]");
                $allCollectionsImport = array_merge($allCollectionsImport, $collectionImport);
            }
            echo json_encode($allCollectionsImport);
        }
    } else {
        $allCollectionsImport = array();
        echo json_encode($allCollectionsImport);
    }
}
if (isset($_GET['getArrProductTypesImport'])) {
    $shop = $_GET['shop'];
    if (isset($_GET['arrId'])) {
        $arrId = $_GET['arrId'];
        $allProductTypesImport = array();
        if (count($arrId) > 0) {
            for ($i = 0; $i < count($arrId); $i++) {
                $productTypeImport = db_fetch_array("SELECT id,product_type  FROM custom_reviews_product_type WHERE shop = '$shop' AND id = $arrId[$i]");
                $allProductTypesImport = array_merge($allProductTypesImport, $productTypeImport);
            }
            echo json_encode($allProductTypesImport);
        }
    } else {
        $allProductTypesImport = array();
        echo json_encode($allProductTypesImport);
    }
}
//END MODAL STEP IMPORT



if (isset($_GET['searchReviewsImport'])) {
    $shop = $_GET['shop'];
    $page = intval($_GET["page"]);
    $queue = new Queue();
    $url = $_GET["url"];
    $sortBy = $_GET["sortBy"];
    $purchased = getBooleanData($_GET["purchased"]);
    $filterStar = getNumberOrStringData($_GET["filterStar"]);
    $blankContent = $_GET["blankContent"];
    $reviewer_name = $_GET["reviewer_name"];
    $review_title = $_GET["review_title"];
    $media = getBooleanData($_GET["media"]);
    $reviews = array();
    if (checkUrlImport($url) == 1) {
        try {
            $domain = getAmazonDomain($url);
            if ($domain != "") {
                $end = $page * 5;
                $start = $end - 4;
                $resolve = ['start'];
                while ($start < $end && count($resolve) !== 0 && is_array($resolve)) {
                    $queue->enqueue($start);
                    $start++;
                }
                $data = array();

                while (!$queue->isEmpty()) {
                    $customerReviews = new CustomerReview();
                    $resolve = $customerReviews->getAmazonReviews($url, $domain, $sortBy, $purchased, $filterStar, $media, $queue->dequeue(), $reviewer_name, $review_title, intval($blankContent));
                    $reviews = array_merge($reviews, $resolve);
                }
            }
        } catch (Exception $e) {
            $result = $e->getMessage();
        }
        if (count($reviews) > 0) {
            for ($i = 0; $i < count($reviews); $i++) {
                $reviews[$i]->date = date("m/d/Y H:i", strtotime($reviews[$i]->date));
                if ($reviews[$i]->rating == '') $reviews[$i]->rating = 1;
                $reviews[$i]->review_content = replaceText("==", "==", "", $reviews[$i]->review_content);
            }
        }
    } elseif (checkUrlImport($url) == 2) {
        try {
            $end = $page * 10;
            $start = $end - 9;
            $resolve = ['start'];
            while ($start < $end && count($resolve) !== 0 && is_array($resolve)) {
                $queue->enqueue($start);
                $start++;
            }

            while (!$queue->isEmpty()) {
                $customerReviews = new CustomerReview();
                $resolve = $customerReviews->getAliexpressReviews($url, $sortBy,  $filterStar, $media, $queue->dequeue(), $reviewer_name, $review_title, intval($blankContent));
                $reviews = array_merge($reviews, $resolve);
            }
            $result = count($reviews) . " reviews";
        } catch (Exception $e) {
            $result = $e->getMessage();
        }
        if (count($reviews) > 0) {
            for ($i = 0; $i < count($reviews); $i++) {
                $reviews[$i]->date = date("m/d/Y H:i", strtotime($reviews[$i]->date));
                if ($reviews[$i]->rating == '') $reviews[$i]->rating = 1;
                $reviews[$i]->review_content = replaceText("==", "==", "", $reviews[$i]->review_content);
            }
        }
    } else {
        $result = "Invalid URL";
    }
    echo json_encode($reviews);
}
// if (isset($_GET['getImageReviewByProduct'])) {
//     $id = $_GET['id'];
//     $allImage = db_fetch_array("SELECT * FROM custom_reviews_images WHERE shop = '$shop' AND product_id = $id");
//     echo json_encode($allImage);
// }
if (isset($_GET['getImageReview'])) {
    $shop = $_GET['shop'];
    $allImage = db_fetch_array("SELECT * FROM custom_reviews_images WHERE shop = '$shop'");
    echo json_encode($allImage);
}
if (isset($_GET['getImageInReview'])) {
    $shop = $_GET['shop'];
    $id = $_GET['id'];
    $allImage = db_fetch_array("SELECT * FROM custom_reviews_images WHERE shop = '$shop' AND review_id = $id");
    echo json_encode($allImage);
}
if (isset($_GET['getConnectCollectionReviews'])) {
    $shop = $_GET['shop'];
    $response = db_fetch_array("SELECT review_id,collection_id FROM custom_reviews_connect_collections_and_reviews WHERE shop = '$shop'");
    echo json_encode($response);
}
if (isset($_GET['getConnectProductTypeReviews'])) {
    $shop = $_GET['shop'];
    $response = db_fetch_array("SELECT review_id,id_product_type FROM custom_reviews_connect_product_types_and_reviews WHERE shop = '$shop'");
    echo json_encode($response);
}
if (isset($_GET['getConnectProductReviews'])) {
    $shop = $_GET['shop'];
    $response = db_fetch_array("SELECT review_id,product_id FROM custom_reviews_connect_products_and_reviews WHERE shop = '$shop'");
    echo json_encode($response);
}

//POST METHOD JSON
$_POST = json_decode(file_get_contents("php://input"), true);
if (isset($_POST['action'])) {
    if ($_POST['action'] == 'addReviewProducts') {
        $data = json_decode(file_get_contents('php://input'), true);
        $shop = $data['shop'];
        $shopify = shopifyInit($db, $shop, $appId);
        $newReview = $data["newReview"];
        $imageData = $newReview["image"];
        $arrCollection = $newReview["arrayCollection"];
        $arrayProduct = $newReview["arrayProduct"];
        $arrayProductType = $newReview["arrayProductType"];
        $valueDate = date('Y-m-d H:i:s', strtotime($newReview['valueDate']));
        // $productId = $newReview['idProduct'];
        // $array_id = db_fetch_array("select products_title from custom_reviewss_products where shop = '$shop' and products_id = '$productId'");
        // $product_title = $array_id[0]["products_title"];
        if (empty($newReview['valueDate'])) $valueDate = '';
        $newReviewIns = [
            "shop" => $shop,
            "reviewer_rating" => $newReview['selectedRating'],
            "product_id" => 1,
            // "product_title" => $product_title,
            "reviewer_name" => $newReview['valueName'],
            "reviewer_email" => $newReview['valueEmail'],
            "reviewer_title" => $newReview['valueTitle'],
            "reviewer_mess" => $newReview['valueMessage'],
            "product_recommend" => $newReview['valueRadioRecommend'] == 'yesRecommend' ? 1 : 0,
            "purchase" => $newReview['valueRadioPurchased'] == 'yesPurchased' ? 1 : 0,
            "publish" => $newReview['valueRadioPublish'] == 'yesPublish' ? 1 : 0,
            "publishdate" => $valueDate,
            // "review_thank" => '',
            "featured" => $newReview['valueRadioFeatured'] == 'yesFeatured' ? 1 : 0,
        ];
        $id = db_insert('custom_reviews_database', $newReviewIns);
        if (count($arrCollection) > 0) {

            $queue = new Queue();
            $j = 0;
            while ($j < count($arrCollection)) {
                $queue->enqueue($arrCollection[$j]);
                $j++;
            }
            while (!$queue->isEmpty()) {
                $idCollection =  $queue->dequeue();
                $newReviewCollections = [
                    "shop" => $shop,
                    "review_id" => $id,
                    "collection_id" => $idCollection
                ];
                db_insert('custom_reviews_connect_collections_and_reviews', $newReviewCollections);
            }
        }
        if (count($arrayProduct) > 0) {

            $queue = new Queue();
            $j = 0;
            while ($j < count($arrayProduct)) {
                $queue->enqueue($arrayProduct[$j]);
                $j++;
            }
            while (!$queue->isEmpty()) {
                $productId =  $queue->dequeue();
                $newReviewProduct = [
                    "shop" => $shop,
                    "review_id" => $id,
                    "product_id" => $productId
                ];
                db_insert('custom_reviews_connect_products_and_reviews', $newReviewProduct);
            }
        }
        if (count($arrayProductType) > 0) {

            $queue = new Queue();
            $j = 0;
            while ($j < count($arrayProductType)) {
                $queue->enqueue($arrayProductType[$j]);
                $j++;
            }
            while (!$queue->isEmpty()) {
                $id_ProductTypes =  $queue->dequeue();
                $newProductType = [
                    "shop" => $shop,
                    "review_id" => $id,
                    "id_product_type" => $id_ProductTypes
                ];
                db_insert('custom_reviews_connect_product_types_and_reviews', $newProductType);
            }
        }
        if (count($imageData) > 0) {
            $id_theme = getMainTheme($shopify);
            for ($i = 0; $i < count($imageData); $i++) {
                $rand = rand(0, 10000);
                $filename = FixSpecialChars($imageData[$i]["name"]);
                list($info, $base) = explode(",", $imageData[$i]["base"]);
                $dataUpload =  (object)[
                    "asset" => (object)[
                        "key" => 'assets/' . $rand . '_' . $filename,
                        "attachment" => "$base"
                    ]
                ];
                $uploadImage = $shopify("PUT", "/admin/api/$api_version/themes/$id_theme/assets.json", $dataUpload);
                $newImage = [
                    "shop" => $shop,
                    "product_id" => $newReview['idProduct'],
                    "review_id" => $id,
                    "url" => $uploadImage['public_url'],
                    "name" => $rand . '_' . $filename,
                ];
                db_insert('custom_reviews_images', $newImage);
            }
        }
    }
    // if ($_POST['action'] == 'addReviewCollections') {
    //     $data = json_decode(file_get_contents('php://input'), true);
    //     $shop = $data['shop'];
    //     $shopify = shopifyInit($db, $shop, $appId);
    //     $newReview = $data["newReview"];
    //     $imageData = $newReview["image"];
    //     $valueDate = date('Y-m-d H:i:s', strtotime($newReview['valueDate']));
    //     $id_Collections = $newReview['idCollection'];
    //     if (empty($newReview['valueDate'])) $valueDate = '';
    //     $newReviewIns = [
    //         "shop" => $shop,
    //         "reviewer_rating" => $newReview['selectedRating'],
    //         "collection_id" => 1,
    //         "reviewer_name" => $newReview['valueName'],
    //         "reviewer_email" => $newReview['valueEmail'],
    //         "reviewer_title" => $newReview['valueTitle'],
    //         "reviewer_mess" => $newReview['valueMessage'],
    //         "product_recommend" => $newReview['valueRadioRecommend'] == 'yesRecommend' ? 1 : 0,
    //         "purchase" => $newReview['valueRadioPurchased'] == 'yesPurchased' ? 1 : 0,
    //         "publish" => $newReview['valueRadioPublish'] == 'yesPublish' ? 1 : 0,
    //         "publishdate" => $valueDate,
    //         // "review_thank" => '',
    //         "featured" => $newReview['valueRadioFeatured'] == 'yesFeatured' ? 1 : 0,
    //     ];
    //     $id = db_insert('custom_reviews_database', $newReviewIns);
    //     $newReviewCollections = [
    //         "shop" => $shop,
    //         "review_id" => $id,
    //         "collection_id" => $id_Collections
    //     ];
    //     db_insert('custom_reviews_connect_collections_and_reviews', $newReviewCollections);

    //     if (count($imageData) > 0) {
    //         $id_theme = getMainTheme($shopify);
    //         for ($i = 0; $i < count($imageData); $i++) {
    //             $rand = rand(0, 10000);
    //             $filename = FixSpecialChars($imageData[$i]["name"]);
    //             list($info, $base) = explode(",", $imageData[$i]["base"]);
    //             $dataUpload =  (object)[
    //                 "asset" => (object)[
    //                     "key" => 'assets/' . $rand . '_' . $filename,
    //                     "attachment" => "$base"
    //                 ]
    //             ];
    //             $uploadImage = $shopify("PUT", "/admin/api/$api_version/themes/$id_theme/assets.json", $dataUpload);
    //             $newImage = [
    //                 "shop" => $shop,
    //                 "collection_id" => $id_Collections,
    //                 "review_id" => $id,
    //                 "url" => $uploadImage['public_url'],
    //                 "name" => $rand . '_' . $filename,
    //             ];
    //             db_insert('custom_reviews_images', $newImage);
    //         }
    //     }
    //     echo pr($uploadImage);
    // }
    // if ($_POST['action'] == 'addReviewProductTypes') {
    //     $data = json_decode(file_get_contents('php://input'), true);
    //     $shop = $data['shop'];
    //     $shopify = shopifyInit($db, $shop, $appId);
    //     $newReview = $data["newReview"];
    //     $imageData = $newReview["image"];
    //     $valueDate = date('Y-m-d H:i:s', strtotime($newReview['valueDate']));
    //     $id_ProductTypes = $newReview['idProductType'];
    //     if (empty($newReview['valueDate'])) $valueDate = '';
    //     $newReviewIns = [
    //         "shop" => $shop,
    //         "reviewer_rating" => $newReview['selectedRating'],
    //         "product_type" => 1,
    //         "reviewer_name" => $newReview['valueName'],
    //         "reviewer_email" => $newReview['valueEmail'],
    //         "reviewer_title" => $newReview['valueTitle'],
    //         "reviewer_mess" => $newReview['valueMessage'],
    //         "product_recommend" => $newReview['valueRadioRecommend'] == 'yesRecommend' ? 1 : 0,
    //         "purchase" => $newReview['valueRadioPurchased'] == 'yesPurchased' ? 1 : 0,
    //         "publish" => $newReview['valueRadioPublish'] == 'yesPublish' ? 1 : 0,
    //         "publishdate" => $valueDate,
    //         // "review_thank" => '',
    //         "featured" => $newReview['valueRadioFeatured'] == 'yesFeatured' ? 1 : 0,
    //     ];
    //     $id = db_insert('custom_reviews_database', $newReviewIns);
    //     $newProductType = [
    //         "shop" => $shop,
    //         "review_id" => $id,
    //         "id_product_type" => $id_ProductTypes
    //     ];
    //     db_insert('custom_reviews_connect_product_types_and_reviews', $newProductType);

    //     if (count($imageData) > 0) {
    //         $id_theme = getMainTheme($shopify);
    //         for ($i = 0; $i < count($imageData); $i++) {
    //             $rand = rand(0, 10000);
    //             $filename = FixSpecialChars($imageData[$i]["name"]);
    //             list($info, $base) = explode(",", $imageData[$i]["base"]);
    //             $dataUpload =  (object)[
    //                 "asset" => (object)[
    //                     "key" => 'assets/' . $rand . '_' . $filename,
    //                     "attachment" => "$base"
    //                 ]
    //             ];
    //             $uploadImage = $shopify("PUT", "/admin/api/$api_version/themes/$id_theme/assets.json", $dataUpload);
    //             $newImage = [
    //                 "shop" => $shop,
    //                 "product_type" => $id_ProductTypes,
    //                 "review_id" => $id,
    //                 "url" => $uploadImage['public_url'],
    //                 "name" => $rand . '_' . $filename,
    //             ];
    //             db_insert('custom_reviews_images', $newImage);
    //         }
    //     }
    //     echo pr($uploadImage);
    // }

    if ($_POST['action'] == 'submitEditReview') {
        $data = json_decode(file_get_contents('php://input'), true);
        $shop = $data['shop'];
        $shopify = shopifyInit($db, $shop, $appId);
        $newReview = $data["newReview"];
        $imageData = $newReview["image"];
        // $productId = $newReview["productId"];

        $valueDate = date('Y-m-d H:i:s', strtotime($newReview['valueDate']));
        $id = $newReview['id'];
        if (empty($newReview['valueDate'])) $valueDate = '';
        $newReviewIns = [
            "shop" => $shop,
            "reviewer_rating" => $newReview['selectedRating'],
            "reviewer_name" => $newReview['valueName'],
            "reviewer_email" => $newReview['valueEmail'],
            "reviewer_title" => $newReview['valueTitle'],
            "reviewer_mess" => $newReview['valueMessage'],
            "product_recommend" => $newReview['valueRadioRecommend'] == 'yesRecommend' ? 1 : 0,
            "purchase" => $newReview['valueRadioPurchased'] == 'yesPurchased' ? 1 : 0,
            "publish" => $newReview['valueRadioPublish'] == 'yesPublish' ? 1 : 0,
            "publishdate" => $valueDate,
            "featured" => $newReview['valueRadioFeatured'] == 'yesFeatured' ? 1 : 0,
        ];
        db_update('custom_reviews_database', $newReviewIns, "id = $id");
        if (count($imageData) > 0) {
            $id_theme = getMainTheme($shopify);
            for ($i = 0; $i < count($imageData); $i++) {
                $rand = rand(0, 10000);
                $filename = FixSpecialChars($imageData[$i]["name"]);
                list($info, $base) = explode(",", $imageData[$i]["base"]);
                $dataUpload =  (object)[
                    "asset" => (object)[
                        "key" => 'assets/' . $rand . '_' . $filename,
                        "attachment" => "$base"
                    ]
                ];
                $uploadImage = $shopify("PUT", "/admin/api/$api_version/themes/$id_theme/assets.json", $dataUpload);
                $newImage = [
                    "shop" => $shop,
                    // "product_id" => $newReview['productId'],
                    "review_id" => $id,
                    "url" => $uploadImage['public_url'],
                    "name" => $rand . '_' . $filename,
                ];
                db_insert('custom_reviews_images', $newImage);
            }
        }
        // $review = countAllReviewsByProduct($db, $shop, $productId);
        // $data = [
        //     "countReviews" => $review['countReviews'],
        //     "ratingReviews" => $review['ratingReviews'],
        // ];
        // db_update('custom_reviewss_products', $data, "products_id = $productId");
        echo pr($productId);
    }
    // if ($_POST['action'] == 'saveAndLoadMore') {
    //     $data = json_decode(file_get_contents('php://input'), true);
    //     $reviewImport = $data['reviewImport'];
    //     $url = $reviewImport['url'];
    //     $id_Product = $reviewImport['id'];
    //     $array_id = db_fetch_array("select products_title from custom_reviewss_products where shop = '$shop' and products_id = '$id_Product'");
    //     $product_title = $array_id[0]["products_title"];
    //     $arrayDataReview = $reviewImport['reviews'];
    //     $countDuplicate = 0;
    //     $count = $reviewImport['count'];
    //     if (count($arrayDataReview) > 0) {
    //         $allReviews = getAllReviews($db, $shop);
    //         for ($i = 0; $i < count($arrayDataReview); $i++) {
    //             if (checkDuplicateValue($id_Product, $arrayDataReview[$i], $allReviews) == 0) {
    //                 if (checkUrlImport($url) == 1) $source = 'Amazon';
    //                 elseif (checkUrlImport($url) == 2) $source = 'Aliexpress';
    //                 $valueDate = date('Y-m-d H:i:s', strtotime($arrayDataReview[$i]['date']));
    //                 $newReviewIns = [
    //                     "shop" => $shop,
    //                     "reviewer_rating" => $arrayDataReview[$i]['rating'],
    //                     "product_id" => $id_Product,
    //                     "product_title" => $product_title,
    //                     "reviewer_name" => $arrayDataReview[$i]['reviewer_name'],
    //                     "reviewer_email" => "",
    //                     "reviewer_title" => $arrayDataReview[$i]['review_title'],
    //                     "reviewer_mess" => $arrayDataReview[$i]['review_content'],
    //                     "product_recommend" => 1,
    //                     "purchase" =>  $arrayDataReview[$i]['isVerifiedPurchase'] == 'true' ? 1 : 0,
    //                     "publish" => 1,
    //                     "publishdate" => $valueDate,
    //                     "review_thanked" => $arrayDataReview[$i]['num_of_feel_helpful'],
    //                     "featured" => 1,
    //                     "import_source" => $source
    //                 ];
    //                 $id = db_insert('custom_reviews_database', $newReviewIns);
    //                 $imageArray = $arrayDataReview[$i]['images'];
    //                 if (count($imageArray) > 0) {
    //                     $id_theme = getMainTheme($shopify);
    //                     for ($j = 0; $j < count($arrayDataReview[$i]['images']); $j++) {
    //                         $rand = rand(0, 10000);
    //                         list($info, $filename) = explode("/I/", $imageArray[$j]);
    //                         $dataUpload =  (object)[
    //                             "asset" => (object)[
    //                                 "key" => 'assets/' . $rand . '_' . $filename,
    //                                 "src" => "$imageArray[$j]"
    //                             ]
    //                         ];
    //                         $uploadImage = $shopify("PUT", "/admin/api/$api_version/themes/$id_theme/assets.json", $dataUpload);
    //                         $newImage = [
    //                             "shop" => $shop,
    //                             "product_id" => $id_Product,
    //                             "review_id" => $id,
    //                             "url" => $uploadImage['public_url'],
    //                             "name" => $rand . '_' . $filename,
    //                         ];
    //                         db_insert('custom_reviews_images', $newImage);
    //                     }
    //                 }
    //                 $count++;
    //             } else {
    //                 $countDuplicate++;
    //             }
    //             if ($count > 0) {
    //                 $db->query("INSERT INTO custom_reviews_imported (product_id, shop) VALUES (" . $id_Product . ", '" . $shop . "')
    //                 ON DUPLICATE KEY UPDATE product_id=values(product_id),shop=values(shop)");
    //             }
    //         }
    //         $response = array(
    //             'countDuplicate' => $countDuplicate,
    //             'count' => $count,
    //         );
    //         echo json_encode($response);
    //     }
    // }
    if ($_POST['action'] == 'saveAndLoadMoreCollections') {
        $data = json_decode(file_get_contents('php://input'), true);
        $shop = $data['shop'];
        $shopify = shopifyInit($db, $shop, $appId);
        $reviewImport = $data['reviewImport'];
        $url = $reviewImport['url'];
        $id_Collections = $reviewImport['id'];
        $arrayDataReview = $reviewImport['reviews'];
        if (count($arrayDataReview) > 0) {
            $allReviews = getAllReviews($db, $shop);
            $queue = new Queue();
            $j = 0;
            while ($j < count($arrayDataReview)) {
                $queue->enqueue($arrayDataReview[$j]);
                $j++;
            }
            $data = array();
            while (!$queue->isEmpty()) {
                $dataReviews =  $queue->dequeue();
                if (count(checkDuplicateValue($dataReviews, $allReviews)) == 0) {
                    if (checkUrlImport($url) == 1) $source = 'Amazon';
                    elseif (checkUrlImport($url) == 2) $source = 'Aliexpress';
                    $valueDate = date('Y-m-d H:i:s', strtotime($dataReviews['date']));
                    $newReviewIns = [
                        "shop" => $shop,
                        "reviewer_rating" => $dataReviews['rating'],
                        "collection_id" => 1,
                        "reviewer_name" => $dataReviews['reviewer_name'],
                        "reviewer_email" => "",
                        "reviewer_title" => $dataReviews['review_title'],
                        "reviewer_mess" => $dataReviews['review_content'],
                        "product_recommend" => 1,
                        "purchase" =>  $dataReviews['isVerifiedPurchase'] == 'true' ? 1 : 0,
                        "publish" => 1,
                        "publishdate" => $valueDate,
                        "review_thanked" => $dataReviews['num_of_feel_helpful'],
                        "featured" => 1,
                        "import_source" => $source
                    ];
                    $id = db_insert('custom_reviews_database', $newReviewIns);
                    $newReviewCollections = [
                        "shop" => $shop,
                        "review_id" => $id,
                        "collection_id" => $id_Collections
                    ];
                    db_insert('custom_reviews_connect_collections_and_reviews', $newReviewCollections);
                    $imageArray = $dataReviews['images'];
                    if (count($imageArray) > 0) {
                        $id_theme = getMainTheme($shopify);
                        for ($k = 0; $k < count($dataReviews['images']); $k++) {
                            $rand = rand(0, 10000);
                            list($info, $filename) = explode("/I/", $imageArray[$k]);
                            $dataUpload =  (object)[
                                "asset" => (object)[
                                    "key" => 'assets/' . $rand . '_' . $filename,
                                    "src" => "$imageArray[$k]"
                                ]
                            ];
                            $uploadImage = $shopify("PUT", "/admin/api/$api_version/themes/$id_theme/assets.json", $dataUpload);
                            $newImage = [
                                "shop" => $shop,
                                "collection_id" => $id_Collections,
                                "review_id" => $id,
                                "url" => $uploadImage['public_url'],
                                "name" => $rand . '_' . $filename,
                            ];
                            db_insert('custom_reviews_images', $newImage);
                        }
                    }
                    $count++;
                } else {
                    $arrId = checkDuplicateValue($dataReviews, $allReviews);
                    $allReviewConnect = db_fetch_array("select * from custom_reviews_connect_collections_and_reviews where shop = '$shop'");
                    foreach ($arrId as $id) {
                        $newReviewCollections = [
                            "shop" => $shop,
                            "review_id" => $id,
                            "collection_id" => $id_Collections
                        ];
                        if (checkDuplicateValueCollection($newReviewCollections, $allReviewConnect) == 0) {
                            db_insert('custom_reviews_connect_collections_and_reviews', $newReviewCollections);
                        }
                    }
                }
                if ($count > 0) {
                    $db->query("INSERT INTO custom_reviews_imported (collection_id, shop) VALUES (" . $id_Collections . ", '" . $shop . "')
                    ON DUPLICATE KEY UPDATE collection_id=values(collection_id),shop=values(shop)");
                }
            }
            $response = array(
                'countDuplicate' => $countDuplicate,
                'count' => $count,
            );
            echo json_encode($response);
        }
    }

    if ($_POST['action'] == 'saveAndLoadMoreMultiProducts') {
        $data = json_decode(file_get_contents('php://input'), true);
        $shop = $data['shop'];
        $shopify = shopifyInit($db, $shop, $appId);
        $reviewImport = $data['reviewImport'];
        $url = $reviewImport['url'];
        $id_Product = $reviewImport['id'];
        $arrayDataReview = $reviewImport['reviews'];
        $countDuplicate = 0;
        $count = $reviewImport['count'];
        if (count($arrayDataReview) > 0) {
            $allReviews = getAllReviews($db, $shop);
            $queue = new Queue();
            $j = 0;
            while ($j < count($arrayDataReview)) {
                $queue->enqueue($arrayDataReview[$j]);
                $j++;
            }
            $data = array();
            while (!$queue->isEmpty()) {
                $dataReviews =  $queue->dequeue();
                $array_id = db_fetch_array("select products_title from custom_reviewss_products where shop = '$shop' and products_id = '$id_Product'");
                $product_title = $array_id[0]["products_title"];
                if (count(checkDuplicateValue($dataReviews, $allReviews)) == 0) {
                    if (checkUrlImport($url) == 1) $source = 'Amazon';
                    elseif (checkUrlImport($url) == 2) $source = 'Aliexpress';
                    $valueDate = date('Y-m-d H:i:s', strtotime($dataReviews['date']));
                    $newReviewIns = [
                        "shop" => $shop,
                        "reviewer_rating" => $dataReviews['rating'],
                        "product_id" => 1,
                        "product_title" => $product_title,
                        "reviewer_name" => $dataReviews['reviewer_name'],
                        "reviewer_email" => "",
                        "reviewer_title" => $dataReviews['review_title'],
                        "reviewer_mess" => $dataReviews['review_content'],
                        "product_recommend" => 1,
                        "purchase" =>  $dataReviews['isVerifiedPurchase'] == 'true' ? 1 : 0,
                        "publish" => 1,
                        "publishdate" => $valueDate,
                        "review_thanked" => $dataReviews['num_of_feel_helpful'],
                        "featured" => 1,
                        "import_source" => $source
                    ];
                    $id = db_insert('custom_reviews_database', $newReviewIns);
                    $newReviewProduct = [
                        "shop" => $shop,
                        "review_id" => $id,
                        "product_id" => $id_Product
                    ];
                    db_insert('custom_reviews_connect_products_and_reviews', $newReviewProduct);
                    $reviewInDB = countAllReviewsByProduct($db, $shop, $id_Product);
                    $data = [
                        "countReviews" => $reviewInDB['countReviews'],
                        "ratingReviews" => $reviewInDB['ratingReviews'],
                    ];
                    db_update('custom_reviewss_products', $data, "products_id = $id_Product");
                    // echo json_encode($id);
                    $imageArray = $dataReviews['images'];
                    if (count($imageArray) > 0) {
                        $id_theme = getMainTheme($shopify);
                        for ($k = 0; $k < count($dataReviews['images']); $k++) {
                            $rand = rand(0, 10000);
                            list($info, $filename) = explode("/I/", $imageArray[$k]);
                            $dataUpload =  (object)[
                                "asset" => (object)[
                                    "key" => 'assets/' . $rand . '_' . $filename,
                                    "src" => "$imageArray[$k]"
                                ]
                            ];
                            $uploadImage = $shopify("PUT", "/admin/api/$api_version/themes/$id_theme/assets.json", $dataUpload);
                            $newImage = [
                                "shop" => $shop,
                                "product_id" => $id_Product,
                                "review_id" => $id,
                                "url" => $uploadImage['public_url'],
                                "name" => $rand . '_' . $filename,
                            ];
                            db_insert('custom_reviews_images', $newImage);
                        }
                    }
                    $count++;
                } else {
                    $arrId = checkDuplicateValue($dataReviews, $allReviews);
                    echo pr($arrId);

                    $allReviewConnect = db_fetch_array("select * from custom_reviews_connect_products_and_reviews where shop = '$shop'");
                    foreach ($arrId as $id) {
                        $newReviewProduct = [
                            "shop" => $shop,
                            "review_id" => $id,
                            "product_id" => $id_Product
                        ];
                        if (checkDuplicateValueProduct($newReviewProduct, $allReviewConnect) == 0) {
                            db_insert('custom_reviews_connect_products_and_reviews', $newReviewProduct);
                        }
                    }
                }
                if ($count > 0) {
                    $db->query("INSERT INTO custom_reviews_imported (product_id, shop) VALUES (" . $id_Product . ", '" . $shop . "')
                        ON DUPLICATE KEY UPDATE product_id=values(product_id),shop=values(shop)");
                }
            }
        }
    }
    if ($_POST['action'] == 'saveAndLoadMoreType') {
        $data = json_decode(file_get_contents('php://input'), true);
        $shop = $data['shop'];
        $shopify = shopifyInit($db, $shop, $appId);
        $reviewImport = $data['reviewImport'];
        $url = $reviewImport['url'];
        $idProductType = $reviewImport['id'];
        $arrayDataReview = $reviewImport['reviews'];
        $count = $reviewImport['count'];
        if (count($arrayDataReview) > 0) {
            $allReviews = getAllReviews($db, $shop);
            $queue = new Queue();
            $j = 0;
            while ($j < count($arrayDataReview)) {
                $queue->enqueue($arrayDataReview[$j]);
                $j++;
            }
            $data = array();
            while (!$queue->isEmpty()) {
                $dataReviews =  $queue->dequeue();
                if (count(checkDuplicateValue($dataReviews, $allReviews)) == 0) {
                    if (checkUrlImport($url) == 1) $source = 'Amazon';
                    elseif (checkUrlImport($url) == 2) $source = 'Aliexpress';
                    $valueDate = date('Y-m-d H:i:s', strtotime($dataReviews['date']));
                    $newReviewIns = [
                        "shop" => $shop,
                        "reviewer_rating" => $dataReviews['rating'],
                        "product_type" => 1,
                        "reviewer_name" => $dataReviews['reviewer_name'],
                        "reviewer_email" => "",
                        "reviewer_title" => $dataReviews['review_title'],
                        "reviewer_mess" => $dataReviews['review_content'],
                        "product_recommend" => 1,
                        "purchase" =>  $dataReviews['isVerifiedPurchase'] == 'true' ? 1 : 0,
                        "publish" => 1,
                        "publishdate" => $valueDate,
                        "review_thanked" => $dataReviews['num_of_feel_helpful'],
                        "featured" => 1,
                        "import_source" => $source
                    ];
                    $id = db_insert('custom_reviews_database', $newReviewIns);
                    $newReviewProductType = [
                        "shop" => $shop,
                        "review_id" => $id,
                        "id_product_type" => $idProductType,
                    ];
                    db_insert('custom_reviews_connect_product_types_and_reviews', $newReviewProductType);
                    $imageArray = $dataReviews['images'];
                    if (count($imageArray) > 0) {
                        $id_theme = getMainTheme($shopify);
                        for ($k = 0; $k < count($dataReviews['images']); $k++) {
                            $rand = rand(0, 10000);
                            list($info, $filename) = explode("/I/", $imageArray[$k]);
                            $dataUpload =  (object)[
                                "asset" => (object)[
                                    "key" => 'assets/' . $rand . '_' . $filename,
                                    "src" => "$imageArray[$k]"
                                ]
                            ];
                            $uploadImage = $shopify("PUT", "/admin/api/$api_version/themes/$id_theme/assets.json", $dataUpload);
                            $newImage = [
                                "shop" => $shop,
                                "product_type" => $idProductType,
                                "review_id" => $id,
                                "url" => $uploadImage['public_url'],
                                "name" => $rand . '_' . $filename,
                            ];
                            db_insert('custom_reviews_images', $newImage);
                        }
                    }
                    $count++;
                } else {
                    $arrId = checkDuplicateValue($dataReviews, $allReviews);
                    $allReviewConnect = db_fetch_array("select * from custom_reviews_connect_product_types_and_reviews where shop = '$shop'");
                    foreach ($arrId as $id) {
                        $newReviewProductType = [
                            "shop" => $shop,
                            "review_id" => $id,
                            "id_product_type" => $idProductType,
                        ];
                        if (checkDuplicateValueType($newReviewProductType, $allReviewConnect) == 0) {
                            db_insert('custom_reviews_connect_product_types_and_reviews', $newReviewProductType);
                        }
                    }
                }
                if ($count > 0) {
                    $db->query("INSERT INTO custom_reviews_imported (product_type, shop) VALUES (" . $idProductType . ", '" . $shop . "')
                        ON DUPLICATE KEY UPDATE product_type=values(product_type),shop=values(shop)");
                }
            }
            $response = array(
                'countDuplicate' => $countDuplicate,
                'count' => $count,
            );
            echo json_encode($response);
        }
    }

    if ($_POST['action'] == 'updateCountReview') {
        $data = json_decode(file_get_contents('php://input'), true);
        $shop = $data['shop'];
        if (isset($data['id'])) {
            $productId = $data['id'];
        };
        $review = countAllReviewsByProduct($db, $shop, $productId);
        $data = [
            "countReviews" => $review['countReviews'],
            "ratingReviews" => $review['ratingReviews'],
        ];
        db_update('custom_reviewss_products', $data, "products_id = $productId");
    }
    if ($_POST['action'] == 'updateCountReviewInType') {
        $data = json_decode(file_get_contents('php://input'), true);
        $shop = $data['shop'];
        $typeID = $data['id'];
        $type = db_fetch_array("SELECT product_type  FROM custom_reviews_product_type WHERE shop = '$shop' AND id   = '$typeID'");
        $titleType = count($type) > 0 ? $type[0]["product_type"] : "";
        $review = countAllReviewsByProductTypes($db, $shop, $titleType);
        $data = [
            "countReviews" => $review['countReviews'],
            "ratingReviews" => $review['ratingReviews'],
        ];
        db_update('custom_reviews_product_type', $data, "id = $typeID");
    }
    if ($_POST['action'] == 'updateCountReviewInCollection') {
        $data = json_decode(file_get_contents('php://input'), true);
        $shop = $data['shop'];
        $collectionID = $data['id'];
        $review = countAllReviewsByCollection($db, $shop, $collectionID);
        $data = [
            "countReviews" => $review['countReviews'],
            "ratingReviews" => $review['ratingReviews'],
        ];
        db_update('custom_reviews_collections', $data, "collection_id  = $collectionID");
    }
    // if ($_POST['action'] == 'updateCountReviewMultiProducts') {
    //     $data = json_decode(file_get_contents('php://input'), true);
    //     if (isset($data['arrID'])) {
    //         $arr_ID = $data['arrID'];
    //     };
    //     for ($i = 0; $i < count($arr_ID); $i++) {
    //         $productId = $arr_ID[$i];
    //         $review = countAllReviewsByProduct($db, $shop, $productId);
    //         $data = [
    //             "countReviews" => $review['countReviews'],
    //             "ratingReviews" => $review['ratingReviews'],
    //         ];
    //         db_update('custom_reviewss_products', $data, "products_id = $productId");
    //     }
    // }

    // if ($_POST['action'] == 'deleteAllReview') {
    //     $idProduct = $_POST["id"];
    //     $id_theme = getMainTheme($shopify);

    //     db_delete('custom_reviews_database', "shop = '$shop' and product_id = '$idProduct'");
    //     $review = countAllReviewsByProduct($db, $shop, $id);
    //     $data = [
    //         "countReviews" => $review['countReviews'],
    //         "ratingReviews" => $review['ratingReviews'],
    //     ];
    //     db_update('custom_reviewss_products', $data, "products_id = $idProduct");
    //     db_delete('custom_reviews_imported', "shop = '$shop' and product_id = '$idProduct'");
    //     $reviewHasImage = db_fetch_array("select * from custom_reviews_images where shop = '$shop' and product_id = '$idProduct'"); //get taats ca image co id = product_id
    //     if (count($reviewHasImage) > 0) {
    //         for ($i = 0; $i < count($reviewHasImage); $i++) {
    //             $idImage = $reviewHasImage[$i]["id"];
    //             $nameImage = $reviewHasImage[$i]["name"];
    //             $delete = $shopify("DELETE", "/admin/api/$api_version/themes/$id_theme/assets.json?asset[key]=assets/$nameImage");
    //             db_delete('custom_reviews_images', "shop = '$shop' and id = '$idImage'");
    //         }
    //     }
    // }
    if ($_POST['action'] == 'deleteImage') {
        $data = json_decode(file_get_contents('php://input'), true);
        $id = $_POST["id"];
        $shop = $data['shop'];
        $shopify = shopifyInit($db, $shop, $appId);
        $id_theme = getMainTheme($shopify);
        $reviewHasImage = db_fetch_array("select * from custom_reviews_images where shop = '$shop' and id = '$id'");
        if (count($reviewHasImage) > 0) {
            db_delete('custom_reviews_images', "shop = '$shop' and id = '$id'");
            if (strpos($reviewHasImage[0]["url"], 'cdn.shopify.com') !== false) {
                $nameImage = $reviewHasImage[0]["name"];
                $shopify("DELETE", "/admin/api/$api_version/themes/$id_theme/assets.json?asset[key]=assets/$nameImage");
            }
        }
    }
    if ($_POST['action'] == 'deleteOneReview') {
        $data = json_decode(file_get_contents('php://input'), true);
        $id = $_POST["id"];
        $shop = $data['shop'];
        $shopify = shopifyInit($db, $shop, $appId);
        $id_theme = getMainTheme($shopify);
        $reviewHasImage = db_fetch_array("select * from custom_reviews_images where shop = '$shop' and review_id = '$id'");
        if (count($reviewHasImage) > 0) {
            for ($i = 0; $i < count($reviewHasImage); $i++) {
                $idImage = $reviewHasImage[$i]["id"];
                $nameImage = $reviewHasImage[$i]["name"];
                $shopify("DELETE", "/admin/api/$api_version/themes/$id_theme/assets.json?asset[key]=assets/$nameImage");
                db_delete('custom_reviews_images', "shop = '$shop' and id = '$idImage'");
            }
        }
        $db->query("DELETE FROM custom_reviews_database WHERE shop = '$shop' AND id = '$id'");
        $db->query("DELETE FROM custom_reviews_connect_products_and_reviews WHERE shop = '$shop' AND review_id = '$id'");
        $db->query("DELETE FROM custom_reviews_connect_collections_and_reviews WHERE shop = '$shop' AND review_id = '$id'");
        $db->query("DELETE FROM custom_reviews_connect_product_types_and_reviews WHERE shop = '$shop' AND review_id = '$id'");
    }

    if ($_POST['action'] == 'publishAllReview') {
        $data = json_decode(file_get_contents('php://input'), true);
        $shop = $data['shop'];
        if (isset($data['id'])) {
            $productId = $data['id'];
        };
        $db->query("UPDATE custom_reviews_database SET publish = 1  WHERE shop = '$shop' AND product_id = '$productId'");
    }

    if ($_POST['action'] == 'unPublishAllReview') {
        $data = json_decode(file_get_contents('php://input'), true);
        $shop = $data['shop'];
        if (isset($data['id'])) {
            $productId = $data['id'];
        };
        $db->query("UPDATE custom_reviews_database SET publish = 0  WHERE shop = '$shop' AND product_id = '$productId'");
    }
    if ($_POST['action'] == 'unPublishReviewChecked') {
        $data = json_decode(file_get_contents('php://input'), true);
        $shop = $data['shop'];
        $arrID = $data['arrID'];
        for ($i = 0; $i < count($arrID); $i++) {
            $id = $arrID[$i];
            $db->query("UPDATE custom_reviews_database SET publish = 0  WHERE shop = '$shop' AND id = '$id'");
        }
    }
    if ($_POST['action'] == 'publishReviewChecked') {
        $data = json_decode(file_get_contents('php://input'), true);
        $shop = $data['shop'];
        $arrID = $data['arrID'];
        for ($i = 0; $i < count($arrID); $i++) {
            $id = $arrID[$i];
            $db->query("UPDATE custom_reviews_database SET publish = 1  WHERE shop = '$shop' AND id = '$id'");
        }
    }
    if ($_POST['action'] == 'unFlagReviewChecked') {
        $data = json_decode(file_get_contents('php://input'), true);
        $shop = $data['shop'];
        $arrID = $data['arrID'];
        for ($i = 0; $i < count($arrID); $i++) {
            $id = $arrID[$i];
            $db->query("UPDATE custom_reviews_database SET featured = 0  WHERE shop = '$shop' AND id = '$id'");
        }
    }
    if ($_POST['action'] == 'flagReviewChecked') {
        $data = json_decode(file_get_contents('php://input'), true);
        $shop = $data['shop'];
        $arrID = $data['arrID'];
        for ($i = 0; $i < count($arrID); $i++) {
            $id = $arrID[$i];
            $db->query("UPDATE custom_reviews_database SET featured = 1  WHERE shop = '$shop' AND id = '$id'");
        }
    }
    if ($_POST['action'] == 'deleteReviewChecked') {
        $data = json_decode(file_get_contents('php://input'), true);
        $shop = $data['shop'];
        $shopify = shopifyInit($db, $shop, $appId);
        $id_theme = getMainTheme($shopify);
        $arrID = $data['arrID'];
        for ($i = 0; $i < count($arrID); $i++) {
            $id = $arrID[$i];
            $db->query("DELETE FROM custom_reviews_database WHERE shop = '$shop' AND id = '$id'");
            $db->query("DELETE FROM custom_reviews_connect_products_and_reviews WHERE shop = '$shop' AND review_id = '$id'");
            $db->query("DELETE FROM custom_reviews_connect_collections_and_reviews WHERE shop = '$shop' AND review_id = '$id'");
            $db->query("DELETE FROM custom_reviews_connect_product_types_and_reviews WHERE shop = '$shop' AND review_id = '$id'");
            $reviewHasImage = db_fetch_array("select * from custom_reviews_images where shop = '$shop' and review_id = '$id'");
            if (count($reviewHasImage) > 0) {
                for ($i = 0; $i < count($reviewHasImage); $i++) {
                    $idImage = $reviewHasImage[$i]["id"];
                    $nameImage = $reviewHasImage[$i]["name"];
                    $delete = $shopify("DELETE", "/admin/api/$api_version/themes/$id_theme/assets.json?asset[key]=assets/$nameImage");
                    db_delete('custom_reviews_images', "shop = '$shop' and id = '$idImage'");
                }
            }
        }
    }


    //in review pages
    if ($_POST['action'] == 'unPublishReviewProductsChecked') {
        $data = json_decode(file_get_contents('php://input'), true);
        $shop = $data['shop'];
        $arrID = $data['arrID'];
        $arrIdReview = array();
        for ($i = 0; $i < count($arrID); $i++) {
            $id_Product = $arrID[$i];
            $idReview = db_fetch_array("select review_id from custom_reviews_connect_products_and_reviews where shop = '$shop' and product_id = $id_Product");
            $arrIdReview = array_merge($arrIdReview, $idReview);
        }
        for ($i = 0; $i < count($arrIdReview); $i++) {
            $idReviewNeed = $arrIdReview[$i]["review_id"];
            $dataUpdate = [
                "publish" => 0,
            ];
            db_update('custom_reviews_database', $dataUpdate, "shop = '$shop' AND id = '$idReviewNeed'");
            // $db->query("UPDATE custom_reviews_database SET publish = 0  WHERE shop = '$shop' AND product_id = '$id_Product'");
        }
    }
    if ($_POST['action'] == 'publishReviewProductsChecked') {
        $data = json_decode(file_get_contents('php://input'), true);
        $shop = $data['shop'];
        $arrID = $data['arrID'];
        $arrIdReview = array();
        for ($i = 0; $i < count($arrID); $i++) {
            $id_Product = $arrID[$i];
            $idReview = db_fetch_array("select review_id from custom_reviews_connect_products_and_reviews where shop = '$shop' and product_id = $id_Product");
            $arrIdReview = array_merge($arrIdReview, $idReview);
        }
        for ($i = 0; $i < count($arrIdReview); $i++) {
            $idReviewNeed = $arrIdReview[$i]["review_id"];
            $dataUpdate = [
                "publish" => 1,
            ];
            db_update('custom_reviews_database', $dataUpdate, "shop = '$shop' AND id = '$idReviewNeed'");
            // $db->query("UPDATE custom_reviews_database SET publish = 0  WHERE shop = '$shop' AND product_id = '$id_Product'");
        }
    }
    if ($_POST['action'] == 'unFlagReviewProductsChecked') {
        $data = json_decode(file_get_contents('php://input'), true);
        $shop = $data['shop'];
        $arrID = $data['arrID'];
        $arrIdReview = array();
        for ($i = 0; $i < count($arrID); $i++) {
            $id_Product = $arrID[$i];
            $idReview = db_fetch_array("select review_id from custom_reviews_connect_products_and_reviews where shop = '$shop' and product_id = $id_Product");
            $arrIdReview = array_merge($arrIdReview, $idReview);
        }
        for ($i = 0; $i < count($arrIdReview); $i++) {
            $idReviewNeed = $arrIdReview[$i]["review_id"];
            $dataUpdate = [
                "featured" => 0,
            ];
            db_update('custom_reviews_database', $dataUpdate, "shop = '$shop' AND id = '$idReviewNeed'");
            // $db->query("UPDATE custom_reviews_database SET publish = 0  WHERE shop = '$shop' AND product_id = '$id_Product'");
        }
    }
    if ($_POST['action'] == 'flagReviewProductsChecked') {
        $data = json_decode(file_get_contents('php://input'), true);
        $shop = $data['shop'];
        $arrID = $data['arrID'];
        $arrIdReview = array();
        for ($i = 0; $i < count($arrID); $i++) {
            $id_Product = $arrID[$i];
            $idReview = db_fetch_array("select review_id from custom_reviews_connect_products_and_reviews where shop = '$shop' and product_id = $id_Product");
            $arrIdReview = array_merge($arrIdReview, $idReview);
        }
        for ($i = 0; $i < count($arrIdReview); $i++) {
            $idReviewNeed = $arrIdReview[$i]["review_id"];
            $dataUpdate = [
                "featured" => 1,
            ];
            db_update('custom_reviews_database', $dataUpdate, "shop = '$shop' AND id = '$idReviewNeed'");
            // $db->query("UPDATE custom_reviews_database SET publish = 0  WHERE shop = '$shop' AND product_id = '$id_Product'");
        }
    }
    if ($_POST['action'] == 'deleteReviewProductsChecked') {
        $data = json_decode(file_get_contents('php://input'), true);
        $shop = $data['shop'];
        $arrID = $data['arrID'];
        $arrReviewHasDelete = array();
        for ($i = 0; $i < count($arrID); $i++) {
            $id_Product = $arrID[$i];
            $arrIdReview = db_fetch_array("select review_id from custom_reviews_connect_products_and_reviews where shop = '$shop' and product_id = '$id_Product'");
            $arrReviewHasDelete = array_merge($arrReviewHasDelete, $arrIdReview);
            db_delete("custom_reviews_connect_products_and_reviews", "shop = '$shop' AND product_id = '$id_Product'");
            $review = countAllReviewsByProduct($dbr, $shop, $id_Product);
            $data = [
                "countReviews" => $review['countReviews'],
                "ratingReviews" => $review['ratingReviews'],
            ];
            db_update('custom_reviewss_products', $data, "products_id = $id_Product");
        }
        foreach ($arrReviewHasDelete as $reviewHasDelete) {
            $idReview = $reviewHasDelete['review_id'];
            $arrCheckReviewHasDelete = db_fetch_array("select review_id from custom_reviews_connect_products_and_reviews where shop = '$shop' and review_id = '$idReview'");
            if (count($arrCheckReviewHasDelete) == 0) {
                $update = [
                    "product_id" => 0,
                ];
                db_update('custom_reviews_database', $update, "shop = '$shop' and id = $idReview");
                // $db->query("UPDATE custom_reviews_database SET product_id = 0  WHERE shop = '$shop' AND id  = '$idReview'");
            }
        }
        // for ($i = 0; $i < count($arrID); $i++) {
        //     $id_Product = $arrID[$i];
        //     $arrReviewHasDelete = db_fetch_array("select review_id from custom_reviews_connect_products_and_reviews where shop = '$shop' and product_id = '$id_Product'");
        //     $db->query("DELETE FROM custom_reviews_connect_products_and_reviews WHERE shop = '$shop' AND product_id = '$id_Product'");
        //     $review = countAllReviewsByProduct($db, $shop, $id_Product);
        //     $data = [
        //         "countReviews" => $review['countReviews'],
        //         "ratingReviews" => $review['ratingReviews'],
        //     ];
        //     db_update('custom_reviewss_products', $data, "products_id = $id_Product");
        //     foreach ($arrReviewHasDelete as $reviewHasDelete) {
        //         $idReview = $reviewHasDelete['review_id'];
        //         $arrCheckReviewHasDelete = db_fetch_array("select review_id from custom_reviews_connect_products_and_reviews where shop = '$shop' and review_id = '$idReview'");
        //         if (count($arrCheckReviewHasDelete) == 0) {
        //             $db->query("UPDATE custom_reviews_database SET product_id = 0  WHERE shop = '$shop' AND id  = '$idReview'");
        //         }
        //     }
        // }
    }
    if ($_POST['action'] == 'deleteImageProductsChecked') {
        $data = json_decode(file_get_contents('php://input'), true);
        $shop = $data['shop'];
        $shopify = shopifyInit($db, $shop, $appId);
        $id_theme = getMainTheme($shopify);

        $arrID = $data['arrID'];
        for ($i = 0; $i < count($arrID); $i++) {
            $reviewHasImage = db_fetch_array("select * from custom_reviews_images where shop = '$shop' and product_id = '$id_Product'");
            if (count($reviewHasImage) > 0) {
                for ($i = 0; $i < count($reviewHasImage); $i++) {
                    $idImage = $reviewHasImage[$i]["id"];
                    $nameImage = $reviewHasImage[$i]["name"];
                    $delete = $shopify("DELETE", "/admin/api/$api_version/themes/$id_theme/assets.json?asset[key]=assets/$nameImage");
                    db_delete('custom_reviews_images', "shop = '$shop' and id = '$idImage'");
                }
            }
        }
    }
    //MODAL EDIT
    if ($_POST['action'] == 'unsubscribeProduct') {
        $data = json_decode(file_get_contents('php://input'), true);
        $shop = $data['shop'];
        $dataReview = $data["dataReview"];
        $idReview = $dataReview['idReview'];
        $idProduct = $dataReview['idProduct'];
        $db->query("DELETE FROM custom_reviews_connect_products_and_reviews WHERE shop = '$shop' AND product_id = $idProduct AND review_id = $idReview");
        $arrReviewHasUnSubscribe = db_fetch_array("select review_id from custom_reviews_connect_products_and_reviews where shop = '$shop' and review_id = '$idReview'");
        if (count($arrCheckReviewHasDelete) == 0) {
            $db->query("UPDATE custom_reviews_database SET product_id = 0  WHERE shop = '$shop' AND id  = '$idReview'");
        }
    }
    if ($_POST['action'] == 'unsubscribeProductType') {
        $data = json_decode(file_get_contents('php://input'), true);
        $shop = $data['shop'];
        $dataReview = $data["dataReview"];
        $idReview = $dataReview['idReview'];
        $idProductType = $dataReview['idProductType'];
        $db->query("DELETE FROM custom_reviews_connect_product_types_and_reviews WHERE shop = '$shop' AND id_product_type = $idProductType AND review_id = $idReview");
        $arrReviewHasUnSubscribe = db_fetch_array("select review_id from custom_reviews_connect_product_types_and_reviews where shop = '$shop' and review_id = '$idReview'");
        if (count($arrCheckReviewHasDelete) == 0) {
            $db->query("UPDATE custom_reviews_database SET product_type = 0  WHERE shop = '$shop' AND id  = '$idReview'");
        }
    }
    if ($_POST['action'] == 'unsubscribeCollection') {
        $data = json_decode(file_get_contents('php://input'), true);
        $shop = $data['shop'];
        $dataReview = $data["dataReview"];
        $idReview = $dataReview['idReview'];
        $idCollection = $dataReview['idCollection'];
        $db->query("DELETE FROM custom_reviews_connect_collections_and_reviews WHERE shop = '$shop' AND collection_id = $idCollection AND review_id = $idReview");
        $arrReviewHasUnSubscribe = db_fetch_array("select review_id from custom_reviews_connect_collections_and_reviews where shop = '$shop' and review_id = '$idReview'");
        if (count($arrCheckReviewHasDelete) == 0) {
            $db->query("UPDATE custom_reviews_database SET collection_id = 0  WHERE shop = '$shop' AND id  = '$idReview'");
        }
    }

    if ($_POST['action'] == 'subscribeProduct') {
        $data = json_decode(file_get_contents('php://input'), true);
        $shop = $data['shop'];
        $dataReview = $data["dataReview"];
        $idReview = $dataReview['idReview'];
        $idProduct = $dataReview['idProduct'];
        $item = [
            "shop" => $shop,
            "review_id" => $idReview,
            "product_id" => $idProduct,
        ];
        db_insert('custom_reviews_connect_products_and_reviews', $item);
        $db->query("UPDATE custom_reviews_database SET product_id = 1  WHERE shop = '$shop' AND id  = '$idReview'");
    }
    if ($_POST['action'] == 'subscribeProductType') {
        $data = json_decode(file_get_contents('php://input'), true);
        $shop = $data['shop'];
        $dataReview = $data["dataReview"];
        $idReview = $dataReview['idReview'];
        $idProductType = $dataReview['idProductType'];
        $checkHasSubscribe = db_fetch_array("select * from custom_reviews_connect_product_types_and_reviews where shop = '$shop' and review_id = '$idReview' and id_product_type = '$idProductType'");
        if (count($checkHasSubscribe) == 0) {
            $item = [
                "shop" => $shop,
                "review_id" => $idReview,
                "id_product_type" => $idProductType,
            ];
            db_insert('custom_reviews_connect_product_types_and_reviews', $item);
            $db->query("UPDATE custom_reviews_database SET product_type = 1  WHERE shop = '$shop' AND id  = '$idReview'");
        }
    }
    if ($_POST['action'] == 'subscribeCollection') {
        $data = json_decode(file_get_contents('php://input'), true);
        $shop = $data['shop'];
        $dataReview = $data["dataReview"];
        $idReview = $dataReview['idReview'];
        $idCollection = $dataReview['idCollection'];
        $checkHasSubscribe = db_fetch_array("select * from custom_reviews_connect_collections_and_reviews where shop = '$shop' and review_id = '$idReview' and collection_id = '$idCollection'");
        if (count($checkHasSubscribe) == 0) {
            $item = [
                "shop" => $shop,
                "review_id" => $idReview,
                "collection_id" => $idCollection,
            ];
            db_insert('custom_reviews_connect_collections_and_reviews', $item);
            $db->query("UPDATE custom_reviews_database SET collection_id = 1  WHERE shop = '$shop' AND id  = '$idReview'");
        }
    }
    //END MODAL EDIT
}


// if (isset($_FILES['importFile'])) {

// }

if (isset($_GET['exportReviewsData'])) {
    $shop = $_GET['shop'];
    $sql = "SELECT * FROM custom_reviews_database WHERE shop = '$shop'";
    $query = $db->query($sql);
    $count = mysqli_num_rows($query);
    $products = array();
    if ($count > 0) {
        $products = db_fetch_array("SELECT * FROM custom_reviewss_products WHERE shop = '$shop'");
    }

    $reviews = getAllReviews($db, $shop);
    if (count($reviews) != 0) {
        $excel = new Spreadsheet();
        $excel->setActiveSheetIndex(0)
            ->setCellValue('A1', 'product_handle')
            ->setCellValue('B1', 'publish')
            ->setCellValue('C1', 'rating')
            ->setCellValue('D1', 'title')
            ->setCellValue('E1', 'author')
            ->setCellValue('F1', 'email')
            ->setCellValue('G1', 'message')
            ->setCellValue('H1', 'recommend')
            ->setCellValue('I1', 'purchased')
            ->setCellValue('J1', 'thanked')
            ->setCellValue('K1', 'featured')
            ->setCellValue('L1', 'publishdate');
        $excel->getActiveSheet()->getColumnDimension('A')->setWidth(30);
        $excel->getActiveSheet()->getColumnDimension('B')->setWidth(10);
        $excel->getActiveSheet()->getColumnDimension('C')->setWidth(10);
        $excel->getActiveSheet()->getColumnDimension('D')->setWidth(30);
        $excel->getActiveSheet()->getColumnDimension('E')->setWidth(30);
        $excel->getActiveSheet()->getColumnDimension('F')->setWidth(30);
        $excel->getActiveSheet()->getColumnDimension('G')->setWidth(30);
        $excel->getActiveSheet()->getColumnDimension('H')->setWidth(15);
        $excel->getActiveSheet()->getColumnDimension('I')->setWidth(15);
        $excel->getActiveSheet()->getColumnDimension('J')->setWidth(15);
        $excel->getActiveSheet()->getColumnDimension('K')->setWidth(15);
        $excel->getActiveSheet()->getColumnDimension('L')->setWidth(20);

        $numRow = 2;
        $countSuccess = 0;
        foreach ($reviews as $row) {
            $success = false;
            foreach ($products as $product) {
                if ($row["product_id"] == $product["products_id"]) {
                    $excel->getActiveSheet()->setCellValue('A' . $numRow, $product["products_handle"]);
                    $success = true;
                }
            }
            if ($success == true) {
                $excel->getActiveSheet()->setCellValue('B' . $numRow, changeDataExport($row["publish"]));
                $excel->getActiveSheet()->setCellValue('C' . $numRow, $row["reviewer_rating"]);
                $excel->getActiveSheet()->setCellValue('D' . $numRow, $row["reviewer_title"]);
                $excel->getActiveSheet()->setCellValue('E' . $numRow, $row["reviewer_name"]);
                $excel->getActiveSheet()->setCellValue('F' . $numRow, $row["reviewer_email"]);
                $excel->getActiveSheet()->setCellValue('G' . $numRow, $row["reviewer_mess"]);
                $excel->getActiveSheet()->setCellValue('H' . $numRow, changeDataExport($row["product_recommend"]));
                $excel->getActiveSheet()->setCellValue('I' . $numRow, changeDataExport($row["purchase"]));
                $excel->getActiveSheet()->setCellValue('J' . $numRow, $row["review_thanked"]);
                $excel->getActiveSheet()->setCellValue('K' . $numRow, changeDataExport($row["featured"]));
                $excel->getActiveSheet()->getStyle('L' . $numRow)->getNumberFormat()->setFormatCode(PhpOffice\PhpSpreadsheet\Style\NumberFormat::FORMAT_DATE_XLSX22);
                $excel->getActiveSheet()->setCellValue('L' . $numRow, $row["publishdate"]);
                $numRow++;
                $countSuccess++;
            }
        }
        $rand = rand(0, 10000);
        $filename = $shop . "_reviews_data_" . $rand . ".xlsx";
        $writer = new Xlsx($excel);
        $writer->save(APP_PATH . "/upload/" . $filename);
        $urlFile = $rootLink . "/upload/" . $filename;

        header('Content-Type: application/vnd.ms-excel');
        header('Content-Disposition: attachment; filename="' . APP_PATH . "/upload/" . $filename . '"');
        $response =  array(
            'success' => $countSuccess,
            'url' => $urlFile
        );
    } else {
        $response =  array(
            'success' => 0,
        );
    }

    echo json_encode($response);
}
if (isset($_GET['deleteExportReviewsFile'])) {
    // $shop = $_GET['shop'];
    $url = $_GET['url'];
    $pathRoot =  $_SERVER['DOCUMENT_ROOT'];
    list($http, $path) = explode("com/", $url);
    unlink($pathRoot . '/' . $path);
}






//function--------------------------------------------------------------------------------------------------------------------------------
function changeDataExport($data)
{
    if ($data == '0') {
        $data = 'no';
    } else {
        $data = 'yes';
    }
    return $data;
}

function getMainTheme($shopify)
{
    $themes = $shopify('GET', '/admin/api/' . $GLOBALS['api_version'] . '/themes.json');
    foreach ($themes as $theme) {
        if ($theme["role"] == 'main') $id = $theme["id"];
    }
    return $id;
}
function checkDuplicateValue($item, $lists)
{
    $result = array();
    foreach ($lists as $row) {
        if ($item["reviewer_name"] == $row["reviewer_name"] && date("Y-m-d H:i:s", strtotime($item["date"])) == date("Y-m-d H:i:s", strtotime($row["publishdate"]))) {
            $result = array_merge($result, [$row["id"]]);
            break;
        }
    }
    return $result;
}
function checkDuplicateValueProduct($item, $lists)
{
    $result = 0;
    foreach ($lists as $row) {
        if ($item["review_id"] == $row["review_id"] && $item["product_id"] == $row["product_id"]) {
            $result = 1;
            break;
        }
    }
    return $result;
}
function checkDuplicateValueCollection($item, $lists)
{
    $result = 0;
    foreach ($lists as $row) {
        if ($item["review_id"] == $row["review_id"] && $item["collection_id"] == $row["collection_id"]) {
            $result = 1;
            break;
        }
    }
    return $result;
}
function checkDuplicateValueType($item, $lists)
{
    $result = 0;
    foreach ($lists as $row) {
        if ($item["review_id"] == $row["review_id"] && $item["id_product_type"] == $row["id_product_type"]) {
            $result = 1;
            break;
        }
    }
    return $result;
}

function getAllReviews($db, $shop)
{
    $sql = "SELECT * FROM custom_reviews_database WHERE shop = '$shop' ORDER BY publishdate DESC";
    $query = $db->query($sql);
    $lists = array();
    if ($query) {
        while ($row = $query->fetch_assoc()) {
            $row["reviewer_name"] = testOutputData($row["reviewer_name"]);
            $row["reviewer_email"] = testOutputData($row["reviewer_email"]);
            $row["reviewer_title"] = testOutputData($row["reviewer_title"]);
            $row["reviewer_mess"] = testOutputData($row["reviewer_mess"]);
            $row["publishdate"] = date("m/d/Y H:i", strtotime($row["publishdate"]));
            $lists[] = $row;
        }
    }
    return $lists;
}
