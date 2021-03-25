import axios from "axios";
import {
  GET_SETTINGS,
  SHOW_NOTIFICATION_DEMO,
  HIDE_NOTIFICATION_DEMO,
  SAVE_ERROR,
  SAVE_SETTINGS,
  RELOAD_SETTINGS,
} from "../constants/constants";
import config from "../config/config";
import { setAlert } from "./alert";
const shop = config.shop;

export const getSettings = () => async (dispatch) => {
  try {
    const res = await axios.get(config.rootLink + "/backend/settings.php", {
      params: {
        shop: shop,
        getSettings: "",
      },
    });
    dispatch({
      type: GET_SETTINGS,
      payload: res.data,
    });
  } catch (err) {
    dispatch(setAlert(err.message));
  }
};

export const reloadSettings = () => async (dispatch) => {
  dispatch({
    type: RELOAD_SETTINGS,
  });
};

export const saveSettingsReview = (formData) => async (dispatch) => {
  try {
    const res = await axios.post(
      config.rootLink + "/backend/settings.php",
      { action: "saveSettingsReview", shop: shop, settings: formData },
      {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          "Content-type": "application/x-www-form-urlencoded",
        },
      }
    );
    setTimeout(() => {
      dispatch({
        type: SAVE_SETTINGS,
        payload: res.data,
      });
      dispatch(setAlert("Save successful!"));
    }, 1000);
  } catch (err) {
    dispatch({
      type: SAVE_ERROR,
    });
    dispatch(setAlert(err.message));
  }
};

export const saveSettingsCustomize = (formData) => async (dispatch) => {
  try {
    const res = await axios.post(
      config.rootLink + "/backend/settings.php",
      { action: "saveSettingsCustomize", shop: shop, settings: formData },
      {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          "Content-type": "application/x-www-form-urlencoded",
        },
      }
    );
    setTimeout(() => {
      dispatch({
        type: SAVE_SETTINGS,
        payload: res.data,
      });
      dispatch(setAlert("Save successful!"));
    }, 1000);
  } catch (err) {
    dispatch({
      type: SAVE_ERROR,
    });
    dispatch(setAlert(err.message));
  }
};

export const saveSettingsAdvanced = (formData) => async (dispatch) => {
  try {
    const res = await axios.post(
      config.rootLink + "/backend/settings.php",
      { action: "saveSettingsAdvanced", shop: shop, settings: formData },
      {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          "Content-type": "application/x-www-form-urlencoded",
        },
      }
    );
    setTimeout(() => {
      dispatch({
        type: SAVE_SETTINGS,
        payload: res.data,
      });
      dispatch(setAlert("Save successful!"));
    }, 1000);
  } catch (err) {
    dispatch({
      type: SAVE_ERROR,
    });
    dispatch(setAlert(err.message));
  }
};

export const showNotificationDemo = () => async (dispatch) => {
  dispatch({
    type: SHOW_NOTIFICATION_DEMO,
  });
};
export const hideNotificationDemo = () => async (dispatch) => {
  setTimeout(() => {
    dispatch({
      type: HIDE_NOTIFICATION_DEMO,
    });
  }, 1000);
};
