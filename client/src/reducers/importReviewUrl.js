import {
  SEARCH_REVIEWS_URL,
  RELOAD_IMPORT,
  SAVE_AND_LOAD_MORE,
  CLEAR_DATA_IMPORT,
  // FILTER_STAR,
  CHANGE_CHECKED_REVIEWS_IMPORT,
  DELETE_CHECKED_REVIEWS_IMPORT,
  REPLACE_REVIEWS_IMPORT,
  GET_ARR_PRODUCTS_IMPORT,
  RESET_ARR_PRODUCT_IMPORT,
  SAVE_AND_LOAD_MORE_MULTI_PRODUCTS,
  ERROR_IMPORT_URL,
  SAVE_AND_LOAD_MORE_COLLECTIONS,
  SAVE_AND_LOAD_MORE_TYPE,
  RELOAD_IMPORT_WHEN_SAVE,
  // PUSH_REVIEWS_URL,
  // UPDATE_COUNT_MULTI_PRODUCTS,
  GET_REVIEWS_EDIT_COLLECTION_TYPE,
} from "../constants/constants";

const initialState = {
  reviewsImportUrl: [],
  countReviewsFound: 0,
  reviewsHasFound: [],
  loading: false,
  arrCheckedReview: [],
  reviewAdd: {
    count: 0,
    countDuplicate: 0,
  },
  dataFilter: [],
  arrProductImports: [],
  loadingTable: false,
  stopResearchReviews: false,
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    //import reviews
    case SEARCH_REVIEWS_URL:
      if (payload.length == 0) {
        state.stopResearchReviews = true;
      }
      if (payload.length !== 0) {
        state.reviewsImportUrl.push(...payload);
        state.countReviewsFound = state.reviewsImportUrl.length;
      }
      return {
        ...state,
        // reviewsImportUrl: payload,
        loadingTable: false,
      };
    case GET_REVIEWS_EDIT_COLLECTION_TYPE:
      return {
        ...state,
        arrProductImports: payload.listProducts,
      };
    case CHANGE_CHECKED_REVIEWS_IMPORT:
      return {
        ...state,

        arrCheckedReview: payload,
      };
    case DELETE_CHECKED_REVIEWS_IMPORT:
      return {
        ...state,
        arrCheckedReview: [],
        reviewsImportUrl: payload,
        // arrProductImports: [],
      };
    case RELOAD_IMPORT:
      return {
        ...state,
        loadingTable: true,
        // reviewsImportUrl: [],
      };
    case RELOAD_IMPORT_WHEN_SAVE:
      return {
        ...state,
        loading: true,
        // reviewsImportUrl: [],
      };
    case ERROR_IMPORT_URL:
      return {
        ...state,
        loading: false,
        loadingTable: false,
        // reviewsImportUrl: [],
      };
    case GET_ARR_PRODUCTS_IMPORT:
      return {
        ...state,
        // loading: true,
        arrProductImports: payload,
      };
    case RESET_ARR_PRODUCT_IMPORT:
      return {
        ...state,
        // loading: true,
        arrProductImports: [],
      };
    case CLEAR_DATA_IMPORT:
      return {
        ...state,
        loading: false,
        loadingTable: false,
        reviewsImportUrl: [],
        arrCheckedReview: [],
        reviewAdd: {
          count: 0,
          countDuplicate: 0,
        },
        countReviewsFound: 0,
        arrProductImports: [],
        stopResearchReviews: false,
      };
    // case FILTER_STAR:
    //   return {
    //     ...state,
    //     loading: false,
    //     dataFilter: payload,
    //   };
    case REPLACE_REVIEWS_IMPORT:
      return {
        ...state,
        // loading: false,
        reviewsImportUrl: payload,
      };
    // case UPDATE_COUNT_MULTI_PRODUCTS:
    //   return {
    //     ...state,
    //   };

    case SAVE_AND_LOAD_MORE:
      return {
        ...state,
        loading: false,
        reviewAdd: payload,
      };
    case SAVE_AND_LOAD_MORE_MULTI_PRODUCTS:
      return {
        ...state,
        loading: false,
        reviewAdd: payload,
      };
    case SAVE_AND_LOAD_MORE_COLLECTIONS:
      return {
        ...state,
        loading: false,
        reviewAdd: payload,
      };
    case SAVE_AND_LOAD_MORE_TYPE:
      return {
        ...state,
        loading: false,
        reviewAdd: payload,
      };
    default:
      return state;
  }
}
