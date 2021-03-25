import axios from "axios";
import { setAlert } from "./alert";
import {
  PRODUCT_TYPES_ERROR,
  RELOAD_PRODUCT_TYPES,
  LOADING_DATA_TABLE_PRODUCT_TYPES,
  GET_TYPE_PRODUCT,
  CHANGE_CHECKED_PRODUCT_TYPES,
  GET_ARR_PRODUCT_TYPES_IMPORT,
  CHANGE_CHECKED_PRODUCT_TYPES_IMPORT,
  CLEAR_DATA_IMPORT_PRODUCT_TYPE,
  GET_COUNT_TYPE_PRODUCT,
} from "../constants/constants";
import config from "../config/config";
const shop = config.shop;
export const changeCheckedProductTypes = (arr) => async (dispatch) => {
  dispatch({
    type: CHANGE_CHECKED_PRODUCT_TYPES,
    payload: arr,
  });
};

export const getProductType = (value, offset, selected) => async (dispatch) => {
  try {
    const res = await axios.get(config.rootLink + "/backend/server.php", {
      params: {
        shop: shop,
        getProductType: "",
        value: value,
        offset: offset,
        selected: selected,
      },
    });
    dispatch({
      type: GET_TYPE_PRODUCT,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PRODUCT_TYPES_ERROR,
      payload: { msg: err },
    });
  }
};
export const getCountProductType = (value, selected) => async (dispatch) => {
  try {
    const res = await axios.get(config.rootLink + "/backend/server.php", {
      params: {
        shop: shop,
        getCountProductType: "",
        value: value,
        selected: selected,
      },
    });
    dispatch({
      type: GET_COUNT_TYPE_PRODUCT,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PRODUCT_TYPES_ERROR,
      payload: { msg: err },
    });
  }
};

export const reload = () => async (dispatch) => {
  dispatch({
    type: RELOAD_PRODUCT_TYPES,
  });
};
export const loadDataTable = () => async (dispatch) => {
  dispatch({
    type: LOADING_DATA_TABLE_PRODUCT_TYPES,
  });
};

export const getArrProductTypesImport = (arrId) => async (dispatch) => {
  try {
    const res = await axios.get(config.rootLink + "/backend/server.php", {
      params: {
        shop: shop,
        getArrProductTypesImport: "",
        arrId: arrId,
      },
    });
    dispatch({
      type: GET_ARR_PRODUCT_TYPES_IMPORT,
      payload: res.data,
    });
  } catch (err) {
    dispatch(setAlert(err.message));
  }
};
export const changeCheckedProductTypesImport = (arr) => async (dispatch) => {
  dispatch({
    type: CHANGE_CHECKED_PRODUCT_TYPES_IMPORT,
    payload: arr,
  });
};
export const clearDataInProductTypes = () => async (dispatch) => {
  dispatch({
    type: CLEAR_DATA_IMPORT_PRODUCT_TYPE,
  });
};

export const updateCountReviewInType = (id) => async (dispatch) => {
  try {
    const res = await axios.post(
      config.rootLink + "/backend/server.php",
      { action: "updateCountReviewInType", shop: shop, id: id },
      {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          "Content-type": "application/x-www-form-urlencoded",
        },
      }
    );
  } catch (err) {
    dispatch(setAlert(err.message));
  }
};
/////////////////////////////////////////////
