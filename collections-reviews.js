var rootlinkProductReviewForCollection =
  "https://apps.omegatheme.com/customer-reviews";
jQuery(".ot-product-collection-reviews").each(function () {
  var e,
    t = jQuery(this);
  (e = t.data("product-id")
    ? t.data("product-id")
    : t.find(".productId").val()),
    jQuery.get(
      rootlinkProductReviewForCollection + "/customerreviews.php",
      { action: "getProductReviews", shop: Shopify.shop, productid: e },
      function (e) {
        "string" == typeof e && (e = JSON.parse(e)),
          0 == e.expired && t.append(e.html);
      }
    );
});
