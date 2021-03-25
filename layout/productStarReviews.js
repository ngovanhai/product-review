jQuery.get(
  rootlinkProductReview + "/customerreviews.php",
  {
    action: "getProductStarReviews",
    shop: ot_product_reviews_shopName,
    productid: productIDForReviews,
  },
  function (result) {
    if (typeof result == "string") {
      result = JSON.parse(result);
    }

    // Append layout
    if (appProductReviewSettings.star_style == 1) {
      var starStyle =
        ".ot-product-star-reviews .ratingbox span,.ot-product-star-reviews .ratingbox div{background-position: 0 0;}";
    } else if (appProductReviewSettings.star_style == 2) {
      var starStyle =
        ".ot-product-star-reviews .ratingbox span,.ot-product-star-reviews .ratingbox div{background-position: 0 19%;}";
    } else if (appProductReviewSettings.star_style == 3) {
      var starStyle =
        ".ot-product-star-reviews .ratingbox span,.ot-product-star-reviews .ratingbox div{background-position: 0 39%;}";
    } else if (appProductReviewSettings.star_style == 4) {
      var starStyle =
        ".ot-product-star-reviews .ratingbox span,.ot-product-star-reviews.ratingbox div{background-position: 0 59%;}";
    } else if (appProductReviewSettings.star_style == 5) {
      var starStyle =
        ".ot-product-star-reviews .ratingbox span,.ot-product-star-reviews .ratingbox div{background-position: 0 79%;}";
    }
    jQuery(".ot-product-star-reviews").append(`
          <style>    
              ${starStyle}
          </style>
          <div class='ratingbox'>
              <span class='stars-orange' style='width: ${result.avarage_review}%'></span>
          </div>
          <div class='review-title-histogram'>
              <div class='review-title-histogram-inner'>
                  <div class='total-review-point'>${result.avarage_point} out of 5 stars</div>
                  <ul class='review-list-histogram'>
                      ${result.html}
                  </ul>
              </div>
          </div>
      `);
    productStarScript();
  }
);

function productStarScript() {
  var url = window.location.origin + window.location.pathname;

  if (getUrlParameter("starRating") != null) {
    jQuery(".ot-product-star-reviews .item-review-histogram").each(function () {
      var filterReview = jQuery(this);
      if (filterReview.data("star-filter") == getUrlParameter("starRating")) {
        filterReview.addClass(
          "histogram-filter histogram-filter-" + getUrlParameter("starRating")
        );
      }
    });
  }

  jQuery(".ot-product-star-reviews .item-review-histogram").each(function () {
    var filterReview = jQuery(this);
    filterReview.on("click", function () {
      if (!filterReview.hasClass("histogram-filter")) {
        var condition1 = filterReview.data("star-filter");
        var condition2 = jQuery("select.reviews-sort").val();
        jQuery(".ot-product-star-reviews .item-review-histogram").attr(
          "class",
          "item-review-histogram"
        );
        jQuery(".customer-reviews-col-2 .item-review-histogram").attr(
          "class",
          "item-review-histogram"
        );
        filterReview.addClass(
          "histogram-filter histogram-filter-" + condition1
        );
        jQuery(".customer-reviews-col-2 .item-review-histogram").each(
          function () {
            if (jQuery(this).data("star-filter") == condition1) {
              jQuery(this).addClass(
                "histogram-filter histogram-filter-" + condition1
              );
            }
          }
        );
        var filterUrl = getFilterUrl(
          filterReview.data("star-filter"),
          jQuery("select.reviews-sort").val()
        );
        history.pushState({}, null, url + filterUrl);
        loadReviewContent(condition1, condition2);
      } else {
        var filterUrl = getFilterUrl(null, jQuery("select.reviews-sort").val());
        history.pushState({}, null, url + filterUrl);
        jQuery(".ot-product-star-reviews .item-review-histogram").attr(
          "class",
          "item-review-histogram"
        );
        jQuery(".customer-reviews-col-2 .item-review-histogram").attr(
          "class",
          "item-review-histogram"
        );
        loadReviewContent(null, jQuery("select.reviews-sort").val());
      }
      jQuery("html, body").animate(
        {
          scrollTop: jQuery("div.ot-customer-reviews").offset().top,
        },
        1000
      );
    });
  });
}
