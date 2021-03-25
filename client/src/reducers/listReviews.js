import {
  GET_REVIEWS_SEARCH,
  REVIEWS_ERROR,
  GET_IMAGE_REVIEWS_REVIEW_PAGE,
  LOADING_DATA_TABLE_REVIEW,
  GET_ALL_COUNT_REVIEWS_REVIEW_PAGE,
  RELOAD_REVIEWS_REVIEW_PAGE,
  GET_IMAGE_IN_REVIEW,
  GET_CONNECT_COLLECTION_REVIEWS,
  GET_CONNECT_PRODUCT_TYPE_REVIEWS,
  GET_CONNECT_PRODUCT_REVIEWS,
  GET_REQUEST_SEARCH,
} from "../constants/constants";

const initialState = {
  error: {},
  loadingReviews: false,
  reviewsSearch: [],
  imageReviews: [],
  loadingTable: false,
  countAllReviews: 0, //fix 14/01/2021
  connectCollectionReviews: [],
  connectProductTypeReviews: [],
  connectProductReviews: [],
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_CONNECT_COLLECTION_REVIEWS:
      return {
        ...state,
        connectCollectionReviews: payload,
      };
    case GET_CONNECT_PRODUCT_TYPE_REVIEWS:
      return {
        ...state,
        connectProductTypeReviews: payload,
      };
    case GET_CONNECT_PRODUCT_REVIEWS:
      return {
        ...state,
        connectProductReviews: payload,
      };
    case GET_REVIEWS_SEARCH:
      return {
        ...state,
        reviewsSearch: payload,
        loadingReviews: false,
        loadingTable: false,
      };
    case GET_REQUEST_SEARCH:
      return {
        ...state,
        reviewsSearch: payload,
        loadingReviews: false,
        loadingTable: false,
      };
    case REVIEWS_ERROR:
      return {
        ...state,
        error: payload,
        loadingReviews: false,
      };
    case GET_ALL_COUNT_REVIEWS_REVIEW_PAGE:
      return {
        ...state,
        countAllReviews: payload,
        loadingReviews: false,
      };
    case LOADING_DATA_TABLE_REVIEW:
      return {
        ...state,
        loadingTable: true,
        // countAllProducts: payload.length,
      };
    case RELOAD_REVIEWS_REVIEW_PAGE:
      return {
        ...state,
        loadingReviews: true,
        // countAllProducts: payload.length,
      };
    case GET_IMAGE_REVIEWS_REVIEW_PAGE:
      return {
        ...state,
        imageReviews: payload,
        loadingReviews: false,
      };
    case GET_IMAGE_IN_REVIEW:
      return {
        ...state,
        // imageInReview: payload,
        loadingReviews: false,
      };
    default:
      return state;
  }
}
