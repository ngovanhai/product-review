const getUrlParameterJson = function getUrlParameterJson() {
  var search = window.location.search.substring(1);
  if (search !== "") {
    var urlParams = JSON.parse(
      '{"' + search.replace(/&/g, '","').replace(/=/g, '":"') + '"}',
      function (key, value) {
        return key === "" ? value : decodeURIComponent(value);
      }
    );
    localStorage.setItem("platform", urlParams.platform);
    localStorage.setItem("payload", urlParams.payload);
    localStorage.setItem("website_name", urlParams.website_name);
    localStorage.setItem("url_params", urlParams.urlParams);
    return JSON.stringify(urlParams);
  }
};

const config = {
  // rootLink: "https://hai.omegatheme.com/customer-reviews",
  rootLink: "https://localhost/product-reviews-react",
  // pathName: "/customer-reviews/client/build",
  pathName: "",
  // shop: window.location.href.split("?shop=")[1],
  shop: "ngo-van-hai.myshopify.com",
  appName: "Product Reviews",
  liveAppUrl: "https://apps.shopify.com/customer-reviews-by-omega",
  urlParams: getUrlParameterJson(),
};

export default config;
