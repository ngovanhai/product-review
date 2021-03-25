import axios from "axios";
import { setAlert } from "./alert";
import {
  COLLECTION_ERROR,
  RELOAD_COLLECTION,
  SYNC_COLLECTIONS,
  LOADING_DATA_TABLE_COLLECTION,
  GET_COLLECTIONS,
  CHANGE_CHECKED_COLLECTION,
  CHANGE_CHECKED_COLLECTION_IMPORT,
  GET_ARR_COLLECTIONS_IMPORT,
  CLEAR_DATA_IMPORT_COLLECTION,
  GET_COUNT_COLLECTIONS,
} from "../constants/constants";
import config from "../config/config";
const shop = config.shop;

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
      type: COLLECTION_ERROR,
      payload: { msg: err },
    });
    // dispatch(setAlert(err.message));
  }
};
export const changeCheckedCollection = (arr) => async (dispatch) => {
  dispatch({
    type: CHANGE_CHECKED_COLLECTION,
    payload: arr,
  });
};

export const getCollections = (value, offset, selected) => async (dispatch) => {
  try {
    const res = await axios.get(config.rootLink + "/backend/server.php", {
      params: {
        shop: shop,
        getCollections: "",
        value: value,
        selected: selected,
        offset: offset,
      },
    });
    dispatch({
      type: GET_COLLECTIONS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: COLLECTION_ERROR,
      payload: { msg: err },
    });
  }
};
export const getCountCollections = (value, selected) => async (dispatch) => {
  try {
    const res = await axios.get(config.rootLink + "/backend/server.php", {
      params: {
        shop: shop,
        getCountCollections: "",
        value: value,
        selected: selected,
      },
    });
    dispatch({
      type: GET_COUNT_COLLECTIONS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: COLLECTION_ERROR,
      payload: { msg: err },
    });
  }
};

export const reload = () => async (dispatch) => {
  dispatch({
    type: RELOAD_COLLECTION,
  });
};
export const loadDataTable = () => async (dispatch) => {
  dispatch({
    type: LOADING_DATA_TABLE_COLLECTION,
  });
};

export const getArrCollectionsImport = (arrId) => async (dispatch) => {
  try {
    const res = await axios.get(config.rootLink + "/backend/server.php", {
      params: {
        shop: shop,
        getArrCollectionsImport: "",
        arrId: arrId,
      },
    });
    dispatch({
      type: GET_ARR_COLLECTIONS_IMPORT,
      payload: res.data,
    });
  } catch (err) {
    dispatch(setAlert(err.message));
  }
};
export const changeCheckedCollectionImport = (arr) => async (dispatch) => {
  dispatch({
    type: CHANGE_CHECKED_COLLECTION_IMPORT,
    payload: arr,
  });
};
export const clearDataInCollection = () => async (dispatch) => {
  dispatch({
    type: CLEAR_DATA_IMPORT_COLLECTION,
  });
};
export const updateCountReviewInCollection = (id) => async (dispatch) => {
  try {
    const res = await axios.post(
      config.rootLink + "/backend/server.php",
      { action: "updateCountReviewInCollection", shop: shop, id: id },
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
