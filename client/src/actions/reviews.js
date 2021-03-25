import axios from "axios";
import { setAlert } from "./alert";
import {
  GET_PRODUCTS_SEARCH,
  GET_PRODUCT_DETAILS,
  PRODUCT_ERROR,
  GET_ALL_COUNT_REVIEWS,
  GET_ALL_COUNT_PRODUCTS,
  GET_ALL_PRODUCTS_DB,
  ADD_REVIEW,
  ADD_REVIEW_COLLECTIONS,
  UPDATE_COUNT_REVIEW_PRODUCT,
  GET_ALL_PUBLISH_REVIEWS,
  GET_ALL_UNPUBLISH_REVIEWS,
  GET_COUNT_PRODUCTS_NO_REVIEWS,
  // DELETE_ALL_REVIEWS,
  PUBLISH_ALL_REVIEWS,
  UN_PUBLISH_ALL_REVIEWS,
  GET_ALL_REVIEWS_BY_PRODUCT_IN_PAGE,
  DELETE_ONE_REVIEW,
  GET_COUNT_REVIEW_BY_PRODUCT,
  RELOAD_REVIEWS,
  SYNC_DATA,
  GET_IMAGE_REVIEWS,
  GET_ALL_REVIEWS_BY_PRODUCT,
  GET_REVIEWS_EDIT,
  EDIT_REVIEW,
  GET_IMAGE_IN_REVIEW,
  DELETE_IMAGE,
  UN_PUBLISH_REVIEW_CHECKED,
  CHANGE_CHECKED_REVIEWS,
  PUBLISH_REVIEW_CHECKED,
  UN_FLAG_REVIEW_CHECKED,
  FLAG_REVIEW_CHECKED,
  DELETE_REVIEWS_CHECKED,
  IMPORT_REVIEWS_EXCEL,
  CHANGE_CHECKED_PRODUCTS,
  PUBLISH_REVIEW_PRODUCTS_CHECKED,
  UN_PUBLISH_REVIEW_PRODUCTS_CHECKED,
  FLAG_REVIEW_PRODUCTS_CHECKED,
  UN_FLAG_REVIEW_PRODUCTS_CHECKED,
  DELETE_REVIEW_PRODUCTS_CHECKED,
  GET_COUNT_PRODUCT_IN_SHOPIFY,
  SYNC_PRODUCTS_SHOPIFY,
  CHANGE_ARR_PRODUCTS_IMPORT,
  RESET_ARR_PRODUCTS_IMPORT,
  DELETE_IMAGE_MULTI_PRODUCTS,
  SYNC_COLLECTIONS,
  GET_VENDOR_PRODUCT,
  LOADING_DATA_TABLE,
  SYNC_PRODUCTS_START,
  GET_TYPE_PRODUCT_SELECT,
  GET_COLLECTIONS_SELECT,
  GET_TYPE_PRODUCT,
  GET_COLLECTIONS,
  LOADING_THEME_DETAIL,
  GET_REVIEWS_EDIT_COLLECTION_TYPE,
  CLEAR_REVIEWS_CHECKED,
  CHANGE_IMAGE,
  RESET_IMAGE,
  // UNSUBSCRIBE_PRODUCT,
} from "../constants/constants";
import config from "../config/config";

// Get all product
const shop = config.shop;

export const getProductsSearch = (
  value,
  offset,
  type,
  vendor,
  tags,
  collectionID,
  productType
) => async (dispatch) => {
  try {
    const res = await axios.get(config.rootLink + "/backend/server.php", {
      params: {
        shop: shop,
        searchProduct: "",
        value: value,
        offset: offset,
        type: type,
        vendor: vendor,
        tags: tags,
        collectionID: collectionID,
        productType: productType,
      },
    });
    dispatch({
      type: GET_PRODUCTS_SEARCH,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PRODUCT_ERROR,
      payload: { msg: err },
    });
    dispatch(setAlert(err.message));
  }
};

export const getCountAllProducts = (
  value,
  type,
  vendor,
  tags,
  collectionID,
  productType
) => async (dispatch) => {
  const res = await axios.get(config.rootLink + "/backend/server.php", {
    params: {
      shop: shop,
      getCountProductSearch: "",
      value: value,
      type: type,
      vendor: vendor,
      tags: tags,
      collectionID: collectionID,
      productType: productType,
    },
  });
  dispatch({
    type: GET_ALL_COUNT_PRODUCTS,
    payload: res.data,
  });
};
export const changeImage = (image) => async (dispatch) => {
  dispatch({
    type: CHANGE_IMAGE,
    payload: image,
  });
};
export const resetImages = () => async (dispatch) => {
  dispatch({
    type: RESET_IMAGE,
  });
};
export const getSyncProductInShopify = (since_id) => async (dispatch) => {
  try {
    const res = await axios.get(config.rootLink + "/backend/server.php", {
      params: {
        shop: shop,
        syncDataToDB: "",
        since_id: since_id,
      },
    });
    dispatch({
      type: SYNC_PRODUCTS_SHOPIFY,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PRODUCT_ERROR,
      payload: { msg: err },
    });
    // dispatch(setAlert(err.message));
  }
};
export const syncDataToDBStart = (since_id) => async (dispatch) => {
  try {
    const res = await axios.get(config.rootLink + "/backend/server.php", {
      params: {
        shop: shop,
        syncDataToDBStart: "",
        since_id: since_id,
      },
    });
    dispatch({
      type: SYNC_PRODUCTS_START,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PRODUCT_ERROR,
      payload: { msg: err },
    });
    // dispatch(setAlert(err.message));
  }
};
export const getVendorProduct = () => async (dispatch) => {
  try {
    const res = await axios.get(config.rootLink + "/backend/server.php", {
      params: {
        shop: shop,
        getVendorProduct: "",
      },
    });
    dispatch({
      type: GET_VENDOR_PRODUCT,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PRODUCT_ERROR,
      payload: { msg: err },
    });
    // dispatch(setAlert(err.message));
  }
};

export const syncCollections = () => async (dispatch) => {
  try {
    const res = await axios.get(config.rootLink + "/backend/server.php", {
      params: {
        shop: shop,
        syncCollections: "",
      },
    });
    dispatch({
      type: SYNC_COLLECTIONS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PRODUCT_ERROR,
      payload: { msg: err },
    });
    // dispatch(setAlert(err.message));
  }
};

export const getImageReviewByProduct = (id) => async (dispatch) => {
  try {
    const res = await axios.get(config.rootLink + "/backend/server.php", {
      params: {
        shop: shop,
        getImageReviewByProduct: "",
        id: id,
      },
    });
    dispatch({
      type: GET_IMAGE_REVIEWS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PRODUCT_ERROR,
      payload: { msg: err },
    });
  }
};
export const getImageInReview = (id) => async (dispatch) => {
  try {
    const res = await axios.get(config.rootLink + "/backend/server.php", {
      params: {
        shop: shop,
        getImageInReview: "",
        id: id,
      },
    });
    dispatch({
      type: GET_IMAGE_IN_REVIEW,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PRODUCT_ERROR,
      payload: { msg: err },
    });
  }
};
export const getCollectionsSelect = () => async (dispatch) => {
  try {
    const res = await axios.get(config.rootLink + "/backend/server.php", {
      params: {
        shop: shop,
        getCollectionsSelect: "",
      },
    });
    dispatch({
      type: GET_COLLECTIONS_SELECT,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PRODUCT_ERROR,
      payload: { msg: err },
    });
  }
};

export const getProductTypeSelect = () => async (dispatch) => {
  try {
    const res = await axios.get(config.rootLink + "/backend/server.php", {
      params: {
        shop: shop,
        getProductTypeSelect: "",
      },
    });
    dispatch({
      type: GET_TYPE_PRODUCT_SELECT,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PRODUCT_ERROR,
      payload: { msg: err },
    });
    // dispatch(setAlert(err.message));
  }
};

export const reload = () => async (dispatch) => {
  dispatch({
    type: RELOAD_REVIEWS,
  });
};
export const reloadTheme = () => async (dispatch) => {
  dispatch({
    type: LOADING_THEME_DETAIL,
  });
};
export const loadDataTable = () => async (dispatch) => {
  dispatch({
    type: LOADING_DATA_TABLE,
  });
};
export const getProductsDetail = (id) => async (dispatch) => {
  try {
    const res = await axios.get(config.rootLink + "/backend/server.php", {
      params: {
        shop: shop,
        getProductsDetail: "",
        id: id,
      },
    });
    dispatch({
      type: GET_PRODUCT_DETAILS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PRODUCT_ERROR,
      payload: { msg: err },
    });
    dispatch(setAlert(err.message));
  }
};
export const getAllReviewProductInPage = (value, id, offset) => async (
  dispatch
) => {
  const res = await axios.get(config.rootLink + "/backend/server.php", {
    params: {
      shop: shop,
      getAllReviewByProductInPage: "",
      id: id,
      offset: offset,
      value: value,
    },
  });
  dispatch({
    type: GET_ALL_REVIEWS_BY_PRODUCT_IN_PAGE,
    payload: res.data,
  });
};
export const getAllReviewProduct = (id) => async (dispatch) => {
  const res = await axios.get(config.rootLink + "/backend/server.php", {
    params: {
      shop: shop,
      getAllReviewByProduct: "",
      id: id,
    },
  });
  dispatch({
    type: GET_ALL_REVIEWS_BY_PRODUCT,
    payload: res.data,
  });
};
export const getReviewEdit = (id) => async (dispatch) => {
  try {
    const res = await axios.get(config.rootLink + "/backend/server.php", {
      params: {
        shop: shop,
        getReviewEdit: "",
        id: id,
      },
    });
    dispatch({
      type: GET_REVIEWS_EDIT,
      payload: res.data,
    });
    dispatch({
      type: GET_REVIEWS_EDIT_COLLECTION_TYPE,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PRODUCT_ERROR,
      payload: { msg: err },
    });
    dispatch(setAlert(err.message));
  }
};
export const getCountProductInShopify = () => async (dispatch) => {
  try {
    const res = await axios.get(config.rootLink + "/backend/server.php", {
      params: {
        shop: shop,
        countProductInShopify: "",
      },
    });
    dispatch({
      type: GET_COUNT_PRODUCT_IN_SHOPIFY,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PRODUCT_ERROR,
      payload: { msg: err },
    });
    dispatch(setAlert(err.message));
  }
};
export const ChangeCheckedReviews = (arr) => async (dispatch) => {
  dispatch({
    type: CHANGE_CHECKED_REVIEWS,
    payload: arr,
  });
};

export const getCountAllReviews = () => async (dispatch) => {
  const res = await axios.get(config.rootLink + "/backend/server.php", {
    params: {
      shop: shop,
      getAllReviews: "",
    },
  });
  dispatch({
    type: GET_ALL_COUNT_REVIEWS,
    payload: res.data,
  });
};

export const getCountReviewByProduct = (value, id) => async (dispatch) => {
  const res = await axios.get(config.rootLink + "/backend/server.php", {
    params: {
      shop: shop,
      getCountReviewByProduct: "",
      id: id,
      value: value,
    },
  });
  dispatch({
    type: GET_COUNT_REVIEW_BY_PRODUCT,
    payload: res.data,
  });
};

export const getAllProductDB = () => async (dispatch) => {
  const res = await axios.get(config.rootLink + "/backend/server.php", {
    params: {
      shop: shop,
      getAllProductDB: "",
    },
  });
  dispatch({
    type: GET_ALL_PRODUCTS_DB,
    payload: res.data,
  });
};
export const getCountProductNoReview = () => async (dispatch) => {
  const res = await axios.get(config.rootLink + "/backend/server.php", {
    params: {
      shop: shop,
      getAllProductDB: "",
    },
  });
  dispatch({
    type: GET_COUNT_PRODUCTS_NO_REVIEWS,
    payload: res.data.filter((e) => e.countReviews === "0").length,
  });
};
export const getPublishReviews = () => async (dispatch) => {
  const res = await axios.get(config.rootLink + "/backend/server.php", {
    params: {
      shop: shop,
      getPublishReviews: "",
    },
  });
  dispatch({
    type: GET_ALL_PUBLISH_REVIEWS,
    payload: res.data,
  });
};
export const getUnPublishReviews = () => async (dispatch) => {
  const res = await axios.get(config.rootLink + "/backend/server.php", {
    params: {
      shop: shop,
      getUnPublishReviews: "",
    },
  });
  dispatch({
    type: GET_ALL_UNPUBLISH_REVIEWS,
    payload: res.data,
  });
};

export const addReviewProducts = (formData) => async (dispatch) => {
  try {
    const res = await axios.post(
      config.rootLink + "/backend/server.php",
      { action: "addReviewProducts", shop: shop, newReview: formData },
      {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          "Content-type": "application/x-www-form-urlencoded",
        },
      }
    );
    dispatch({
      type: ADD_REVIEW,
      payload: res.data,
    });
    dispatch(setAlert("Create review successful!"));
  } catch (err) {
    dispatch({
      type: PRODUCT_ERROR,
      payload: { msg: err },
    });
    dispatch(setAlert(err.message));
  }
};
export const unsubscribeProduct = (formData) => async (dispatch) => {
  try {
    const res = await axios.post(
      config.rootLink + "/backend/server.php",
      { action: "unsubscribeProduct", shop: shop, dataReview: formData },
      {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          "Content-type": "application/x-www-form-urlencoded",
        },
      }
    );
    dispatch(setAlert("Unsubscribe product successful!"));
  } catch (err) {
    dispatch({
      type: PRODUCT_ERROR,
      payload: { msg: err },
    });
    dispatch(setAlert(err.message));
  }
};
export const unsubscribeProductType = (formData) => async (dispatch) => {
  try {
    const res = await axios.post(
      config.rootLink + "/backend/server.php",
      { action: "unsubscribeProductType", shop: shop, dataReview: formData },
      {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          "Content-type": "application/x-www-form-urlencoded",
        },
      }
    );
    dispatch(setAlert("Unsubscribe product type successful!"));
  } catch (err) {
    dispatch({
      type: PRODUCT_ERROR,
      payload: { msg: err },
    });
    dispatch(setAlert(err.message));
  }
};
export const unsubscribeCollection = (formData) => async (dispatch) => {
  try {
    const res = await axios.post(
      config.rootLink + "/backend/server.php",
      { action: "unsubscribeCollection", shop: shop, dataReview: formData },
      {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          "Content-type": "application/x-www-form-urlencoded",
        },
      }
    );
    dispatch(setAlert("Unsubscribe collection successful!"));
  } catch (err) {
    dispatch({
      type: PRODUCT_ERROR,
      payload: { msg: err },
    });
    dispatch(setAlert(err.message));
  }
};
export const subscribeProduct = (formData) => async (dispatch) => {
  try {
    const res = await axios.post(
      config.rootLink + "/backend/server.php",
      { action: "subscribeProduct", shop: shop, dataReview: formData },
      {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          "Content-type": "application/x-www-form-urlencoded",
        },
      }
    );
    dispatch(setAlert("Subscribe product successful!"));
  } catch (err) {
    dispatch({
      type: PRODUCT_ERROR,
      payload: { msg: err },
    });
    dispatch(setAlert(err.message));
  }
};
export const subscribeProductType = (formData) => async (dispatch) => {
  try {
    const res = await axios.post(
      config.rootLink + "/backend/server.php",
      { action: "subscribeProductType", shop: shop, dataReview: formData },
      {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          "Content-type": "application/x-www-form-urlencoded",
        },
      }
    );
    dispatch(setAlert("Subscribe product type successful!"));
  } catch (err) {
    dispatch({
      type: PRODUCT_ERROR,
      payload: { msg: err },
    });
    dispatch(setAlert(err.message));
  }
};
export const subscribeCollection = (formData) => async (dispatch) => {
  try {
    const res = await axios.post(
      config.rootLink + "/backend/server.php",
      { action: "subscribeCollection", shop: shop, dataReview: formData },
      {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          "Content-type": "application/x-www-form-urlencoded",
        },
      }
    );
    dispatch(setAlert("Subscribe collection successful!"));
  } catch (err) {
    dispatch({
      type: PRODUCT_ERROR,
      payload: { msg: err },
    });
    dispatch(setAlert(err.message));
  }
};
export const addReviewCollections = (formData) => async (dispatch) => {
  try {
    const res = await axios.post(
      config.rootLink + "/backend/server.php",
      { action: "addReviewCollections", shop: shop, newReview: formData },
      {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          "Content-type": "application/x-www-form-urlencoded",
        },
      }
    );
    dispatch({
      type: ADD_REVIEW_COLLECTIONS,
      payload: res.data,
    });
    dispatch(setAlert("Create review successful!"));
  } catch (err) {
    dispatch({
      type: PRODUCT_ERROR,
      payload: { msg: err },
    });
    dispatch(setAlert(err.message));
  }
};
export const addReviewProductTypes = (formData) => async (dispatch) => {
  try {
    const res = await axios.post(
      config.rootLink + "/backend/server.php",
      { action: "addReviewProductTypes", shop: shop, newReview: formData },
      {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          "Content-type": "application/x-www-form-urlencoded",
        },
      }
    );
    // dispatch({
    //   type: ADD_REVIEW_PRODUCT_TYPES,
    //   payload: res.data,
    // });
    dispatch(setAlert("Create review successful!"));
  } catch (err) {
    dispatch({
      type: PRODUCT_ERROR,
      payload: { msg: err },
    });
    dispatch(setAlert(err.message));
  }
};
export const editReview = (formData) => async (dispatch) => {
  try {
    const res = await axios.post(
      config.rootLink + "/backend/server.php",
      { action: "submitEditReview", shop: shop, newReview: formData },
      {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          "Content-type": "application/x-www-form-urlencoded",
        },
      }
    );
    dispatch({
      type: EDIT_REVIEW,
      payload: res.data,
    });
    dispatch(setAlert("Edit review successful!"));
  } catch (err) {
    dispatch({
      type: PRODUCT_ERROR,
      payload: { msg: err },
    });
    dispatch(setAlert(err.message));
  }
};
export const updateCountReview = (id) => async (dispatch) => {
  await axios.post(
    config.rootLink + "/backend/server.php",
    { action: "updateCountReview", shop: shop, id: id },
    {
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        "Content-type": "application/x-www-form-urlencoded",
      },
    }
  );
  dispatch({
    type: UPDATE_COUNT_REVIEW_PRODUCT,
  });
};
export const deleteImageProductsChecked = (arr) => async (dispatch) => {
  await axios.post(
    config.rootLink + "/backend/server.php",
    { action: "deleteImageProductsChecked", shop: shop, arrID: arr },
    {
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        "Content-type": "application/x-www-form-urlencoded",
      },
    }
  );
  dispatch({
    type: DELETE_IMAGE_MULTI_PRODUCTS,
  });
};

// export const deleteAllReview = (id) => async (dispatch) => {
//   try {
//     await axios.post(
//       config.rootLink + "/backend/server.php",
//       { action: "deleteAllReview", id: id },
//       {
//         headers: {
//           "X-Requested-With": "XMLHttpRequest",
//           "Content-type": "application/x-www-form-urlencoded",
//         },
//       }
//     );
//     dispatch({
//       type: DELETE_ALL_REVIEWS,
//     });
//     dispatch(setAlert("Delete all reviews successful!"));
//   } catch (err) {
//     dispatch({
//       type: PRODUCT_ERROR,
//       payload: { msg: err },
//     });
//     dispatch(setAlert(err.message));
//   }
// };
export const deleteOneReview = (id) => async (dispatch) => {
  try {
    const res = await axios.post(
      config.rootLink + "/backend/server.php",
      { action: "deleteOneReview", shop: shop, id: id },
      {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          "Content-type": "application/x-www-form-urlencoded",
        },
      }
    );
    dispatch({
      type: DELETE_ONE_REVIEW,
      payload: res.data,
    });
    dispatch(setAlert("Delete review successful!"));
  } catch (err) {
    dispatch({
      type: PRODUCT_ERROR,
      payload: { msg: err },
    });
    dispatch(setAlert(err.message));
  }
};
export const deleteImage = (id) => async (dispatch) => {
  try {
    const res = await axios.post(
      config.rootLink + "/backend/server.php",
      { action: "deleteImage", shop: shop, id: id },
      {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          "Content-type": "application/x-www-form-urlencoded",
        },
      }
    );
    dispatch({
      type: DELETE_IMAGE,
      payload: res.data,
    });
    dispatch(setAlert("Delete image successful!"));
  } catch (err) {
    dispatch({
      type: PRODUCT_ERROR,
      payload: { msg: err },
    });
    dispatch(setAlert(err.message));
  }
};
export const publishAllReview = (id) => async (dispatch) => {
  try {
    await axios.post(
      config.rootLink + "/backend/server.php",
      { action: "publishAllReview", shop: shop, id: id },
      {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          "Content-type": "application/x-www-form-urlencoded",
        },
      }
    );
    dispatch({
      type: PUBLISH_ALL_REVIEWS,
    });
    dispatch(setAlert("Publish all reviews successful!"));
  } catch (err) {
    dispatch({
      type: PRODUCT_ERROR,
      payload: { msg: err },
    });
    dispatch(setAlert(err.message));
  }
};

///////////////////////////////////////////////////
export const unPublishReviewChecked = (arrID) => async (dispatch) => {
  try {
    await axios.post(
      config.rootLink + "/backend/server.php",
      { action: "unPublishReviewChecked", shop: shop, arrID: arrID },
      {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          "Content-type": "application/x-www-form-urlencoded",
        },
      }
    );
    dispatch({
      type: UN_PUBLISH_REVIEW_CHECKED,
    });
    dispatch(setAlert("Un Publish reviews selected successful!"));
  } catch (err) {
    dispatch({
      type: PRODUCT_ERROR,
      payload: { msg: err },
    });
    dispatch(setAlert(err.message));
  }
};
export const publishReviewChecked = (arrID) => async (dispatch) => {
  try {
    await axios.post(
      config.rootLink + "/backend/server.php",
      { action: "publishReviewChecked", shop: shop, arrID: arrID },
      {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          "Content-type": "application/x-www-form-urlencoded",
        },
      }
    );
    dispatch({
      type: PUBLISH_REVIEW_CHECKED,
    });
    dispatch(setAlert("Publish reviews selected successful!"));
  } catch (err) {
    dispatch({
      type: PRODUCT_ERROR,
      payload: { msg: err },
    });
    dispatch(setAlert(err.message));
  }
};
export const unFlagReviewChecked = (arrID) => async (dispatch) => {
  try {
    await axios.post(
      config.rootLink + "/backend/server.php",
      { action: "unFlagReviewChecked", shop: shop, arrID: arrID },
      {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          "Content-type": "application/x-www-form-urlencoded",
        },
      }
    );
    dispatch({
      type: UN_FLAG_REVIEW_CHECKED,
    });
    dispatch(setAlert("Un flag as featured reviews selected successful!"));
  } catch (err) {
    dispatch({
      type: PRODUCT_ERROR,
      payload: { msg: err },
    });
    dispatch(setAlert(err.message));
  }
};
export const flagReviewChecked = (arrID) => async (dispatch) => {
  try {
    await axios.post(
      config.rootLink + "/backend/server.php",
      { action: "flagReviewChecked", shop: shop, arrID: arrID },
      {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          "Content-type": "application/x-www-form-urlencoded",
        },
      }
    );
    dispatch({
      type: FLAG_REVIEW_CHECKED,
    });
    dispatch(setAlert("Flag as featured reviews selected successful!"));
  } catch (err) {
    dispatch({
      type: PRODUCT_ERROR,
      payload: { msg: err },
    });
    dispatch(setAlert(err.message));
  }
};
export const deleteReviewChecked = (arrID) => async (dispatch) => {
  try {
    await axios.post(
      config.rootLink + "/backend/server.php",
      { action: "deleteReviewChecked", shop: shop, arrID: arrID },
      {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          "Content-type": "application/x-www-form-urlencoded",
        },
      }
    );
    dispatch({
      type: DELETE_REVIEWS_CHECKED,
    });
    dispatch(setAlert("Delete reviews selected successful!"));
  } catch (err) {
    dispatch({
      type: PRODUCT_ERROR,
      payload: { msg: err },
    });
    dispatch(setAlert(err.message));
  }
};
/////////////////////////////////////////////
export const unPublishAllReview = (id) => async (dispatch) => {
  try {
    await axios.post(
      config.rootLink + "/backend/server.php",
      { action: "unPublishAllReview", shop: shop, id: id },
      {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          "Content-type": "application/x-www-form-urlencoded",
        },
      }
    );
    dispatch({
      type: UN_PUBLISH_ALL_REVIEWS,
    });
    dispatch(setAlert("Un publish all reviews successful!"));
  } catch (err) {
    dispatch({
      type: PRODUCT_ERROR,
      payload: { msg: err },
    });
    dispatch(setAlert(err.message));
  }
};

export const importReviewExcel = (fd) => async (dispatch) => {
  try {
    await axios.post(config.rootLink + "/backend/server.php", fd, {
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        "Content-type": "multipart/form-data",
      },
    });
    dispatch({
      type: IMPORT_REVIEWS_EXCEL,
    });
    dispatch(setAlert("Import review successful!"));
  } catch (err) {
    dispatch({
      type: PRODUCT_ERROR,
      payload: { msg: err },
    });
    dispatch(setAlert(err.message));
  }
};

///////////////////////////////////////////////////
export const unPublishReviewProductsChecked = (arrID) => async (dispatch) => {
  try {
    await axios.post(
      config.rootLink + "/backend/server.php",
      { action: "unPublishReviewProductsChecked", shop: shop, arrID: arrID },
      {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          "Content-type": "application/x-www-form-urlencoded",
        },
      }
    );
    dispatch({
      type: UN_PUBLISH_REVIEW_PRODUCTS_CHECKED,
    });
    dispatch(
      setAlert("Un Publish all reviews in products selected successful!")
    );
  } catch (err) {
    dispatch({
      type: PRODUCT_ERROR,
      payload: { msg: err },
    });
    dispatch(setAlert(err.message));
  }
};
export const publishReviewProductsChecked = (arrID) => async (dispatch) => {
  try {
    await axios.post(
      config.rootLink + "/backend/server.php",
      { action: "publishReviewProductsChecked", shop: shop, arrID: arrID },
      {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          "Content-type": "application/x-www-form-urlencoded",
        },
      }
    );
    dispatch({
      type: PUBLISH_REVIEW_PRODUCTS_CHECKED,
    });
    dispatch(setAlert("Publish all reviews in products selected successful!"));
  } catch (err) {
    dispatch({
      type: PRODUCT_ERROR,
      payload: { msg: err },
    });
    dispatch(setAlert(err.message));
  }
};
export const unFlagReviewProductsChecked = (arrID) => async (dispatch) => {
  try {
    await axios.post(
      config.rootLink + "/backend/server.php",
      { action: "unFlagReviewProductsChecked", shop: shop, arrID: arrID },
      {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          "Content-type": "application/x-www-form-urlencoded",
        },
      }
    );
    dispatch({
      type: UN_FLAG_REVIEW_PRODUCTS_CHECKED,
    });
    dispatch(
      setAlert(
        "Un flag as featured all reviews in products selected successful!"
      )
    );
  } catch (err) {
    dispatch({
      type: PRODUCT_ERROR,
      payload: { msg: err },
    });
    dispatch(setAlert(err.message));
  }
};
export const flagReviewProductsChecked = (arrID) => async (dispatch) => {
  try {
    await axios.post(
      config.rootLink + "/backend/server.php",
      { action: "flagReviewProductsChecked", shop: shop, arrID: arrID },
      {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          "Content-type": "application/x-www-form-urlencoded",
        },
      }
    );
    dispatch({
      type: FLAG_REVIEW_PRODUCTS_CHECKED,
    });
    dispatch(
      setAlert("Flag as featured all reviews in products selected successful!")
    );
  } catch (err) {
    dispatch({
      type: PRODUCT_ERROR,
      payload: { msg: err },
    });
    dispatch(setAlert(err.message));
  }
};
export const deleteReviewProductsChecked = (arrID) => async (dispatch) => {
  try {
    await axios.post(
      config.rootLink + "/backend/server.php",
      { action: "deleteReviewProductsChecked", shop: shop, arrID: arrID },
      {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          "Content-type": "application/x-www-form-urlencoded",
        },
      }
    );
    dispatch({
      type: DELETE_REVIEW_PRODUCTS_CHECKED,
    });
    dispatch(setAlert("Delete all reviews in products selected successful!"));
  } catch (err) {
    dispatch({
      type: PRODUCT_ERROR,
      payload: { msg: err },
    });
    dispatch(setAlert(err.message));
  }
};
export const changeProductsImport = (arrId) => async (dispatch) => {
  dispatch({
    type: CHANGE_ARR_PRODUCTS_IMPORT,
    payload: arrId,
  });
};
export const ChangeCheckedProducts = (arr) => async (dispatch) => {
  dispatch({
    type: CHANGE_CHECKED_PRODUCTS,
    payload: arr,
  });
};
export const resetProductsImport = () => async (dispatch) => {
  dispatch({
    type: RESET_ARR_PRODUCTS_IMPORT,
  });
};
export const clearArrCheckedReview = () => async (dispatch) => {
  dispatch({
    type: CLEAR_REVIEWS_CHECKED,
  });
};
/////////////////////////////////////////////
