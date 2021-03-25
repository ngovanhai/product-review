// Current Product id

let productIDForReviews =
  __st && __st.p == "product" && __st.rid ? __st.rid : null;
let productReviewCustomer = meta.page.customerId ? meta.page.customerId : null;
let reviewFormUploadedImage = [];
// Star reviews in collection page

if (typeof Shopify.designMode === "undefined") {
  // if (typeof window.otCheckExistFile === "undefined") {
  if (
    typeof window.otCheckExistFile === "undefined" ||
    window.otCheckExistFile == false
  ) {
    otProductReviews();
    window.otCheckExistFile = false;
  }
} else {
  console.log("The Product Reviews App doesn't support in the Design Mode");
}

function otProductReviews() {
  if (jQuery(".ot-product-collection-reviews").length > 0) {
    // jQuery("head").append(`
    //         <link href='${rootlinkProductReview}/assets/css/collection-reviews.css?v=${appProductReviewSettings.ver}' rel='stylesheet' type='text/css'>
    //     `);
    jQuery(".ot-product-collection-reviews").each(function () {
      var product = jQuery(this);
      jQuery.get(
        rootlinkProductReview + "/customerreviews.php",
        {
          action: "getProductReviews",
          shop: ot_product_reviews_shopName,
          productid: product.data("product-id"),
        },
        function (result) {
          if (typeof result == "string") {
            result = JSON.parse(result);
          }
          product.append(result.html);
          if (result.avarage > 0) {
            product.find(".stars-orange").css("width", result.avarage + "%");
            product.find(".reviews-count").text("(" + result.count + ")");
          }
        }
      );
    });
  }

  // Asking customer for a review
  if (productIDForReviews != null) {
    // Product Reviews
    if (
      appProductReviewSettings.insert_code == 1 &&
      jQuery(".ot-customer-reviews").length == 0
    ) {
      jQuery(
        "<div class='" + appProductReviewSettings.class + "'></div>"
      ).insertAfter(appProductReviewSettings.position);
      console.log(appProductReviewSettings.position);
    }
    jQuery.get(
      rootlinkProductReview + "/customerreviews.php",
      {
        action: "getCustomerReviews",
        shop: ot_product_reviews_shopName,
        productid: productIDForReviews,
        customer: productReviewCustomer,
      },
      function (result) {
        if (typeof result == "string") {
          result = JSON.parse(result);
        }
        if ($(".ot-customer-reviews.insert-automatic").length > 0) {
          jQuery(".ot-customer-reviews.insert-automatic").append(result.html);
          if (
            appProductReviewSettings.captcha == "yesCaptcha" &&
            appProductReviewSettings.siteKey !== null &&
            appProductReviewSettings.siteKey !== "" &&
            appProductReviewSettings.secretKey !== null &&
            appProductReviewSettings.secretKey !== ""
          ) {
            let checkExit = document.querySelector("#captcha");
            if (checkExit !== null) {
              checkExit.remove();
            }
            ot__product_reviews_loadCaptcha(appProductReviewSettings.siteKey);
            setTimeout(() => {
              window.grecaptcha.ready(function () {
                try {
                  window.grecaptcha
                    .execute(appProductReviewSettings.siteKey, {
                      action: "contact",
                    })
                    .then(function (token) {
                      var ot_recaptchaResponse = document.getElementById(
                        "ot_recaptchaResponse"
                      );
                      ot_recaptchaResponse.value = token;
                    });
                } catch (err) {}
              });
            }, 1000);
          }
        } else {
          jQuery(".ot-customer-reviews").append(result.html);
          if (
            appProductReviewSettings.captcha == "yesCaptcha" &&
            appProductReviewSettings.siteKey !== null &&
            appProductReviewSettings.siteKey !== "" &&
            appProductReviewSettings.secretKey !== null &&
            appProductReviewSettings.secretKey !== ""
          ) {
            let checkExit = document.querySelector("#captcha");
            if (checkExit !== null) {
              checkExit.remove();
            }
            ot__product_reviews_loadCaptcha(appProductReviewSettings.siteKey);
            setTimeout(() => {
              window.grecaptcha.ready(function () {
                try {
                  window.grecaptcha
                    .execute(appProductReviewSettings.siteKey, {
                      action: "contact",
                    })
                    .then(function (token) {
                      var ot_recaptchaResponse = document.getElementById(
                        "ot_recaptchaResponse"
                      );
                      ot_recaptchaResponse.value = token;
                    });
                } catch (err) {}
              });
            }, 1000);
          }
        }

        // Get filter parameter from URL to filter list
        if (getUrlParameter("filter") != null) {
          jQuery("select.reviews-sort").val(
            getUrlParameter("filter").toString()
          );
          var selectFilter = getUrlParameter("filter");
        } else {
          var selectFilter = "recent";
        }
        if (getUrlParameter("starRating") != null) {
          jQuery(".customer-reviews-col-1 .item-review-histogram").attr(
            "class",
            "item-review-histogram"
          );
          jQuery(".ot-product-star-reviews .item-review-histogram").attr(
            "class",
            "item-review-histogram"
          );
          jQuery(".customer-reviews-col-1 .item-review-histogram").each(
            function () {
              var filterReview = jQuery(this);
              if (
                filterReview.data("star-filter") ==
                getUrlParameter("starRating")
              ) {
                filterReview.addClass(
                  "histogram-filter histogram-filter-" +
                    getUrlParameter("starRating")
                );
              }
            }
          );
        }
        loadReviewContent(getUrlParameter("starRating"), selectFilter);
        globalScript();
      }
    );

    // Product star rating
    if (jQuery(".ot-product-star-reviews").length > 0) {
      jQuery.getScript(
        `${rootlinkProductReview}/layout/productStarReviews.js?v=${appProductReviewSettings.ver_product_star}`
      );
    }
  }
  // Featured reviews badge box
  if (
    appProductReviewSettings.show_notification == 1 &&
    productReviewCustomer != null
  ) {
    jQuery.getScript(
      `${rootlinkProductReview}/layout/lastBoughtProduct.js?v=${appProductReviewSettings.ver_last_bought}`
    );
  }
}
if (appProductReviewSettings.show_box_badge == 1) {
  jQuery.get(
    rootlinkProductReview + "/customerreviews.php",
    {
      action: "featuredReviewsBadgeBox",
      shop: ot_product_reviews_shopName,
    },
    function (result) {
      if (typeof result == "string") {
        result = JSON.parse(result);
      }
      jQuery("body").append("<div class='ot-reviews-box'></div>");
      jQuery(".ot-reviews-box").append(`
            <div class='ot-reviews-box-content ${appProductReviewSettings.position_box_badge}'>
                <div class='ot-reviews-box-score'>
                    <span class='ot-reviews-rating'>${result.avarage_point} (${result.count})</span>
                    <div class='ratingbox'><span class='stars-orange' style='width: ${result.avarage_review}%'></span></div>
                    <div>${appProductReviewSettings.label_box_badge}</div>
                </div>
            </div>    
        `);
    }
  );
}
function loadReviewContent(condition1, condition2) {
  cachedScriptProductReview(
    rootlinkProductReview + "/assets/js/jquery.twbsPagination.min.js"
  ).done(function (script, textStatus) {
    var pages = 0;
    jQuery.get(
      rootlinkProductReview + "/customerreviews.php",
      {
        action: "getTotalPage",
        shop: ot_product_reviews_shopName,
        id: productIDForReviews,
        condition1: condition1,
        condition2: condition2,
      },
      function (result) {
        pages = result;
        if (appProductReviewSettings.app_layout === "3") {
          cachedScriptProductReview(
            rootlinkProductReview + "/assets/js/jquery.masonry.min.js"
          ).done(function (script, textStatus) {
            jQuery(".ot-customer-reviews .reviews-list").imagesLoaded(
              function () {
                jQuery(".ot-customer-reviews .reviews-list").masonry({
                  itemSelector:
                    ".ot-customer-reviews .reviews-list .review-item",
                  columnWidth: function (containerWidth) {
                    return containerWidth / 4;
                  },
                });
              }
            );
          });
        }
        if (pages > 1) {
          if (jQuery("#review_page_navigation").data("twbs-pagination")) {
            jQuery("#review_page_navigation").twbsPagination("destroy");
          }
          jQuery("#review_page_navigation").twbsPagination({
            totalPages: pages,
            visiblePages: 5,
            next: "Next",
            prev: "Prev",
            onPageClick: function (event, page) {
              jQuery.get(
                rootlinkProductReview + "/customerreviews.php",
                {
                  action: "loadReviewContent",
                  shop: ot_product_reviews_shopName,
                  page: page,
                  limit: appProductReviewSettings.reviews_per_page,
                  id: productIDForReviews,
                  condition1: condition1,
                  condition2: condition2,
                },
                function (result) {
                  if (result != "") {
                    jQuery(".customer-reviews-content").css("display", "block");
                    jQuery(".reviews-list").html(result);
                    if (appProductReviewSettings.app_layout === "3") {
                      cachedScriptProductReview(
                        rootlinkProductReview +
                          "/assets/js/jquery.masonry.min.js"
                      ).done(function (script, textStatus) {
                        jQuery(
                          ".ot-customer-reviews .reviews-list"
                        ).imagesLoaded(function () {
                          jQuery(".reviews-list").masonry("reload");
                        });
                      });
                    }
                  } else {
                    jQuery(".reviews-list").html("");
                    jQuery("#review_page_navigation").html("");
                  }
                }
              );
            },
          });
        } else {
          jQuery("#review_page_navigation").html("");
          jQuery.get(
            rootlinkProductReview + "/customerreviews.php",
            {
              action: "loadReviewContent",
              shop: ot_product_reviews_shopName,
              page: 1,
              limit: appProductReviewSettings.reviews_per_page,
              id: productIDForReviews,
              condition1: condition1,
              condition2: condition2,
            },
            function (result) {
              if (result != "") {
                jQuery(".customer-reviews-content").css("display", "block"); //Huy thêm
                jQuery(".reviews-list").html(result);
                if (appProductReviewSettings.app_layout === "3") {
                  cachedScriptProductReview(
                    rootlinkProductReview + "/assets/js/jquery.masonry.min.js"
                  ).done(function (script, textStatus) {
                    jQuery(".ot-customer-reviews .reviews-list").imagesLoaded(
                      function () {
                        jQuery(".reviews-list").masonry("reload");
                      }
                    );
                  });
                }
              } else {
                jQuery(".reviews-list").html("");
              }
            }
          );
        }
      }
    );
  });
}
function globalScript() {
  // Filter theo sao
  var url = window.location.origin + window.location.pathname;
  jQuery(".customer-reviews-col-1 .item-review-histogram").each(function () {
    var filterReview = jQuery(this);
    filterReview.click(function () {
      if (!filterReview.hasClass("histogram-filter")) {
        var condition1 = filterReview.data("star-filter");
        var condition2 = jQuery("select.reviews-sort").val();
        jQuery(".customer-reviews-col-1 .item-review-histogram").attr(
          "class",
          "item-review-histogram"
        );
        jQuery(".ot-product-star-reviews .item-review-histogram").attr(
          "class",
          "item-review-histogram"
        );
        filterReview.addClass(
          "histogram-filter histogram-filter-" + condition1
        );
        jQuery(".ot-product-star-reviews .item-review-histogram").each(
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
        jQuery(".customer-reviews-col-1 .item-review-histogram").attr(
          "class",
          "item-review-histogram"
        );
        jQuery(".ot-product-star-reviews .item-review-histogram").attr(
          "class",
          "item-review-histogram"
        );
        loadReviewContent(null, jQuery("select.reviews-sort").val());
      }
    });
  });

  // Filter theo select
  jQuery(".reviews-sort").on("change", function () {
    if (jQuery(".item-review-histogram.histogram-filter").length > 0) {
      var condition1 = jQuery(".item-review-histogram.histogram-filter").data(
        "star-filter"
      );
      var filterUrl = getFilterUrl(condition1, this.value);
      history.pushState({}, null, url + filterUrl);
      loadReviewContent(condition1, this.value);
    } else {
      var filterUrl = getFilterUrl(null, this.value);
      history.pushState({}, null, url + filterUrl);
      loadReviewContent(null, this.value);
    }
  });

  // Change rating star in review form
  var steps = 5,
    starSize = 120 / steps;
  jQuery(".rating .ratingbox").mousemove(function (e) {
    var ratingboxPos = jQuery(this).offset();
    var span = jQuery(this).children();
    var dif = e.pageX - ratingboxPos.left; // nbr of pixels

    difRatio = Math.floor((dif / 120) * steps) + 1; //step
    span.width(difRatio * starSize);
    jQuery("#reviewer_rating input").val(difRatio);
  });

  // Toggle review button
  jQuery("div.review-button button").click(function () {
    jQuery(".reviews-form").toggle("slow", function () {});
  });

  // Check review form value
  jQuery("#reviewer_mess textarea").keyup(function () {
    var len = jQuery(this).val().length;
    jQuery(".reviewsCounter").text(len);
  });
  cachedScriptProductReview(
    rootlinkProductReview + "/assets/js/jquery.actual.js"
  ).done(function (script, textStatus) {
    var outer = jQuery(".ot-customer-reviews").actual("outerWidth", {
      includeMargin: true,
    });
    if (outer < 768) {
      jQuery(".ot-customer-reviews .customer-reviews-col-1").css(
        "width",
        "100%"
      );
      jQuery(".ot-customer-reviews .customer-reviews-col-2").css(
        "width",
        "100%"
      );
      jQuery(".ot-customer-reviews .review-button").css("float", "none");
    }
  });

  // Images lightbox
  cachedScriptProductReview(
    rootlinkProductReview + "/assets/js/lightbox.min.js"
  ).done(function (script, textStatus) {});

  // Upload image button
  jQuery(".ot-customer-reviews .reviews-form #ot-file-upload-btn").click(
    function () {
      jQuery(".ot-customer-reviews .reviews-form #ot-select-file").trigger(
        "click"
      );
    }
  );
  var input = jQuery(".ot-customer-reviews .reviews-form #ot-select-file");
  input.on("change", function () {
    var file = input.prop("files");
    if (
      file.length >
        parseFloat(appProductReviewSettings.maximum_uploaded_images) ||
      reviewFormUploadedImage.length + file.length >
        parseFloat(appProductReviewSettings.maximum_uploaded_images)
    ) {
      alert(
        "You can upload up to " +
          appProductReviewSettings.maximum_uploaded_images +
          " photos"
      );
      input.val(null);
      showUploadedImagesPreview();
    } else {
      for (var i = 0; i < file.length; i++) {
        reviewFormUploadedImage.push(file[i]);
      }
      showUploadedImagesPreview();
    }
  });
}
function showUploadedImagesPreview() {
  jQuery(".ot-customer-reviews .reviews-form #selected-images").html("");
  for (var i = 0; i < reviewFormUploadedImage.length; i++) {
    jQuery(".ot-customer-reviews .reviews-form #selected-images").append(`
            <li>
                <span class='ot_del_img' onclick='removeUploadedFile(${i})'> x </span>
                <img src='${window.URL.createObjectURL(
                  reviewFormUploadedImage[i]
                )}'>
            </li>
        `);
  }
}
function removeUploadedFile(index) {
  reviewFormUploadedImage.splice(index, 1);
  showUploadedImagesPreview();
}
function submitReview(e) {
  e.preventDefault();
  jQuery(".ot-customer-reviews #submit-review-submit")
    .prop("disabled", true)
    .css("cursor", "default")
    .val("Submitting...");
  if (reviewFormUploadedImage.length > 0) {
    var form = jQuery("#reviewstform")[0];
    var data = new FormData(form);
    for (var i = 0; i < reviewFormUploadedImage.length; i++) {
      data.append("image" + i, reviewFormUploadedImage[i]);
    }
    data.append("uploadReviewImages", ot_product_reviews_shopName);
    data.append("numberOfImages", reviewFormUploadedImage.length);
    cachedScriptProductReview(
      rootlinkProductReview + "/assets/js/axios.min.js"
    ).done(function (script, textStatus) {
      axios
        .post(rootlinkProductReview + "/customerreviews.php", data)
        .then(function (res) {
          saveNewReview(res["data"]["images"], res["data"]["status"]);
        })
        .catch(function (error) {
          alert("Upload images unsuccessful !");
        });
    });
  } else {
    saveNewReview(null, true);
  }
}
function saveNewReview(images, status) {
  if (images != null) {
    var review_images = images;
  } else {
    var review_images = [];
  }
  var reviews = {
    reviewer_name: jQuery(".ot-customer-reviews #reviewer_name input").val(),
    reviewer_title: jQuery(".ot-customer-reviews #reviewer_title input").val(),
    reviewer_email: jQuery(".ot-customer-reviews #reviewer_email input").val(),
    reviewer_mess: jQuery(".ot-customer-reviews #reviewer_mess textarea").val(),
    reviewer_rating: jQuery(
      ".ot-customer-reviews #reviewer_rating input"
    ).val(),
    token: jQuery("#ot_recaptchaResponse").val(),
    secretKey: appProductReviewSettings.secretKey,
    product_recommend: jQuery(
      ".ot-customer-reviews input[name=product_recommend]:checked"
    ).val(),
    review_images: review_images,
    statusImage: status,
    statusCaptcha: appProductReviewSettings.captcha,
  };
  jQuery.post(
    rootlinkProductReview + "/customerreviews.php",
    {
      action: "submitReviewForm",
      shop: ot_product_reviews_shopName,
      productid: productIDForReviews,
      data: reviews,
    },
    function (result) {
      if (result == "success") {
        jQuery(".ot-review-notice-addreview-success").fadeIn(300);
        jQuery(".ot-customer-reviews .reviews-form").fadeOut("slow");
        jQuery(".ot-customer-reviews .review-button").fadeOut("slow");
        loadReviewContent("", "recent");
      }
      if (result == "errorImages") {
        jQuery(".ot-review-notice-addreview-error-images").fadeIn(300);
        jQuery(".ot-customer-reviews #submit-review-submit")
          .prop("disabled", false)
          .css("cursor", "default")
          .val("Submit");
      } else if (result == "fail") {
        jQuery(".ot-review-notice-addreview-error").fadeIn(300);
        jQuery(".ot-customer-reviews .reviews-form").fadeOut("slow");
        jQuery(".ot-customer-reviews .review-button").fadeOut("slow");
      }
    }
  );
}
function getFilterUrl(value1, value2) {
  if (value1 != null) {
    return "?starRating=" + value1 + "&filter=" + value2;
  } else {
    return "?filter=" + value2;
  }
}
function getUrlParameter(sParam) {
  var sPageURL = decodeURIComponent(window.location.search.substring(1)),
    sURLVariables = sPageURL.split("&"),
    sParameterName,
    i;

  for (i = 0; i < sURLVariables.length; i++) {
    sParameterName = sURLVariables[i].split("=");

    if (sParameterName[0] === sParam) {
      return sParameterName[1] === undefined ? true : sParameterName[1];
    } else {
      return null;
    }
  }
}
function voteUpReview(id) {
  var thanked = jQuery("#vote_review_" + id).val();
  jQuery.post(
    rootlinkProductReview + "/customerreviews.php",
    {
      action: "voteUpReview",
      shop: ot_product_reviews_shopName,
      reviewId: id,
      thanked: thanked,
    },
    function (result) {
      jQuery("#vote_review_" + id).val(result);
      if (result == 1) {
        jQuery("#text-success-" + id).text(
          "1 customer thought this review helpful!"
        );
      } else if (result > 1) {
        jQuery("#text-success-" + id).text(
          result + " customers thought this review helpful!"
        );
      }
      jQuery("#reviewLink-question-" + id).text("You thanked this review!");
      jQuery("#review-vote-down-" + id).addClass("hideButton");
      jQuery("#review-vote-up-" + id).addClass("hideButton");
    }
  );
}
function voteDownReview(id) {
  var thanked = jQuery("#vote_review_" + id).val();
  jQuery.post(
    rootlinkProductReview + "/customerreviews.php",
    {
      action: "voteDownReview",
      shop: ot_product_reviews_shopName,
      reviewId: id,
      thanked: thanked,
    },
    function (result) {
      jQuery("#vote_review_" + id).val(result);
      if (result > 1) {
        jQuery("#text-success-" + id).text(
          result + " customers thought this review helpful!"
        );
      } else if (result == 1) {
        jQuery("#text-success-" + id).text(
          "1 customer thought this review helpful!"
        );
      } else if (result == 0) {
        jQuery("#text-success-" + id).text("");
      }
      jQuery("#reviewLink-question-" + id).text("You disliked this review!");
      jQuery("#review-vote-down-" + id).addClass("hideButton");
      jQuery("#review-vote-up-" + id).addClass("hideButton");
      jQuery("#vote_review_" + id).val(result);
    }
  );
}
function voteUpMasonryReview(id) {
  var thanked = jQuery("#vote_review_" + id).val();
  jQuery.post(
    rootlinkProductReview + "/customerreviews.php",
    {
      action: "voteUpReview",
      shop: ot_product_reviews_shopName,
      reviewId: id,
      thanked: thanked,
    },
    function (result) {
      jQuery("#vote_review_" + id).val(result);
      jQuery("#reviewLink-masonry-result-" + id).text("");
      jQuery("#reviewLink-question-" + id).text("You thanked this review!");
      jQuery("#review-vote-down-" + id).addClass("hideButton");
      jQuery("#review-vote-up-" + id).addClass("hideButton");
    }
  );
}
function voteDownMasonryReview(id) {
  var thanked = jQuery("#vote_review_" + id).val();
  jQuery.post(
    rootlinkProductReview + "/customerreviews.php",
    {
      action: "voteDownReview",
      shop: ot_product_reviews_shopName,
      reviewId: id,
      thanked: thanked,
    },
    function (result) {
      jQuery("#vote_review_" + id).val(result);
      jQuery("#reviewLink-masonry-result-" + id).text("");
      jQuery("#reviewLink-question-" + id).text("You disliked this review!");
      jQuery("#review-vote-down-" + id).addClass("hideButton");
      jQuery("#review-vote-up-" + id).addClass("hideButton");
    }
  );
}
function cachedScriptProductReview(url, options) {
  options = jQuery.extend(options || {}, {
    dataType: "script",
    cache: true,
    url: url,
  });
  return jQuery.ajax(options);
}
function ot__product_reviews_loadCaptcha(siteKey) {
  jQuery("head").append(`
    <script src='https://www.google.com/recaptcha/api.js?render=${siteKey}'></script>
    `);
}
