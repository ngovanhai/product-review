import axios from "axios";
import {
  SEARCH_REVIEWS_URL,
  RELOAD_IMPORT,
  RELOAD_IMPORT_WHEN_SAVE,
  SAVE_AND_LOAD_MORE,
  CLEAR_DATA_IMPORT,
  // FILTER_STAR,
  REPLACE_REVIEWS_IMPORT,
  CHANGE_CHECKED_REVIEWS_IMPORT,
  DELETE_CHECKED_REVIEWS_IMPORT,
  GET_ARR_PRODUCTS_IMPORT,
  SAVE_AND_LOAD_MORE_MULTI_PRODUCTS,
  RESET_ARR_PRODUCT_IMPORT,
  ERROR_IMPORT_URL,
  SAVE_AND_LOAD_MORE_COLLECTIONS,
  SAVE_AND_LOAD_MORE_TYPE,
  PUSH_REVIEWS_URL,
  // CHANGE_ARR_PRODUCTS_IMPORT,
  // UPDATE_COUNT_MULTI_PRODUCTS,
} from "../constants/constants";
import config from "../config/config";
import { setAlert } from "./alert";

const shop = config.shop;
export const getReviewImportUrl = (
  url,
  sortBy,
  purchased,
  filterStar,
  media,
  page,
  reviewer_name,
  review_title,
  blankContent
) => async (dispatch) => {
  try {
    const res = await axios.get(config.rootLink + "/backend/server.php", {
      params: {
        shop: shop,
        searchReviewsImport: "",
        url: url,
        sortBy: sortBy,
        purchased: purchased,
        filterStar: filterStar,
        media: media,
        page: page,
        reviewer_name: reviewer_name,
        review_title: review_title,
        blankContent: blankContent,
      },
    });

    await dispatch({
      type: SEARCH_REVIEWS_URL,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: ERROR_IMPORT_URL,
    });
    dispatch(setAlert(err.message));
  }
};
export const reload = () => async (dispatch) => {
  dispatch({
    type: RELOAD_IMPORT,
  });
};
export const reloadWhenSave = () => async (dispatch) => {
  dispatch({
    type: RELOAD_IMPORT_WHEN_SAVE,
  });
};
export const ChangeCheckedReviewsImport = (arr) => async (dispatch) => {
  dispatch({
    type: CHANGE_CHECKED_REVIEWS_IMPORT,
    payload: arr,
  });
};

export const DeleteCheckedReviews = (arr, reviews) => (dispatch) => {
  arr.forEach((id) => {
    reviews = reviews.filter((e) => e.id !== parseInt(id));
  });
  dispatch({
    type: DELETE_CHECKED_REVIEWS_IMPORT,
    payload: reviews,
  });
};
export const replaceReviews = (value, reviews) => async (dispatch) => {
  reviews.forEach((review) => {
    review.reviewer_name = value;
    review.review_title = value;
    review.review_content = value;
  });
  dispatch({
    type: REPLACE_REVIEWS_IMPORT,
    payload: reviews,
  });
};
export const clearDataInImport = () => async (dispatch) => {
  dispatch({
    type: CLEAR_DATA_IMPORT,
  });
};
export const displayError = (text) => async (dispatch) => {
  dispatch(setAlert(text));
};
export const resetArrProductImports = () => async (dispatch) => {
  dispatch({
    type: RESET_ARR_PRODUCT_IMPORT,
    // payload: reviews,
  });
};

export const saveAndLoadMore = (formData) => async (dispatch) => {
  try {
    const res = await axios.post(
      config.rootLink + "/backend/server.php",
      { action: "saveAndLoadMore", shop: shop, reviewImport: formData },
      {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          "Content-type": "application/x-www-form-urlencoded",
        },
      }
    );
    dispatch({
      type: SAVE_AND_LOAD_MORE,
      payload: res.data,
    });
    dispatch(setAlert("Import review successful!"));
  } catch (err) {
    dispatch({
      type: ERROR_IMPORT_URL,
      // payload: reviews,
    });
    dispatch(setAlert(err.message));
  }
};
export const saveAndLoadMoreCollections = (formData) => async (dispatch) => {
  try {
    const res = await axios.post(
      config.rootLink + "/backend/server.php",
      {
        action: "saveAndLoadMoreCollections",
        shop: shop,
        reviewImport: formData,
      },
      {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          "Content-type": "application/x-www-form-urlencoded",
        },
      }
    );
    dispatch({
      type: SAVE_AND_LOAD_MORE_COLLECTIONS,
      payload: res.data,
    });
    dispatch(setAlert("Import review to collections successful!"));
  } catch (err) {
    dispatch({
      type: ERROR_IMPORT_URL,
      // payload: reviews,
    });
    dispatch(setAlert(err.message));
  }
};
export const saveAndLoadMoreMultiProducts = (formData) => async (dispatch) => {
  try {
    const res = await axios.post(
      config.rootLink + "/backend/server.php",
      {
        action: "saveAndLoadMoreMultiProducts",
        shop: shop,
        reviewImport: formData,
      },
      {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          "Content-type": "application/x-www-form-urlencoded",
        },
      }
    );
    dispatch({
      type: SAVE_AND_LOAD_MORE_MULTI_PRODUCTS,
      payload: res.data,
    });
    dispatch(setAlert("Import review successful!"));
  } catch (err) {
    dispatch({
      type: ERROR_IMPORT_URL,
      // payload: reviews,
    });
    dispatch(setAlert(err.message));
  }
};
export const saveAndLoadMoreType = (formData) => async (dispatch) => {
  try {
    const res = await axios.post(
      config.rootLink + "/backend/server.php",
      { action: "saveAndLoadMoreType", shop: shop, reviewImport: formData },
      {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          "Content-type": "application/x-www-form-urlencoded",
        },
      }
    );
    dispatch({
      type: SAVE_AND_LOAD_MORE_TYPE,
      payload: res.data,
    });
    dispatch(setAlert("Import review to products type successful!"));
  } catch (err) {
    dispatch({
      type: ERROR_IMPORT_URL,
      // payload: reviews,
    });
    dispatch(setAlert(err.message));
  }
};

export const getArrProductsImport = (arrId) => async (dispatch) => {
  try {
    const res = await axios.get(config.rootLink + "/backend/server.php", {
      params: {
        shop: shop,
        getArrProductsImport: "",
        arrId: arrId,
      },
    });
    dispatch({
      type: GET_ARR_PRODUCTS_IMPORT,
      payload: res.data,
    });
  } catch (err) {
    dispatch(setAlert(err.message));
  }
};
// export const updateCountReviewMultiProducts = (arrId) => async (dispatch) => {
//   console.log(arrId);
//   try {
//     const res = await axios.get(config.rootLink + "/backend/server.php", {
//       params: {
//         updateCountReviewMultiProducts: "",
//         arrId: arrId,
//       },
//     });
//     dispatch({
//       type: UPDATE_COUNT_MULTI_PRODUCTS,
//       payload: res.data,
//     });
//   } catch (err) {
//     dispatch(setAlert(err.message));
//   }
// };
