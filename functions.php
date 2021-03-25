<?php
require 'conn-shopify.php';

function genFilterForm()
{
    $html = "<div class='reviews-filter'>
                <label>
                    <select class='reviews-sort' name='reviews-sort'>
                        <option value='recent'>Most Recent</option>
                        <option value='helpful'>Most Helpful</option>
                        <option value='hight-rate'>Highest Rated</option>
                        <option value='low-rate'>Lowest Rated</option>
                        <option value='all-customer'>All customer</option>
                        <option value='purchased'>Purchased customer</option>
                    </select>
                </label>
            </div>";
    return $html;
}
function appCartRating($rootLink, $reviews, $i, $colorStar)
{
    $count = 0;
    foreach ($reviews as $review) {
        if ($review['reviewer_rating'] == $i) $count++;
    }

    if (count($reviews) > 0) {
        $progress = ($count / count($reviews)) * 100;
        // $progress = round($count / count($reviews), 1) * 100;
    } else {
        $progress = 0;
    }
    //     <i
    //     class = 'fas fa-star'
    //     style=color:$colorStar
    //   ></i>
    //   <i
    //     class='fas fa-star'
    //     style=color:$colorStar
    //   ></i>
    //   <i
    //     class='fas fa-star'
    //     style=color:$colorStar
    //   ></i>
    //   <i
    //     class='fas fa-star'
    //     style=color:#8c9196
    //   ></i>
    //   <i
    //     class='fas fa-star'
    //     style=color:#8c9196
    //   ></i>
    if ($i == 1) {
        $html = "<li class='item-review-histogram' data-star-filter='" . $i . "star'>
                    <div class='rating-num'><div>
                    <div class=rate>
                    <label style='color:$colorStar'  for=star5 title=text>5 stars</label>
                    <label style='color: #ccc'  for=star4 title=text>4 stars</label>
                    <label  style='color: #ccc' for=star3 title=text>3 stars</label>
                    <label  style='color: #ccc' for=star2 title=text>2 stars</label>
                    <label  style='color: #ccc' for=star1 title=text>1 star</label>
                  </div>
                  </div></div>
                    <div class='ot-progress'>
                        <div class='progress-bar'>
                            <div class='progress-value' style='width:" . $progress . "%'></div>
                        </div>
                    </div>
                    <div class='rating-num-total'>" . $count . "</div>
                </li>";
    }
    if ($i == 2) {
        $html = "<li class='item-review-histogram' data-star-filter='" . $i . "star'>
                    <div class='rating-num'><div>
                    <div class=rate>
                    <label style='color:$colorStar'  for=star5 title=text>5 stars</label>
                    <label style='color:$colorStar'  for=star4 title=text>4 stars</label>
                    <label  style='color: #ccc' for=star3 title=text>3 stars</label>
                    <label  style='color: #ccc' for=star2 title=text>2 stars</label>
                    <label  style='color: #ccc' for=star1 title=text>1 star</label>
                  </div>
                  </div></div>
                    <div class='ot-progress'>
                        <div class='progress-bar'>
                            <div class='progress-value' style='width:" . $progress . "%'></div>
                        </div>
                    </div>
                    <div class='rating-num-total'>" . $count . "</div>
                </li>";
    }
    if ($i == 3) {
        $html = "<li class='item-review-histogram' data-star-filter='" . $i . "star'>
                    <div class='rating-num'><div>
                    <div class=rate>
                    <label style='color:$colorStar'  for=star5 title=text>5 stars</label>
                    <label style='color:$colorStar'  for=star4 title=text>4 stars</label>
                    <label  style='color:$colorStar' for=star3 title=text>3 stars</label>
                    <label  style='color: #ccc' for=star2 title=text>2 stars</label>
                    <label  style='color: #ccc' for=star1 title=text>1 star</label>
                  </div>
                  </div></div>
                    <div class='ot-progress'>
                        <div class='progress-bar'>
                            <div class='progress-value' style='width:" . $progress . "%'></div>
                        </div>
                    </div>
                    <div class='rating-num-total'>" . $count . "</div>
                </li>";
    }
    if ($i == 4) {
        $html = "<li class='item-review-histogram' data-star-filter='" . $i . "star'>
                    <div class='rating-num'><div>
                    <div class=rate>
                    <label style='color:$colorStar'  for=star5 title=text>5 stars</label>
                    <label style='color:$colorStar'  for=star4 title=text>4 stars</label>
                    <label  style='color:$colorStar' for=star3 title=text>3 stars</label>
                    <label  style='color:$colorStar' for=star2 title=text>2 stars</label>
                    <label  style='color: #ccc' for=star1 title=text>1 star</label>
                  </div>
                  </div></div>
                    <div class='ot-progress'>
                        <div class='progress-bar'>
                            <div class='progress-value' style='width:" . $progress . "%'></div>
                        </div>
                    </div>
                    <div class='rating-num-total'>" . $count . "</div>
                </li>";
    }
    if ($i == 5) {
        $html = "<li class='item-review-histogram' data-star-filter='" . $i . "star'>
                    <div class='rating-num'><div>
                    <div class=rate>
                    <label style='color:$colorStar'  for=star5 title=text>5 stars</label>
                    <label style='color:$colorStar'  for=star4 title=text>4 stars</label>
                    <label  style='color:$colorStar' for=star3 title=text>3 stars</label>
                    <label  style='color:$colorStar' for=star2 title=text>2 stars</label>
                    <label  style='color:$colorStar' for=star1 title=text>1 star</label>
                  </div>
                  </div></div>
                    <div class='ot-progress'>
                        <div class='progress-bar'>
                            <div class='progress-value' style='width:" . $progress . "%'></div>
                        </div>
                    </div>
                    <div class='rating-num-total'>" . $count . "</div>
                </li>";
    }
    return $html;
}
function checkPurchase($shopify, $email, $api_version)
{
    $email = trim($email);
    $orders = $shopify("GET", "/admin/api/" . $api_version . "/orders.json");
    $response = 0;
    foreach ($orders as $order) {
        if ($order["financial_status"] == "paid" && $order["email"] == $email) $response = 1;
    }
    return $response;
}
function changeRatingStarStyle($star_style, $color)
{
    $html = '';
    if ($star_style == 0) {
        $html = "
        <div class=rate>
        <label style='color:#ccc'  for=star5 title=text>5 stars</label>
        <label style='color:#ccc'  for=star4 title=text>4 stars</label>
        <label  style='color:#ccc' for=star3 title=text>3 stars</label>
        <label  style='color: #ccc' for=star2 title=text>2 stars</label>
        <label  style='color: #ccc' for=star1 title=text>1 star</label>
      </div>";
    }
    if ($star_style == 1) {
        $html = "
        <div class=rate>
        <label style='color:$color'  for=star5 title=text>5 stars</label>
        <label style='color:#ccc'  for=star4 title=text>4 stars</label>
        <label  style='color:#ccc' for=star3 title=text>3 stars</label>
        <label  style='color: #ccc' for=star2 title=text>2 stars</label>
        <label  style='color: #ccc' for=star1 title=text>1 star</label>
      </div>";
    }

    if ($star_style == 2) {
        $html = "
        <div class=rate>
        <label style='color:$color'  for=star5 title=text>5 stars</label>
        <label style='color:$color'  for=star4 title=text>4 stars</label>
        <label  style='color:#ccc' for=star3 title=text>3 stars</label>
        <label  style='color: #ccc' for=star2 title=text>2 stars</label>
        <label  style='color: #ccc' for=star1 title=text>1 star</label>
      </div>";
    }
    if ($star_style == 3) {
        $html = "
        <div class=rate>
        <label style='color:$color'  for=star5 title=text>5 stars</label>
        <label style='color:$color'  for=star4 title=text>4 stars</label>
        <label  style='color:$color' for=star3 title=text>3 stars</label>
        <label  style='color: #ccc' for=star2 title=text>2 stars</label>
        <label  style='color: #ccc' for=star1 title=text>1 star</label>
      </div>";
    }
    if ($star_style == 4) {
        $html = "
        <div class=rate>
        <label style='color:$color'  for=star5 title=text>5 stars</label>
        <label style='color:$color'  for=star4 title=text>4 stars</label>
        <label  style='color:$color' for=star3 title=text>3 stars</label>
        <label  style='color:$color' for=star2 title=text>2 stars</label>
        <label  style='color: #ccc' for=star1 title=text>1 star</label>
      </div>";
    }
    if ($star_style == 5) {
        $html = "
        <div class=rate>
        <label style='color:$color'  for=star5 title=text>5 stars</label>
        <label style='color:$color'  for=star4 title=text>4 stars</label>
        <label  style='color:$color' for=star3 title=text>3 stars</label>
        <label  style='color:$color' for=star2 title=text>2 stars</label>
        <label  style='color:$color' for=star1 title=text>1 star</label>
      </div>";
    }
    if ($star_style < 1 && $star_style > 0) {  //0.5
        $html = "
        <div class=rate>
        <label style='color:#ccc'  for=star5 title=text><p style='color: $color'></p></label>
        <label style='color:#ccc'  for=star4 title=text>4 stars</label>
        <label  style='color:#ccc' for=star3 title=text>3 stars</label>
        <label  style='color:#ccc' for=star2 title=text>2 stars</label>
        <label  style='color:#ccc' for=star1 title=text>1 star</label>
      </div>";
    }
    if ($star_style > 1 && $star_style < 2) {  //1.5
        $html = "
        <div class=rate>
        <label style='color:$color'  for=star5 title=text>5 stars</label>
        <label style='color:#ccc'  for=star4 title=text><p style='color: $color'></p></label>
        <label  style='color:#ccc' for=star3 title=text>3 stars</label>
        <label  style='color:#ccc' for=star2 title=text>2 stars</label>
        <label  style='color:#ccc' for=star1 title=text>1 star</label>
      </div>";
    }
    if ($star_style > 2 && $star_style < 3) { //2.5
        $html = "
        <div class=rate>
        <label style='color:$color'  for=star5 title=text>5 stars</label>
        <label style='color:$color'  for=star4 title=text>4 stars</label>
        <label  style='color:#ccc' for=star3 title=text><p style='color: $color'></p></label>
        <label  style='color:#ccc' for=star2 title=text>2 stars</label>
        <label  style='color:#ccc' for=star1 title=text>1 star</label>
      </div>";
    }
    if ($star_style > 3 && $star_style < 4) {  //3.5
        $html = "
        <div class=rate>
        <label style='color:$color'  for=star5 title=text>5 stars</label>
        <label style='color:$color'  for=star4 title=text>4 stars</label>
        <label  style='color:$color' for=star3 title=text>3 stars</label>
        <label  style='color:#ccc' for=star2 title=text><p style='color: $color'></p></label>
        <label  style='color:#ccc' for=star1 title=text>1 star</label>
      </div>";
    }
    if ($star_style > 4 && $star_style < 5) {  //3.5
        $html = "
        <div class=rate>
        <label style='color: $color'  for=star5 title=text>5 stars</label>
        <label style='color: $color'  for=star4 title=text>4 stars</label>
        <label  style='color: $color' for=star3 title=text>3 stars</label>
        <label  style='color: $color' for=star2 title=text>2 stars</label>
        <label  style='color:#ccc' for=star1 title=text><p style='color: $color'></p></label>
      </div>";
    }
    // switch ($star_style) {
    //     case 0:
    //         $html = "
    //       <div
    //       style='
    //         display: 'flex';
    //         marginRight: '10px';
    //         width: '80px';
    //         margin: 'auto';
    //       '
    //     >
    //       <i
    //         class='fas fa-star';
    //         style='
    //           color:#8c9196;
    //           marginRight: 2px'
    //       ></i>
    //       <i
    //         class='fas fa-star';
    //         style='
    //           color:#8c9196;
    //           marginRight: 2px'
    //       ></i>
    //       <i
    //         class='fas fa-star';
    //         style='
    //           color:#8c9196;
    //           marginRight: 2px'
    //       ></i>
    //       <i
    //         class='fas fa-star';
    //         style='
    //           color:#8c9196;
    //           marginRight: 2px'
    //       ></i>
    //       <i
    //       class='fas fa-star';
    //       style='
    //         color:#8c9196;
    //         marginRight: 2px'
    //     ></i>
    //     </div>";
    //         break;
    //     case 1:
    //         $html = "
    //     <div
    //     style='
    //       display: 'flex';
    //       marginRight: '10px';
    //       width: '80px';
    //       margin: 'auto';
    //     '
    //   >
    //     <i
    //       class='fas fa-star';
    //       style='
    //         color:" . $color . ";
    //         marginRight: 2px'
    //     ></i>
    //     <i
    //       class='fas fa-star';
    //       style='
    //         color:#8c9196;
    //         marginRight: 2px'
    //     ></i>
    //     <i
    //       class='fas fa-star';
    //       style='
    //         color:#8c9196;
    //         marginRight: 2px'
    //     ></i>
    //     <i
    //       class='fas fa-star';
    //       style='
    //         color:#8c9196;
    //         marginRight: 2px'
    //     ></i>
    //     <i
    //     class='fas fa-star';
    //     style='
    //       color:#8c9196;
    //       marginRight: 2px'
    //   ></i>
    //   </div>";
    //         break;
    //     case 2:
    //         $html = "
    //         <div
    //         style='
    //           display: 'flex';
    //           marginRight: '10px';
    //           width: '80px';
    //           margin: 'auto';
    //         '
    //       >
    //         <i
    //           class='fas fa-star';
    //           style='
    //             color:" . $color . ";
    //             marginRight: 2px'
    //         ></i>
    //         <i
    //           class='fas fa-star';
    //           style='
    //             color:" . $color . ";
    //             marginRight: 2px'
    //         ></i>
    //         <i
    //           class='fas fa-star';
    //           style='
    //             color:#8c9196;
    //             marginRight: 2px'
    //         ></i>
    //         <i
    //           class='fas fa-star';
    //           style='
    //             color:#8c9196;
    //             marginRight: 2px'
    //         ></i>
    //         <i
    //         class='fas fa-star';
    //         style='
    //           color:#8c9196;
    //           marginRight: 2px'
    //       ></i>
    //       </div>";
    //         break;
    //     case 3:
    //         $html = "
    //         <div
    //         style='
    //           display: 'flex';
    //           marginRight: '10px';
    //           width: '80px';
    //           margin: 'auto';
    //         '
    //       >
    //         <i
    //           class='fas fa-star';
    //           style='
    //             color:" . $color . ";
    //             marginRight: 2px'
    //         ></i>
    //         <i
    //           class='fas fa-star';
    //           style='
    //             color:" . $color . ";
    //             marginRight: 2px'
    //         ></i>
    //         <i
    //           class='fas fa-star';
    //           style='
    //             color:" . $color . ";
    //             marginRight: 2px'
    //         ></i>
    //         <i
    //           class='fas fa-star';
    //           style='
    //             color:#8c9196;
    //             marginRight: 2px'
    //         ></i>
    //         <i
    //         class='fas fa-star';
    //         style='
    //           color:#8c9196;
    //           marginRight: 2px'
    //       ></i>
    //       </div>";
    //         break;
    //     case 4:
    //         $html = "
    //     <div
    //     style='
    //       display: 'flex';
    //       marginRight: '10px';
    //       width: '80px';
    //       margin: 'auto';
    //     '
    //   >
    //     <i
    //       class='fas fa-star';
    //       style='
    //         color:" . $color . ";
    //         marginRight: 2px'
    //     ></i>
    //     <i
    //       class='fas fa-star';
    //       style='
    //         color:" . $color . ";
    //         marginRight: 2px'
    //     ></i>
    //     <i
    //       class='fas fa-star';
    //       style='
    //         color:" . $color . ";
    //         marginRight: 2px'
    //     ></i>
    //     <i
    //       class='fas fa-star';
    //       style='
    //         color:" . $color . ";
    //         marginRight: 2px'
    //     ></i>
    //     <i
    //     class='fas fa-star';
    //     style='
    //       color:#8c9196;
    //       marginRight: 2px'
    //   ></i>
    //   </div>";
    //         break;
    //     case 5:
    //         $html = "
    //         <div
    //         style='
    //           display: 'flex';
    //           marginRight: '10px';
    //           width: '80px';
    //           margin: 'auto';
    //         '
    //       >
    //         <i
    //           class='fas fa-star';
    //           style='
    //             color:" . $color . ";
    //             marginRight: 2px'
    //         ></i>
    //         <i
    //           class='fas fa-star';
    //           style='
    //             color:" . $color . ";
    //             marginRight: 2px'
    //         ></i>
    //         <i
    //           class='fas fa-star';
    //           style='
    //             color:" . $color . ";
    //             marginRight: 2px'
    //         ></i>
    //         <i
    //           class='fas fa-star';
    //           style='
    //             color:" . $color . ";
    //             marginRight: 2px'
    //         ></i>
    //         <i
    //         class='fas fa-star';
    //         style='
    //           color:" . $color . ";
    //           marginRight: 2px'
    //       ></i>
    //       </div>";
    // }
    return $html;
    // switch ($color) {
    //     case 1:
    //         $html .= ".ot-customer-reviews .ratingbox span,.ot-customer-reviews .ratingbox div,.ot-customer-reviews .reviews-form .ratingbox span,.ot-customer-reviews .reviews-form .ratingbox div{background-position: 0 0;}
    //                 .ot-product-collection-reviews .ratingbox span,.ot-product-collection-reviews .ratingbox div{background-position: 0 0;}";
    //         break;
    //     case 2:
    //         $html .= ".ot-customer-reviews .ratingbox span,.ot-customer-reviews .ratingbox div{background-position: 0 19%;}
    //                 .ot-customer-reviews .reviews-form .ratingbox span,.ot-customer-reviews .reviews-form .ratingbox div{background-position: 0 20%;}
    //                 .ot-product-collection-reviews .ratingbox span,.ot-product-collection-reviews .ratingbox div{background-position: 0 19%;}";
    //         break;
    //     case 3:
    //         $html .= ".ot-customer-reviews .ratingbox span,.ot-customer-reviews .ratingbox div{background-position: 0 39%;}
    //                 .ot-customer-reviews .reviews-form .ratingbox span,.ot-customer-reviews .reviews-form .ratingbox div{background-position: 0 41%;}
    //                 .ot-product-collection-reviews .ratingbox span,.ot-product-collection-reviews .ratingbox div{background-position: 0 39%;}";
    //         break;
    //     case 4:
    //         $html .= ".ot-customer-reviews .ratingbox span,.ot-customer-reviews .ratingbox div{background-position: 0 59%;}
    //                 .ot-customer-reviews .reviews-form .ratingbox span,.ot-customer-reviews .reviews-form .ratingbox div{background-position: 0 61%;}
    //                 .ot-product-collection-reviews .ratingbox span,.ot-product-collection-reviews .ratingbox div{background-position: 0 59%;}";
    //         break;
    //     case 5:
    //         $html .= ".ot-customer-reviews .ratingbox span,.ot-customer-reviews .ratingbox div{background-position: 0 79%;}
    //                 .ot-customer-reviews .reviews-form .ratingbox span,.ot-customer-reviews .reviews-form .ratingbox div{background-position: 0 82%;}
    //                 .ot-product-collection-reviews .ratingbox span,.ot-product-collection-reviews .ratingbox div{background-position: 0 79%;}";
    // }
    // return $html;
}
function checkCondition($condition1, $condition2)
{
    $html = "";
    if ($condition1 != "") {
        if ($condition1 == '1star') {
            if ($condition2 == 'purchased') $html .= " and reviewer_rating='1' and purchase='1'";
            else $html .= " and reviewer_rating='1'";
        } elseif ($condition1 == '2star') {
            if ($condition2 == 'purchased') $html .= " and reviewer_rating='2' and purchase='1'";
            else $html .= " and reviewer_rating='2'";
        } elseif ($condition1 == '3star') {
            if ($condition2 == 'purchased') $html .= " and reviewer_rating='3' and purchase='1'";
            else $html .= " and reviewer_rating='3'";
        } elseif ($condition1 == '4star') {
            if ($condition2 == 'purchased') $html .= " and reviewer_rating='4' and purchase='1'";
            else $html .= " and reviewer_rating='4'";
        } elseif ($condition1 == '5star') {
            if ($condition2 == 'purchased') $html .= " and reviewer_rating='5' and purchase='1'";
            else $html .= " and reviewer_rating='5'";
        }
    } else {
        if ($condition2 == 'purchased')  $html .= " and purchase='1'";
    }
    return $html;
}
function checkOrderByCondition($condition, $data)
{
    // $html = " ORDER BY ";
    // if ($condition == 'recent' || $condition == 'all-customer') {
    //     $html .= "publishdate DESC";
    // } elseif ($condition == 'helpful') {
    //     $html .= "review_thanked DESC";
    // } elseif ($condition == 'hight-rate') {
    //     $html .= "reviewer_rating DESC";
    // } elseif ($condition == 'low-rate') {
    //     $html .= "reviewer_rating ASC";
    // } else {
    //     $html = "";
    // }
    // return $html;
    switch ($condition) {
        case 'hight-rate': {
                usort($data, function ($a, $b) {
                    return strcmp($a['reviewer_rating'], $b['reviewer_rating']);
                });
                $data = array_reverse($data);
            }
            break;
        case 'low-rate': {
                usort($data, function ($a, $b) {
                    return strcmp($a['reviewer_rating'], $b['reviewer_rating']);
                });
            }
            break;
        case 'helpful': {
                usort($data, function ($a, $b) {
                    return strcmp($a['review_thanked'], $b['review_thanked']);
                });
                $data = array_reverse($data);
            }
            break;
        case 'recent' || 'all-customer': {
                usort($data, function ($a, $b) {
                    $ad = new DateTime($a['publishdate']);
                    $bd = new DateTime($b['publishdate']);
                    if ($ad == $bd) {
                        return 0;
                    }
                    return $ad < $bd ? -1 : 1;
                });
                $data = array_reverse($data);
            }
            break;
    }
    return $data;
}
function genReviewImages($id, $images)
{
    if (count($images) > 0) {
        $html = "<div class='reviewImages'>";
        for ($i = 0; $i < count($images); $i++) {
            $html .= "<a data-lightbox='review-item-" . $id . "' href='" . $images[$i]["url"] . "' target='_blank'><img src='" . $images[$i]["url"] . "'></a>";
        }
        $html .= "</div>";
    } else {
        $html = '';
    }
    return $html;
}
function checkRecommendCustomer($rootLink, $recommend)
{
    if ($recommend == 1) $response = "<div class='reviewRecommend'><img src='" . $rootLink . "/assets/images/recommend.png'> I recommend this!</div>";
    else $response = "<div class='reviewNotRecommend'><img src='" . $rootLink . "/assets/images/no-recommend.png'> I didn't recommend this!</div>";
    return $response;
}
function checkRecommendCustomerMasonryLayout($rootLink, $recommend)
{
    if ($recommend == 1) $response = "<span class='reviewRecommend'><img src='" . $rootLink . "/assets/images/recommend.png' title='I recommend this!'></span>";
    else $response = "";
    return $response;
}
function checkPurchasedCustomer($purchase)
{
    if ($purchase == 1) $response = "<span class='reviewPurchase'>| Verified Purchase</span>";
    else $response = "<span class='reviewNotPurchase'>| Not Purchase</span>";
    return $response;
}
function checkPurchasedCustomerMasonryLayout($rootLink, $purchase)
{
    if ($purchase == 1) $response = "<span class='reviewPurchase'><img src='" . $rootLink . "/assets/images/checked.png' title='Verified Purchase'></span>";
    else $response = "";
    return $response;
}
function averageRatingPoint($reviews)
{
    $avarage = 0;
    foreach ($reviews as $review) {
        $avarage += $review['reviewer_rating'];
    }
    if (count($reviews) > 0) {
        $avarage_point = round($avarage / count($reviews), 1);
    } else {
        $avarage_point = 0;
    }
    return $avarage_point;
}
function displayCountReviews($reviews)
{
    if (count($reviews) <= 1) $count_review = count($reviews) . ' review';
    else $count_review = count($reviews) . ' reviews';

    return $count_review;
}
function publishDateCalculate($datetime)
{
    $diff = abs(time() - strtotime($datetime));
    $years = floor($diff / (365 * 60 * 60 * 24));
    $months = floor(($diff - $years * 365 * 60 * 60 * 24) / (30 * 60 * 60 * 24));
    $days = floor(($diff - $years * 365 * 60 * 60 * 24 - $months * 30 * 60 * 60 * 24) / (60 * 60 * 24));
    $hours = floor(($diff - $years * 365 * 60 * 60 * 24 - $months * 30 * 60 * 60 * 24 - $days * 60 * 60 * 24) / (60 * 60));
    $minutes = floor(($diff - $years * 365 * 60 * 60 * 24 - $months * 30 * 60 * 60 * 24 - $days * 60 * 60 * 24 - $hours * 60 * 60) / 60);
    $seconds = floor(($diff - $years * 365 * 60 * 60 * 24 - $months * 30 * 60 * 60 * 24 - $days * 60 * 60 * 24 - $hours * 60 * 60 - $minutes * 60));
    if ($years == 0 && $months == 0 && $days == 0 && $hours == 0 && $minutes == 0 && $seconds != 0) {
        if ($seconds == 1) $reviewAgo = '1 second ago';
        else $reviewAgo = $seconds . ' seconds ago';
    } elseif ($years == 0 && $months == 0 && $days == 0 && $hours == 0 && $minutes != 0) {
        if ($minutes == 1) $reviewAgo = '1 minute ago';
        else $reviewAgo = $minutes . ' minutes ago';
    } elseif ($years == 0 && $months == 0 && $days == 0 && $hours != 0) {
        if ($hours == 1) $reviewAgo = '1 hour ago';
        else $reviewAgo = $hours . ' hours ago';
    } elseif ($years == 0 && $months == 0 && $days != 0) {
        if ($days == 1) $reviewAgo = '1 day ago';
        else $reviewAgo = $days . ' days ago';
    } elseif ($years == 0 && $months != 0) {
        if ($months == 1) $reviewAgo = '1 month ago';
        else $reviewAgo = $months . ' months ago';
    } elseif ($years != 0) {
        if ($years == 1) $reviewAgo = '1 year ago';
        else $reviewAgo = $years . ' years ago';
    }

    return $reviewAgo;
}
function checkExistBoughtProduct($item, $lists)
{
    $result = 0;
    foreach ($lists as $key => $value) {
        if ($value == $item) {
            $result = 1;
        }
    }
    return $result;
}
function checkReviewBoughtProduct($db, $shop, $id, $email)
{
    $sql = "SELECT id FROM custom_reviews_database WHERE shop = '$shop' and product_id = '$id' and reviewer_email = '$email'";
    $query = $db->query($sql);
    if ($query->num_rows > 0) {
        return false;
    } else {
        return true;
    }
}
