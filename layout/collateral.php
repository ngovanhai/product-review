<?php
$count_review = displayCountReviews($allReviews);
$avarage_point = averageRatingPoint($allReviews);
$avarage_review = ($avarage_point / 5) * 100;
$html .= "<link rel='stylesheet' type='text/css' href='" . $rootLink . "/assets/css/layout-collateral.css?v=" . time() . "' />
        <h2 class='reviews-header-title'>" . sprintf($settings['reviews_title'], $productname) . "</h2>
        <div class='review-button'>
            <button type='button' class='btn btn-default'>" . $settings["form_button"] . "</button>
        </div>";
if (count($allReviews) == 0) {
    $html .= "<div class='ot-review-notice-no-review'>No review yet</div>";
}
$html .= genReviewFormLayoutCollateral($shop, $settings)
    . "<div class='ot-review-notice-addreview-success'>" . testOutputData($settings["submit_mess"]) . "</div>
        <div class='ot-review-notice-addreview-error'>" . testOutputData($settings["submit_error_mess"]) . "</div>";
if (count($allReviews) > 0) {
    $html .= "<div class='customer-reviews-summary'>
    <div class='customer-reviews-col-1'>
    <div class='header_rating'>
    <div
                        class = 'box-average'
                      style=
                        'background:" . $settings['progress_color'] . "'
                    >
      <h1 class = 'text_inbox' >" . $avarage_point . "</h1>
    </div>
    <div
    class='text_base_on'
    >
      <p>Base on " . $count_review . "</p>
    </div>
  </div>
  <div class='review-histogram'>
  <ul class='review-list-histogram'>";
    for ($i = 5; $i > 0; $i--) {
        $html .= appCartRating($rootLink, $allReviews, $i, $settings['star_style']);
    }
    $html .= "</ul>
</div>
  </div>

    </div>
    <div class='customer-reviews-col-2'>
    
</div>";
}
$html .= "<div class='customer-reviews-content'>
            <div class='ot-reviews'>"
    . genFilterForm()
    . "<div class='reviews-list'>
                </div>
                <ul id='review_page_navigation' class='pagination-custom'></ul>
            </div>
        </div>";

function genReviewFormLayoutCollateral($shop, $settings)
{
    $html = "<div class='reviews-form'>
                <form role='form' enctype='multipart/form-data' id='reviewstform' method='post' name='reviewstform' onsubmit='submitReview(event);return false;'>
                    <div class='reviews-information'>
                        <div class='reviews-form-col-1'>
                            <div id='reviewer_name'>
                                <label>" . $settings["form_author"] . "<span class='star'>&nbsp;*</span></label>
                                <input type='text' name='reviewer_name' placeholder='" . $settings["form_author_desc"] . "' required>
                            </div>
                            <div id='reviewer_email'>
                            <label>" . $settings["form_email"] . "<span class='star'>&nbsp;*</span></label>
                            <input type='email' name='reviewer_email' placeholder='" . $settings["form_email"] . "' required>
                        </div>
                            <div id='reviewer_rating'>
                                <label>" . $settings["form_rating"] . "</label>
                                <div class='rating'>
                                    <label for='vote'>
                                        <span class='ratingbox' style='display:inline-block;'>
                                            <span class='stars-orange'></span>
                                        </span>
                                    </label>
                                    <input type='hidden' value='1' name='reviewer_rating'>
                                </div>
                            </div>
                          
                        </div>
                        <div class='reviews-form-col-2'>
                            <div id='reviewer_title'>
                                <label>" . $settings["form_title"] . "<span class='star'>&nbsp;*</span></label>
                                <input type='text' name='reviewer_title' placeholder='" . $settings["form_title"] . "' required>
                            </div>
                           
                            <div id='reviewer_mess'>
                                <label>" . $settings["form_review"] . "<span class='star'>&nbsp;*</span> <span style='font-size:12px;color:#999;'>(<span class='reviewsCounter'>0</span>/" . $settings["maximum_reviews"] . " char.)</span></label>
                                <textarea name='reviewer_mess' maxlength='" . $settings["maximum_reviews"] . "' placeholder='" . $settings["form_review_desc"] . "' required></textarea>
                            </div>
                            <div id='reviewer_recommend'>
<label>" . $settings["form_recommend"] . "</label>
<input type='radio' name='product_recommend' value='1' checked> " . $settings["text_agree"] . " <input type='radio' name='product_recommend' value='0'> " . $settings["text_decline"] . "
</div>
                        </div>
                    </div>
                    <div id='reviewer_images'>
                        <span id='ot-file-upload-btn'>" . $settings["form_upload"] . "</span>
                        <input id='ot-select-file' type='file' name='' style='display: none;' accept='image/*' multiple />
                        <ul id='selected-images'></ul>
                        <div class='ot-review-notice-addreview-error-images'><i class='fas fa-exclamation' style='margin-right:10px'></i>Uploaded images should be less than 1MB - One of the pictures above is larger than 1MB !</div>

                    </div>
                    <div id='reviewer_submit'>
                        <input type='submit' id='submit-review-submit' name='reviewer_submit' value='" . $settings["form_button_submit"] . "'>
                    </div>
                </form>
            </div>";
    return $html;
}
