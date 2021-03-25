let appProductReviewSettings;
let ot_product_reviews_shopName = Shopify.shop;
let rootlinkProductReview = "https://apps.omegatheme.com/customer-reviews";
if (typeof omgProductReview_checkJS == "undefined") {
  var omgProductReview_checkJS = 1;
  if (typeof $ == "undefined") {
    javascript: (function (e, s) {
      e.src = s;
      e.onload = function () {
        $ = jQuery.noConflict();
        ot_product_reviews_init();
      };
      document.head.appendChild(e);
    })(
      document.createElement("script"),
      "https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"
    );
  } else {
    ot_product_reviews_init();
  }

  async function ot_product_reviews_init() {
    appProductReviewSettings = await ot_product_reviews_getGeneralSettings();

    if (appProductReviewSettings) {
      ot_product_reviews_loadFile();
    }
  }

  // -----------------Fetch Settings-------------------
  function ot_product_reviews_getGeneralSettings() {
    return new Promise((resolve) => {
      jQuery
        .ajax({
          url: `${rootlinkProductReview}/customerreviews.php`,
          type: "GET",
          data: {
            shop: ot_product_reviews_shopName,
            action: "getShopSettings",
          },
          dataType: "json",
        })
        .done((result) => {
          if (!result.expired) {
            resolve(result.settings);
          } else {
            resolve(null);
          }
        });
    });
  }
  // ----------------End Fetch Settings-----------------
  //   <link href='${rootlinkProductReview}/assets/css/customerreviews.css?v=${appProductReviewSettings.ver}' rel='stylesheet' type='text/css'>
  // jQuery.getScript(
  //   `${rootlinkProductReview}/app.js?v=${appProductReviewSettings.ver}`
  // );
  // -------------------------- Load file -------------------------
  function ot_product_reviews_loadFile() {
    let ver = new Date();
    jQuery("head").append(`
        <link href='${rootlinkProductReview}/assets/css/lightbox.min.css?v=${ver.getTime()}' rel='stylesheet'>
        <link href='${rootlinkProductReview}/assets/css/customerreviews.css?v=${ver.getTime()}' rel='stylesheet' type='text/css'>
        <link href="${rootlinkProductReview}/client/public/icons/css/all.css?v=${ver.getTime()}" rel="stylesheet" type='text/css'>

    `);
    jQuery.getScript(`${rootlinkProductReview}/app.js?v=${ver.getTime()}`);
  }

  // ------------------------ End load file -----------------------

  // function omgProductReview_cachedScript(url, options) {
  //     options = $.extend(options || {}, {
  //         dataType: "script",
  //         cache: true,
  //         url: url
  //     });
  //     return $.ajax(options);
  // }
}
