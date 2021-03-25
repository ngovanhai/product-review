import axios from "axios";
import {
  GET_REVIEWS_SEARCH,
  REVIEWS_ERROR,
  GET_IMAGE_REVIEWS_REVIEW_PAGE,
  LOADING_DATA_TABLE_REVIEW,
  GET_ALL_COUNT_REVIEWS_REVIEW_PAGE,
  RELOAD_REVIEWS_REVIEW_PAGE,
  GET_CONNECT_COLLECTION_REVIEWS,
  GET_CONNECT_PRODUCT_TYPE_REVIEWS,
  GET_CONNECT_PRODUCT_REVIEWS,
  GET_REQUEST_SEARCH,
} from "../constants/constants";
import config from "../config/config";
import { setAlert } from "./alert";
const shop = config.shop;
export const searchReview = (
  value,
  offset,
  selected,
  productType,
  vendor,
  collectionID,
  idProduct,
  sort,
  limit
  // productType
) => async (dispatch) => {
  try {
    const res = await axios.get(config.rootLink + "/backend/server.php", {
      params: {
        shop: shop,
        searchReview: "",
        value: value,
        offset: offset,
        selected: selected,
        productType: productType,
        vendor: vendor,
        collectionID: collectionID,
        idProduct: idProduct,
        sort: sort,
        limit: limit,
        // productType: productType,
      },
    });
    dispatch({
      type: GET_REVIEWS_SEARCH,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: REVIEWS_ERROR,
      payload: { msg: err },
    });
    dispatch(setAlert(err.message));
  }
};
export const searchRequest = (
  value,
  offset,
  selected,
  productType,
  vendor,
  // tags,
  collectionID,
  idProduct,
  sort,
  limit
  // productType
) => async (dispatch) => {
  try {
    const res = await axios.get(config.rootLink + "/backend/server.php", {
      params: {
        shop: shop,
        searchRequest: "",
        value: value,
        offset: offset,
        selected: selected,
        productType: productType,
        vendor: vendor,
        // tags: tags,
        collectionID: collectionID,
        idProduct: idProduct,
        sort: sort,
        limit: limit,
        // productType: productType,
      },
    });
    dispatch({
      type: GET_REQUEST_SEARCH,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: REVIEWS_ERROR,
      payload: { msg: err },
    });
    dispatch(setAlert(err.message));
  }
};
export const getCountAllReview = (
  value,
  selected,
  productType,
  vendor,
  collectionID,
  idProduct
) => async (dispatch) => {
  const res = await axios.get(config.rootLink + "/backend/server.php", {
    params: {
      shop: shop,
      getCountAllReviewSearch: "",
      value: value,
      selected: selected,
      productType: productType,
      vendor: vendor,
      collectionID: collectionID,
      idProduct: idProduct,
    },
  });
  dispatch({
    type: GET_ALL_COUNT_REVIEWS_REVIEW_PAGE,
    payload: res.data,
  });
};
export const getCountAllRequest = (
  value,
  selected,
  productType,
  vendor,
  tags,
  collectionID,
  idProduct
) => async (dispatch) => {
  const res = await axios.get(config.rootLink + "/backend/server.php", {
    params: {
      shop: shop,
      getCountAllRequest: "",
      value: value,
      selected: selected,
      productType: productType,
      vendor: vendor,
      tags: tags,
      collectionID: collectionID,
      idProduct: idProduct,
    },
  });
  dispatch({
    type: GET_ALL_COUNT_REVIEWS_REVIEW_PAGE,
    payload: res.data,
  });
};
export const loadDataTable = () => async (dispatch) => {
  dispatch({
    type: LOADING_DATA_TABLE_REVIEW,
  });
};
export const getImageReview = (id) => async (dispatch) => {
  try {
    const res = await axios.get(config.rootLink + "/backend/server.php", {
      params: {
        shop: shop,

        getImageReview: "",
        id: id,
      },
    });
    dispatch({
      type: GET_IMAGE_REVIEWS_REVIEW_PAGE,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: REVIEWS_ERROR,
      payload: { msg: err },
    });
  }
};

export const reloadListReview = () => async (dispatch) => {
  dispatch({
    type: RELOAD_REVIEWS_REVIEW_PAGE,
  });
};
export const getConnectCollectionReviews = () => async (dispatch) => {
  try {
    const res = await axios.get(config.rootLink + "/backend/server.php", {
      params: {
        shop: shop,
        getConnectCollectionReviews: "",
      },
    });
    dispatch({
      type: GET_CONNECT_COLLECTION_REVIEWS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: REVIEWS_ERROR,
      payload: { msg: err },
    });
  }
};
export const getConnectProductTypeReviews = () => async (dispatch) => {
  try {
    const res = await axios.get(config.rootLink + "/backend/server.php", {
      params: {
        shop: shop,
        getConnectProductTypeReviews: "",
      },
    });
    dispatch({
      type: GET_CONNECT_PRODUCT_TYPE_REVIEWS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: REVIEWS_ERROR,
      payload: { msg: err },
    });
  }
};
export const getConnectProductReviews = () => async (dispatch) => {
  try {
    const res = await axios.get(config.rootLink + "/backend/server.php", {
      params: {
        shop: shop,
        getConnectProductReviews: "",
      },
    });
    dispatch({
      type: GET_CONNECT_PRODUCT_REVIEWS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: REVIEWS_ERROR,
      payload: { msg: err },
    });
  }
};
