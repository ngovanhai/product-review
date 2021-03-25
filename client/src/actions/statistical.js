import axios from "axios";
import { setAlert } from "./alert";
import {
  QUERY_ERROR_STATISTICAL,
  GET_ALL_COUNT_REVIEWS_STATISTICAL,
  GET_ALL_PUBLISH_REVIEWS_STATISTICAL,
  GET_ALL_UNPUBLISH_REVIEWS_STATISTICAL,
  GET_COUNT_PRODUCTS_NO_REVIEWS_STATISTICAL,
  GET_COUNT_PRODUCT_IN_SHOPIFY_STATISTICAL,
  GET_TYPE_PRODUCT_STATISTICAL,
  GET_COLLECTIONS_STATISTICAL,
  GET_RATING_STATISTICAL,
  GET_REVIEWS_PLACE_STATISTICAL,
} from "../constants/constants";
import config from "../config/config";
const shop = config.shop;

export const getProductType = () => async (dispatch) => {
  try {
    const res = await axios.get(config.rootLink + "/backend/server.php", {
      params: {
        shop: shop,
        getProductType: "",
      },
    });
    dispatch({
      type: GET_TYPE_PRODUCT_STATISTICAL,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: QUERY_ERROR_STATISTICAL,
      payload: { msg: err },
    });
    // dispatch(setAlert(err.message));
  }
};
export const getStaticalReviewPublish = () => async (dispatch) => {
  try {
    const res = await axios.get(config.rootLink + "/backend/server.php", {
      params: {
        shop: shop,
        getStaticalReviewPublish: "",
      },
    });
    dispatch({
      type: GET_RATING_STATISTICAL,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: QUERY_ERROR_STATISTICAL,
      payload: { msg: err },
    });
    // dispatch(setAlert(err.message));
  }
};
export const getStaticalReviewPlace = () => async (dispatch) => {
  try {
    const res = await axios.get(config.rootLink + "/backend/server.php", {
      params: {
        shop: shop,
        getStaticalReviewPlace: "",
      },
    });
    dispatch({
      type: GET_REVIEWS_PLACE_STATISTICAL,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: QUERY_ERROR_STATISTICAL,
      payload: { msg: err },
    });
    // dispatch(setAlert(err.message));
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
      type: GET_COLLECTIONS_STATISTICAL,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: QUERY_ERROR_STATISTICAL,
      payload: { msg: err },
    });
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
      type: GET_COUNT_PRODUCT_IN_SHOPIFY_STATISTICAL,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: QUERY_ERROR_STATISTICAL,
      payload: { msg: err },
    });
    dispatch(setAlert(err.message));
  }
};

export const getCountAllReviews = () => async (dispatch) => {
  const res = await axios.get(config.rootLink + "/backend/server.php", {
    params: {
      shop: shop,
      getAllReviews: "",
    },
  });
  dispatch({
    type: GET_ALL_COUNT_REVIEWS_STATISTICAL,
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
    type: GET_COUNT_PRODUCTS_NO_REVIEWS_STATISTICAL,
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
    type: GET_ALL_PUBLISH_REVIEWS_STATISTICAL,
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
    type: GET_ALL_UNPUBLISH_REVIEWS_STATISTICAL,
    payload: res.data,
  });
};

/////////////////////////////////////////////
