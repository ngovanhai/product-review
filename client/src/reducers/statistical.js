import {
  GET_ALL_COUNT_REVIEWS_STATISTICAL,
  GET_ALL_PUBLISH_REVIEWS_STATISTICAL,
  GET_ALL_UNPUBLISH_REVIEWS,
  GET_COUNT_PRODUCTS_NO_REVIEWS_STATISTICAL,
  QUERY_ERROR_STATISTICAL,
  GET_COUNT_PRODUCT_IN_SHOPIFY_STATISTICAL,
  GET_TYPE_PRODUCT_STATISTICAL,
  GET_COLLECTIONS_STATISTICAL,
  GET_RATING_STATISTICAL,
  GET_REVIEWS_PLACE_STATISTICAL,
} from "../constants/constants";

const initialState = {
  error: {},
  loading: true,
  countAllReviews: 0,
  countAllPublishReview: 0,
  countAllUnPublishReview: 0,
  productNoReview: 0,
  countProductInShopify: 0,
  productType: [],
  collections: [],
  reviewQuery: {
    averageReview: 0,
    oneStar: 0,
    twoStars: 0,
    threeStars: 0,
    fourStars: 0,
    fiveStars: 0,
  },
  reviewPlace: {
    reviewForProducts: 0,
    reviewForCollection: 0,
    reviewForProductTypes: 0,
  },
  //import reviews
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case GET_COLLECTIONS_STATISTICAL:
      return {
        ...state,
        loading: false,
        collections: payload,
      };
    case GET_RATING_STATISTICAL:
      state.reviewQuery.averageReview = payload.averageReview;
      state.reviewQuery.oneStar = payload.oneStar;
      state.reviewQuery.twoStars = payload.twoStars;
      state.reviewQuery.threeStars = payload.threeStars;
      state.reviewQuery.fourStars = payload.fourStars;
      state.reviewQuery.fiveStars = payload.fiveStars;
      return {
        ...state,
        loading: false,
      };
    case GET_REVIEWS_PLACE_STATISTICAL:
      state.reviewPlace.reviewForProducts = payload.reviewForProducts;
      state.reviewPlace.reviewForCollection = payload.reviewForCollection;
      state.reviewPlace.reviewForProductTypes = payload.reviewForProductTypes;
      return {
        ...state,
        loading: false,
      };
    case GET_COUNT_PRODUCT_IN_SHOPIFY_STATISTICAL:
      return {
        ...state,
        // loading: false,
        countProductInShopify: payload,
      };

    case GET_TYPE_PRODUCT_STATISTICAL:
      return {
        ...state,
        loading: false,
        productType: payload,
      };
    case GET_ALL_COUNT_REVIEWS_STATISTICAL:
      return {
        ...state,
        countAllReviews: payload,
      };
    case GET_COUNT_PRODUCTS_NO_REVIEWS_STATISTICAL:
      return {
        ...state,
        productNoReview: payload,
      };
    case GET_ALL_PUBLISH_REVIEWS_STATISTICAL:
      return {
        ...state,
        countAllPublishReview: payload,
      };
    case GET_ALL_UNPUBLISH_REVIEWS:
      return {
        ...state,
        countAllUnPublishReview: payload,
      };
    case QUERY_ERROR_STATISTICAL:
      return {
        ...state,
        error: payload,
        loading: false,
        loadingTable: false,
      };
    default:
      return state;
  }
}
