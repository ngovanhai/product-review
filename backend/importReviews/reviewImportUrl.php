<?php

namespace Reviews;

require_once 'vendor/autoload.php';

use DOMDocument;
use DOMXPath;
use Carbon\Carbon;
use GuzzleHttp\Client;
use GuzzleHttp\Cookie\FileCookieJar;

// $html = file_get_contents('https://www.amazon.com/Chinh-Tri-Binh-Dan-Vietnamese/dp/1548466565/ref=sr_1_1?dchild=1&keywords=gi%C3%A0y&qid=1607490095&sr=8-1');
// libxml_use_internal_errors(true);
// $doc = new DOMDocument;
// $doc->loadHTML($html);
// $xpath = new DOMXpath($doc);
// $all = $xpath->query('//div[@data-hook="review"]');
// $dataContent = array();
// for ($i = 0; $i < $all->length; $i++) {
//     $image = $xpath->query("(//div[contains(@class,'review-image-tile-section')]//img)")->item($i);
//     $imageHas = '';
//     if ($image !== null) {
//         $imageHas =  $xpath->query("(//div[contains(@class,'review-image-tile-section')]//img)")->item($i)->getAttribute('src');
//     }
//     $data = [
//         "author" => trim($xpath->query("//*[(@class='a-profile')]")->item($i)->textContent),
//         "content" => trim($xpath->query('//div[@data-hook="review-collapsed"]')->item($i)->textContent),
//         "title" => trim($xpath->query("//*[(@data-hook='review-title')]")->item($i)->textContent),
//         "rating" => trim($xpath->query("//*[(@data-hook='review-star-rating' or @data-hook='cmps-review-star-rating')]")->item($i)->textContent),
//         "image" => trim($imageHas)

//     ];
//     array_push($dataContent, $data);
// }



class CustomerReview
{
    public function getAmazonReviews($url = "", $domain = "www.amazon.com", $sortBy = "top-rated", $isVerifiedPurchase = true, $star = 4, $imageAndVideoOnly = false, $page = 1, $replaceName = "", $replaceTitle = "", $blank = 1)
    {

        $amzSortBy = [
            'most-recent' => 'recent',
            'top-rated' => 'helpful',
        ];
        if ($isVerifiedPurchase) {
            $amzReviewerType = 'avp_only_reviews';
        } else {
            $amzReviewerType = 'all_reviews';
        }

        if ($imageAndVideoOnly) {
            $amzMediaType = 'media_reviews_only';
        } else {
            $amzMediaType = 'all_contents';
        }

        $amzFilterByStar = [
            '0' => 'all_stars',
            '1' => 'one_star',
            '2' => 'two_star',
            '3' => 'three_star',
            '4' => 'four_star',
            '5' => 'five_star',
            'positive' => 'positive',
            'critical' => 'critical',
        ];
        if (!array_key_exists($sortBy, $amzSortBy)) {
            return array();
        }
        if (!array_key_exists($star, $amzFilterByStar)) {
            return array();
        }
        if (!is_bool($isVerifiedPurchase)) {
            return array();
        }
        if (!is_bool($imageAndVideoOnly)) {
            return array();
        }
        // $cookieFile = Storage::path('cookies/amz.txt');
        // $cookieJar = new FileCookieJar($cookieFile, true);
        // $cookieJar = new \GuzzleHttp\Cookie\CookieJar(true);
        $jar = new \GuzzleHttp\Cookie\CookieJar;
        $client = new \GuzzleHttp\Client([
            'cookies' => $jar,
            // 'verify' => false,
            // 'proxy' => '178.128.215.161:3128',
        ]);
        // $response = $client->get($url);
        // $client = new \GuzzleHttp\Client();
        $response = $client->get($url);
        // echo pr($client);
        // die;
        $htmlContent = $response->getBody()->getContents();

        $htmlContent = mb_convert_encoding($htmlContent, 'HTML-ENTITIES', "UTF-8");

        libxml_use_internal_errors(true);
        $dom = new DOMDocument();
        $dom->loadHTML($htmlContent);

        $xpath = new DOMXPath($dom);
        $canonical = $xpath->query("//link[@rel='canonical']/@href");
        $link = '';
        if (count($canonical) == 1) {
            $link = $canonical->item(0)->nodeValue;
        }
        $dataXmlftSelectAsin = $xpath->query("//span[@id='cr-state-object']/@data-state");
        $asin = '';
        if (count($dataXmlftSelectAsin) == 1) {
            try {
                $jsonAsin = json_decode($dataXmlftSelectAsin->item(0)->nodeValue);
                $asin = $jsonAsin->asin;
            } catch (\Exception $e) {
            }
        }
        if ($link && empty($asin)) {
            $arrLink = explode('/', $link);
            $asin = $arrLink[count($arrLink) - 1];
        }
        if (empty($asin)) {
            return array();
        }
        $urlPost = 'https://' . $domain . '/hz/reviews-render/ajax/reviews/get/ref=cm_cr_arp_d_viewopt_sr';

        $headers = [
            'content-type' => 'application/x-www-form-urlencoded',
            'Accept-Encoding' => 'gzip, deflate, br',
            'accept' => 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
            'user-agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36',
            'Referer' => $url,
            'x-requested-with' => 'XMLHttpRequest',
            'Accept-Language' => 'en-US,en;q=0.8,hi;q=0.6,und;q=0.4',
        ];
        $form_params = [
            'sortBy' => $amzSortBy[$sortBy],
            'reviewerType' => $amzReviewerType,
            'formatType' => '',
            'mediaType' => $amzMediaType,
            'filterByStar' => $amzFilterByStar[$star],
            'pageNumber' => $page,
            'filterByKeyword' => '',
            'shouldAppend' => 'undefined',
            'deviceType' => 'desktop',
            'reftag' => 'cm_cr_arp_d_viewpnt_lft',
            'pageSize' => 50,
            'asin' => $asin,
            'scope' => 'reviewsAjax0',
        ];

        $response = $client->post($urlPost, [
            'headers' => $headers,
            'form_params' => $form_params,
        ]);
        $htmlContent = $response->getBody()->getContents();
        $htmlContent = mb_convert_encoding($htmlContent, 'HTML-ENTITIES', "UTF-8");
        preg_match_all('/\["append","#cm_cr-review_list","(.*)"\]/', $htmlContent, $matches);
        $allReviews = array();
        $elementReviews = array();
        $allElementReviews = array();
        $matches[1] = array_values(array_filter($matches[1]));
        $i = 0;
        foreach ($matches[1] as $key => $match) {
            if (!empty($match)) {
                $dom->loadHTML(stripslashes($match));
                $xpath = new DOMXPath($dom);
                $dataXmlsReviewAuthor = $xpath->query("//a[contains(@class,'a-profile')]");

                if (!empty($dataXmlsReviewAuthor->item(0))) {
                    $elementReviews['reviewer_name'] = $dataXmlsReviewAuthor->item(0)->textContent;
                } else {
                    $elementReviews['reviewer_name'] = $replaceName;
                }
                $dataXmlsVerifiedPurchase = $xpath->query("//span[@data-hook='avp-badge']");
                $isVerifiedPurchase = "";
                if (!empty($dataXmlsVerifiedPurchase->item(0))) {
                    if ($dataXmlsVerifiedPurchase->item(0)->textContent = "Verified Purchase") {
                        $isVerifiedPurchase = "true";
                    } else {
                        $isVerifiedPurchase = "false";
                    }
                }
                $elementReviews['isVerifiedPurchase'] = $isVerifiedPurchase;
                $dataXmlsDate = $xpath->query("//span[contains(@class,'review-date')]");
                if (!empty($dataXmlsDate->item(0))) {
                    $textDate = $dataXmlsDate->item(0)->textContent;
                    $textDate = explode("on", $textDate);
                    $time = trim($textDate[1]);
                    $elementReviews['date'] = $time;
                } else {
                    $elementReviews['date'] = "";
                }
                $dataXmlsRate = $xpath->query("//a[contains(@class,'review-title')]");
                if (!empty($dataXmlsRate->item(0))) {
                    $reviewTitle = $dataXmlsRate->item(0)->textContent;
                    $reviewTitle = trim($reviewTitle, "n ");
                    if (!empty($reviewTitle)) {
                        $elementReviews['review_title'] = $reviewTitle;
                    } else {
                        $elementReviews['review_title'] = $replaceTitle;
                    }
                } else {
                    $elementReviews['review_title'] = $replaceTitle;
                }
                $dataXmlsContent = $xpath->query("//span[contains(@class,'review-text')]");
                if (!empty($dataXmlsContent->item(0))) {
                    $reviewText = $dataXmlsContent->item(0)->textContent;
                    if (!empty($reviewText)) {
                        $elementReviews['review_content'] = trim($reviewText, "n ");
                    } else {
                        $elementReviews['review_content'] = "";
                    }
                } else {
                    $elementReviews['review_content'] = "";
                }
                $dataXmlsRateStar = $xpath->query("//a[contains(@class,'a-link-normal')]/i[contains(@class,'a-icon')]/span");
                $rating = "";
                if (!empty($dataXmlsRateStar->item(0))) {
                    $rating = $dataXmlsRateStar->item(0)->textContent;
                }
                $rating = substr($rating, 0, 1);
                switch ($rating) {
                    case '5':
                        $elementReviews['rating'] = 5;
                        break;
                    case '4':
                        $elementReviews['rating'] = 4;
                        break;
                    case '3':
                        $elementReviews['rating'] = 3;
                        break;
                    case '2':
                        $elementReviews['rating'] = 2;
                        break;
                    case '1':
                        $elementReviews['rating'] = 1;
                        break;
                    default:
                        $elementReviews['rating'] = 1;
                }
                $elementReviews['rating'] = $rating;
                $dataXmlsNumOfFeelHelpful = $xpath->query("//span[@data-hook='helpful-vote-statement']");
                if (!empty($dataXmlsNumOfFeelHelpful->item(0))) {
                    $elementReviews['num_of_feel_helpful'] = (int) preg_replace('/[^0-9]/', '', $dataXmlsNumOfFeelHelpful->item(0)->textContent);
                } else {
                    $elementReviews['num_of_feel_helpful'] = 0;
                }
                $arrayImages = array();
                $dataXmlsLinkImage = $xpath->query("(//div[contains(@class,'review-image-tile-section')]//img)");
                if (!empty($dataXmlsLinkImage->item(0))) {
                    for ($i = 0; $i < $dataXmlsLinkImage->length; $i++) {
                        array_push($arrayImages, $dataXmlsLinkImage->item($i)->getAttribute('src'));
                    }
                    $elementReviews['images'] = $arrayImages;
                } else {
                    $elementReviews['images'] = array();
                }
                $elementReviews['id'] = $key;
                if ($key < 50) {
                    if (empty($elementReviews['review_content']) && empty($elementReviews['review_title']) && empty($elementReviews['date'])) {
                        //skip
                    } else {
                        if ($blank == 1) {
                            array_push($allElementReviews, (object) $elementReviews);
                        } elseif ($blank == 0 && $elementReviews['review_content'] != "") {
                            array_push($allElementReviews, (object) $elementReviews);
                        }
                    }
                }
            }
        }
        return $allElementReviews;
    }


    //get aliexpress
    public function getAliexpressReviews($url = "", $sortBy = "top-rated", $star = 4, $withPictures = false, $page = 1, $replaceName = "", $replaceTitle = "", $blank = 1)
    {
        $aliSortBy = [
            'top-rated' => 'sortdefault@feedback',
            'most-recent' => 'sortlarest@feedback',
        ];
        $aliFilterByStar = [
            '0' => 'all Stars',
            '1' => '1 Stars',
            '2' => '2 Stars',
            '3' => '3 Stars',
            '4' => '4 Stars',
            '5' => '5 Stars',
            'positive' => 'All positive',
            'critical' => 'All negative',
        ];

        //validation
        if (!array_key_exists($sortBy, $aliSortBy)) {
            // invalid sort by
            return array();
        }
        if (!array_key_exists($star, $aliFilterByStar)) {
            // invalid star
            return array();
        }
        if (!is_bool($withPictures)) {
            // invalid bool
            return array();
        }
        $jar = new \GuzzleHttp\Cookie\CookieJar;
        $client = new \GuzzleHttp\Client([
            'cookies' => $jar,
            // 'verify' => false,
            // 'proxy' => '178.128.215.161:3128',
        ]);
        // $client = new \GuzzleHttp\Client();
        $response = $client->get($url);

        // $htmlContent = $response->getBody()->getContents();

        // $htmlContent = mb_convert_encoding($htmlContent, 'HTML-ENTITIES', "UTF-8");
        // libxml_use_internal_errors(true);
        // $dom = new DOMDocument();
        // $dom->loadHTML($htmlContent);
        // $cookieFile = Storage::path('cookies/ali.txt');
        // $cookieJar = new FileCookieJar($cookieFile, true);
        // $client = new Client([
        //     'cookies' => $cookieJar,
        //     'verify' => false,
        //     'proxy' => '178.128.215.161:3128',
        // ]);
        // $response = $client->get($url);

        $htmlContent = $response->getBody()->getContents();
        $htmlContent = mb_convert_encoding($htmlContent, 'HTML-ENTITIES', "UTF-8");
        libxml_use_internal_errors(true);
        $dom = new DOMDocument();
        $dom->loadHTML($htmlContent);
        $xpath = new DOMXPath($dom);

        //productId: string
        //Huy craping
        $dataXmlObjectId = $xpath->query("//script");
        $data = preg_replace('/\s+/', '', $dataXmlObjectId->item(0)->ownerDocument->textContent);
        $startProductId = strpos($data, "productId");
        $endProductId = strpos($data, "rootCategoryId");
        $lengthBetweenProductID = $endProductId - $startProductId - 2;
        $stringOwnerMemberID = substr($data,  $startProductId, $lengthBetweenProductID);
        list($type, $productId) = explode(":", $stringOwnerMemberID);

        $startOwnerMemberId = strpos($data, "sellerAdminSeq");
        $endOwnerMemberId = strpos($data, "tradeCurrencyCode");
        $lengthBetweenOwnerMemberId = $endOwnerMemberId - $startOwnerMemberId - 2;
        $stringOwnerMemberID = substr($data,  $startOwnerMemberId, $lengthBetweenOwnerMemberId);
        list($type, $ownerMemberId) = explode(":", $stringOwnerMemberID);
        //end Huy craping
        // echo $data;
        // die;
        $urlPost = 'https://feedback.aliexpress.com/display/productEvaluation.htm';
        $headers = [
            'content-type' => 'application/x-www-form-urlencoded',
            'Accept-Encoding' => 'gzip, deflate, br',
            'accept' => 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
            'user-agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36',
            'Referer' => 'https://feedback.aliexpress.com/display/productEvaluation.htm',
            'upgrade-insecure-requests' => '1',
        ];
        $form_params = [
            'ownerMemberId' => $ownerMemberId,
            'memberType' => 'seller',
            'productId' => $productId,
            'companyId' => '',
            'evaStarFilterValue' => $aliFilterByStar[$star],
            'evaSortValue' => $aliSortBy[$sortBy],
            'page' => $page,
            'currentPage' => $page,
            'startValidDate' => '',
            'i18n' => 'true',
            'withPictures' => var_export($withPictures, true),
            'withPersonalInfo' => 'false',
            'withAdditionalFeedback' => 'false',
            'onlyFromMyCountry' => 'false',
            'version' => '0.0.0',
            'isOpened' => 'true',
            'translate' => 'N',
            'jumpToTop' => 'true',
            '${csrfToken.parameterName}' => '${csrfToken.token}',
        ];
        $response = $client->post($urlPost, [
            'headers' => $headers,
            'form_params' => $form_params,
        ]);
        $htmlContent = $response->getBody()->getContents();
        $htmlContent = mb_convert_encoding($htmlContent, 'HTML-ENTITIES', "UTF-8");

        $pattern_html = '{<div\s+class="feedback-item clearfix"\s*>((?:(?:(?!<div[^>]*>|</div>).)++|<div[^>]*>(?1)</div>)*)</div>}si';  // single-line (dot matches all), ignore case and free spacing modes ON
        preg_match_all($pattern_html, $htmlContent, $matches);
        $elementReviews = array();
        $allElementReviews = array();

        $getJsonHelpful = new CustomerReview();
        $evaluation = array();
        $count = 1;

        foreach ($matches[1] as $key => $match) {
            if (!empty($match)) {
                $dom->loadHTML(stripslashes($match));
                $xpath = new DOMXPath($dom);

                //reviewer_name: string
                // $dataXmlsReviewAuthor = $xpath->query("//body//span[@class='user-name']/a[@name='member_detail']");
                $dataXmlsReviewAuthor = $xpath->query("//body//span[@class='user-name']");
                // log
                if (!empty($dataXmlsReviewAuthor->item(0))) {
                    $elementReviews['reviewer_name'] = $dataXmlsReviewAuthor->item(0)->textContent;
                } else {
                    $elementReviews['reviewer_name'] = $replaceName;
                }

                //date: YYYY-mm-dd HH:MM:SS,
                $dataXmlsDate = $xpath->query("//dl[@class='buyer-review']/dd[@class='r-time']");
                if (!empty($dataXmlsDate->item(0))) {
                    $time = $dataXmlsDate->item(0)->textContent;
                    $timeCar = Carbon::createFromFormat('j F Y H:i', $time);
                    $timeFormated = $timeCar->toDateTimeString();
                    $elementReviews['date'] = $timeFormated;
                }

                //review_title: string
                $elementReviews['review_title'] = $replaceTitle;

                //review_content: text
                $query = '//h:td/text()';
                $dataXmlsContent = $xpath->query("//dt[@class='buyer-feedback']/span");
                if (!empty($dataXmlsContent->item(0))) {
                    $reviewText = $dataXmlsContent->item(0)->textContent;
                    if (!empty($reviewText)) {
                        $elementReviews['review_content'] = $reviewText;
                    } else {
                        $elementReviews['review_content'] = "";
                    }
                }

                //rating: 1->5
                $dataXmlsRateStar = $xpath->query("//*[@class ='star-view']/span");
                if (!empty($dataXmlsRateStar->item(0))) {
                    $rating = $dataXmlsRateStar->item(0)->getAttribute("style");
                    switch ($rating) {
                        case "width:100%":
                            $elementReviews['rating'] = 5;
                            break;
                        case "width:80%":
                            $elementReviews['rating'] = 4;
                            break;
                        case "width:60%":
                            $elementReviews['rating'] = 3;
                            break;
                        case "width:40%":
                            $elementReviews['rating'] = 2;
                            break;
                        case "width:20%":
                            $elementReviews['rating'] = 1;
                            break;
                        default:
                            $elementReviews['rating'] = 1;
                    }
                } else {
                    $elementReviews['rating'] = "";
                }
                $idEvaluation = $xpath->query("//input[@class='feedback-id']/@value");
                if (!empty($idEvaluation->item(0))) {
                    $eval = $idEvaluation->item(0)->textContent;
                    array_push($evaluation, $eval);
                    $elementReviews['num_of_feel_helpful'] = $eval;
                } else {
                    $elementReviews['num_of_feel_helpful'] = 0;
                }

                $arrayImages = array();
                $dataXmlsLinkImage = $xpath->query("(//div[@class='fb-main']/div[@class='f-content']/dl[@class='buyer-review']//ul[@class='util-clearfix']//img)");
                if (!empty($dataXmlsLinkImage->item(0))) {
                    for ($i = 0; $i < $dataXmlsLinkImage->length; $i++) {
                        array_push($arrayImages, $dataXmlsLinkImage->item($i)->getAttribute('src'));
                    }
                    $elementReviews['images'] = $arrayImages;
                } else {
                    $elementReviews['images'] = array();
                }
                $elementReviews['id'] = $key;
                if ($count <= 10) {
                    if ($blank == 1) {
                        array_push($allElementReviews, $elementReviews);
                    } elseif ($blank == 0 && $elementReviews['review_content'] != "") {
                        array_push($allElementReviews, $elementReviews);
                    }
                }
                $count++;
            }
        }
        $evaluationId = "";
        foreach ($evaluation as $item) {
            $evaluationId .= $item . ",";
        }
        $evaluationId = substr($evaluationId, 0, strlen($evaluationId) - 1);
        $jsonHelpful = $getJsonHelpful->getUseful("https://feedback.aliexpress.com/display/DiggShowAjaxService.htm", $productId, $evaluationId);
        $arrEvaluation = array();
        $eval = array();
        if (!empty($jsonHelpful)) {
            $jsonNumOfFeelHelpful = json_decode($jsonHelpful, true);
            if (!empty($jsonNumOfFeelHelpful)) {
                foreach ($jsonNumOfFeelHelpful["result"] as $key => $val) {
                    $eval[$key] = $val["useful"];
                }
                array_push($arrEvaluation, $eval);
            }
        }

        $arrAliExpress = array();
        foreach ($allElementReviews as $va => $value) {
            $value['num_of_feel_helpful'] = $arrEvaluation[0][$value['num_of_feel_helpful']];
            array_push($arrAliExpress, (object) $value);
        }
        return $arrAliExpress;
    }
    private function getUseful($url, $productId, $idEvaluation)
    {
        $client = new \GuzzleHttp\Client();
        $response = $client->get($url . "?evaluation_ids=" . $idEvaluation . "&product_id=" . $productId . "&from=detail");
        $htmlContent = $response->getBody()->getContents();
        $htmlContent = mb_convert_encoding($htmlContent, 'HTML-ENTITIES', "UTF-8");
        return $htmlContent;
    }
}

class Element
{
    public $value;
    public $next;
}

/**
 * Queue class that store element in queue
 * Remove element from font
 * Insert element to back
 */
// class Queue
// {
//     private $font = null;
//     private $back = null;

//     /**
//      * Check whether the queue is empty or not
//      * @return boolean
//      * public function isEmpty(){ return false; }  //stub
//      */
//     public function isEmpty()
//     {
//         return $this->font == null;
//     }

//     /** 
//      * Insert element at the back of queue
//      * @param $value
//      * public function enqueue($value){} //stub
//      */
//     public function enqueue($value)
//     {
//         $oldBack = $this->back;
//         $this->back = new Element();
//         $this->back->value = $value;
//         if ($this->isEmpty()) {
//             $this->font = $this->back;
//         } else {
//             $oldBack->next = $this->back;
//         }
//     }

//     /**
//      * Remove element from the font of queue
//      * @return $value
//      * public function dequeue(){ return 0; } //stub
//      */
//     public function dequeue()
//     {
//         if ($this->isEmpty()) {
//             return null;
//         }
//         $removedValue = $this->font->value;
//         $this->font = $this->font->next;
//         return $removedValue;
//     }
// }

// $cus = new CustomerReview;
// //Client Code
// $queue = new Queue();

// $i = 1;
// $b = 1;
// while ($b < 5) {
//     $queue->enqueue($i);
//     $i++;
//     $b++;
// }
// $data = array();
// while (!$queue->isEmpty()) {
//     echo json_encode($cus->getAmazonReviews("https://www.amazon.com/DualSense-Wireless-Controller-PlayStation-5/dp/B08FC6C75Y/ref=sr_1_1?dchild=1&fst=as%3Aoff&pf_rd_i=16225016011&pf_rd_m=ATVPDKIKX0DER&pf_rd_p=03b28c2c-71e9-4947-aa06-f8b5dc8bf880&pf_rd_r=SKGWZ6C10C6D9G01CG1K&pf_rd_s=merchandised-search-3&pf_rd_t=101&qid=1489016289&rnid=16225016011&s=videogames-intl-ship&sr=1-1", "www.amazon.com", "top-rated", true, 4, false, $queue->dequeue(), "", "", 1));
// }
