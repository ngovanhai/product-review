var timeLoop,
  timeDisplay,
  count,
  boughtProducts,
  arrayIndex = 0;
jQuery.get(
  rootlinkProductReview + "/customerreviews.php",
  {
    action: "lastBoughtProductReview",
    shop: ot_product_reviews_shopName,
    customerId: productReviewCustomer,
    numberBoughtProduct: appProductReviewSettings.numberBoughtProduct,
  },
  function (result) {
    if (typeof result == "string") {
      result = JSON.parse(result);
    }
    if (result.length > 0) {
      jQuery("body").append("<div class='ot-last-bought-product'></div>");
      jQuery("head").append(`
            <link href='${rootlinkProductReview}/assets/css/animate.min.css' rel='stylesheet'>
        `);
      timeDisplay = parseFloat(appProductReviewSettings.timeDisplay) * 1000;
      timeLoop =
        parseFloat(appProductReviewSettings.timeLoop) * 1000 + timeDisplay;
      boughtProducts = result;
      count = result.length;
      startLastBoughtNotification = setInterval(
        showLastBoughtProduct,
        timeLoop
      );
    }
  }
);

function showLastBoughtProduct() {
  jQuery(".ot-last-bought-product").empty();
  if (boughtProducts[arrayIndex].image.src != "")
    var imageurl = boughtProducts[arrayIndex].image.src;
  else var imageurl = rootlinkProductReview + "/assets/images/no-image.png";
  if (appProductReviewSettings.notification_position == "left_top") {
    var cssLayout =
      ".wrapper_lastBought{top:0;left:0;margin-top: 15px;box-shadow:2px -2px 20px 0px rgba(0, 0, 0, 0.49);}";
  } else if (appProductReviewSettings.notification_position == "right_top") {
    var cssLayout =
      ".wrapper_lastBought{top:0;right:0;margin-top: 15px;box-shadow:2px -2px 20px 0px rgba(0, 0, 0, 0.49);}";
  } else if (appProductReviewSettings.notification_position == "right_bottom") {
    var cssLayout =
      ".wrapper_lastBought{bottom:0;right:0;margin-bottom: 15px;box-shadow:2px 2px 20px 0 rgba(0, 0, 0, 0.49);}";
  } else {
    var cssLayout =
      ".wrapper_lastBought{bottom:0;left:0;margin-bottom: 15px;box-shadow:2px 2px 20px 0 rgba(0, 0, 0, 0.49);}";
  }
  jQuery(".ot-last-bought-product").append(`
        <style>
            .reviewLastBought a,.reviewLastBought a:hover,.reviewLastBought a:focus {background:${appProductReviewSettings.writeareview_bgcolor};color:${appProductReviewSettings.writeareview_textcolor};}
            ${cssLayout}
            .wrapper_lastBought{display:none;position: fixed;}
        </style>
        <script type='text/javascript'>
            if(jQuery('.wrapper_lastBought').hasClass('animated')){
                jQuery('.wrapper_lastBought').show();
            }
        </script>
        <div id='lastbought-overlay-wrap'>
            <div class='wrapper_lastBought animated ${appProductReviewSettings.effect_display}'>
                <div class='lastBoughtImg'>
                    <a href='https://${ot_product_reviews_shopName}/products/${boughtProducts[arrayIndex].handle}'><img src='${imageurl}' alt='${boughtProducts[arrayIndex].title}'></a>
                </div>
                <div class='lastBoughtContent'>
                    <div class='closeLastBoughtPopup'><a href='javascript:void(0)' onclick='closeLastBoughtPopup()'>X</a></div>
                    <h4>${appProductReviewSettings.notification_label}</h4>
                    <h3>${boughtProducts[arrayIndex].title}</h3>
                    <div class='reviewLastBought'><a target='_blank' href='https://${ot_product_reviews_shopName}/products/${boughtProducts[arrayIndex].handle}'>${appProductReviewSettings.writeareview_label}</a></div>
                </div>
            </div>
        </div>
    `);

  setTimeout(() => {
    jQuery(".wrapper_lastBought")
      .removeClass(appProductReviewSettings.effect_display)
      .addClass(appProductReviewSettings.effect_hidden);
  }, timeDisplay);
  arrayIndex++;
  if (arrayIndex == count) {
    clearInterval(startLastBoughtNotification);
  }
}

function closeLastBoughtPopup() {
  jQuery(".wrapper_lastBought")
    .removeClass(appProductReviewSettings.effect_display)
    .addClass(appProductReviewSettings.effect_hidden);
  clearInterval(startLastBoughtNotification);
  jQuery(".wrapper_lastBought").hide();
}
