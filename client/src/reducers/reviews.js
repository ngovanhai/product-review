import {
  GET_ALL_COUNT_REVIEWS,
  GET_ALL_COUNT_PRODUCTS,
  GET_ALL_PRODUCTS_DB,
  ADD_REVIEW,
  UPDATE_COUNT_REVIEW_PRODUCT,
  GET_ALL_PUBLISH_REVIEWS,
  GET_ALL_UNPUBLISH_REVIEWS,
  GET_COUNT_PRODUCTS_NO_REVIEWS,
  // DELETE_ALL_REVIEWS,
  PUBLISH_ALL_REVIEWS,
  UN_PUBLISH_ALL_REVIEWS,
  GET_PRODUCTS_SEARCH,
  GET_PRODUCT_DETAILS,
  GET_ALL_REVIEWS_BY_PRODUCT_IN_PAGE,
  DELETE_ONE_REVIEW,
  GET_COUNT_REVIEW_BY_PRODUCT,
  RELOAD_REVIEWS,
  SYNC_DATA,
  SYNC_COLLECTIONS,
  PRODUCT_ERROR,
  GET_IMAGE_REVIEWS,
  GET_ALL_REVIEWS_BY_PRODUCT,
  GET_REVIEWS_EDIT,
  EDIT_REVIEW,
  GET_IMAGE_IN_REVIEW,
  DELETE_IMAGE,
  UN_PUBLISH_REVIEW_CHECKED,
  CHANGE_CHECKED_REVIEWS,
  CHANGE_CHECKED_PRODUCTS,
  PUBLISH_REVIEW_CHECKED,
  UN_FLAG_REVIEW_CHECKED,
  FLAG_REVIEW_CHECKED,
  DELETE_REVIEWS_CHECKED,
  IMPORT_REVIEWS_EXCEL,
  PUBLISH_REVIEW_PRODUCTS_CHECKED,
  UN_PUBLISH_REVIEW_PRODUCTS_CHECKED,
  UN_FLAG_REVIEW_PRODUCTS_CHECKED,
  FLAG_REVIEW_PRODUCTS_CHECKED,
  DELETE_REVIEW_PRODUCTS_CHECKED,
  GET_COUNT_PRODUCT_IN_SHOPIFY,
  SYNC_PRODUCTS_SHOPIFY,
  CHANGE_ARR_PRODUCTS_IMPORT,
  RESET_ARR_PRODUCTS_IMPORT,
  DELETE_IMAGE_MULTI_PRODUCTS,
  GET_VENDOR_PRODUCT,
  LOADING_DATA_TABLE,
  SYNC_PRODUCTS_START,
  GET_TYPE_PRODUCT_SELECT,
  GET_COLLECTIONS_SELECT,
  LOADING_THEME_DETAIL,
  GET_REVIEWS_EDIT_COLLECTION_TYPE,
  CLEAR_REVIEWS_CHECKED,
  CHANGE_IMAGE,
  RESET_IMAGE,
  //import
} from "../constants/constants";

const initialState = {
  imageUpload: [],

  productsSearch: [],
  reviewByProduct: [],
  allReviewByProduct: [],
  product: [],
  error: {},
  loading: true,
  loadingTable: false,
  countAllReviews: null,
  countAllProducts: null,
  countAllPublishReview: null,
  countAllUnPublishReview: null,
  productsInDB: [],
  productNoReview: null,
  countReviewByProduct: null,
  dataInsertReview: [],
  imageReviews: [],
  deleteImage: null,
  reviewEdit: [],
  imageInReview: [],
  arrCheckedReview: [],
  arrCheckedProducts: [],
  countProductInShopify: 0,
  dataSyncShopify: [],
  vendor: [],
  reviewImport: [],
  productTypeSelect: [],
  collectionsSelect: [],
  loadingTheme: false,
  //import reviews
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case GET_REVIEWS_EDIT_COLLECTION_TYPE:
      return {
        ...state,
        loading: false,
        arrCheckedProducts: payload.listArrCheckedProduct,
      };
    case CHANGE_IMAGE:
      return {
        ...state,
        imageUpload: payload,
      };
    case RESET_IMAGE:
      return {
        ...state,
        imageUpload: [],
      };
    case GET_PRODUCTS_SEARCH:
      return {
        ...state,
        loading: false,
        productsSearch: payload,
        loadingTable: false,
      };
    case GET_COLLECTIONS_SELECT:
      return {
        ...state,
        // loading: false,
        collectionsSelect: payload,
      };
    case GET_TYPE_PRODUCT_SELECT:
      return {
        ...state,
        // loading: false,
        productTypeSelect: payload,
      };
    case LOADING_DATA_TABLE:
      return {
        ...state,
        loadingTable: true,
        // countAllProducts: payload.length,
      };
    case LOADING_THEME_DETAIL:
      return {
        ...state,
        loadingTheme: true,
        // countAllProducts: payload.length,
      };
    case SYNC_PRODUCTS_START:
      return {
        ...state,
        // loading: false,
        // countAllProducts: payload.length,
      };
    // case GET_PRODUCTS_IN_COLLECTIONS:
    //   return {
    //     ...state,
    //     loading: false,
    //     productsSearch: payload,
    //     countAllProducts: payload.length,
    //   };
    case GET_COUNT_PRODUCT_IN_SHOPIFY:
      return {
        ...state,
        // loading: false,
        countProductInShopify: payload,
      };
    case SYNC_PRODUCTS_SHOPIFY:
      return {
        ...state,
        // loading: false,
        dataSyncShopify: payload,
      };
    case CHANGE_CHECKED_REVIEWS:
      return {
        ...state,
        arrCheckedReview: payload,
      };
    case CHANGE_CHECKED_PRODUCTS:
      return {
        ...state,
        arrCheckedProducts: payload,
      };
    case UN_PUBLISH_REVIEW_CHECKED:
      return {
        ...state,
        loading: false,
        arrCheckedReview: [],
      };
    case PUBLISH_REVIEW_CHECKED:
      return {
        ...state,
        loading: false,
        arrCheckedReview: [],
      };
    case FLAG_REVIEW_CHECKED:
      return {
        ...state,
        loading: false,
        arrCheckedReview: [],
      };
    case UN_FLAG_REVIEW_CHECKED:
      return {
        ...state,
        loading: false,
        arrCheckedReview: [],
      };
    case DELETE_REVIEWS_CHECKED:
      return {
        ...state,
        loading: false,
        arrCheckedReview: [],
      };
    case CLEAR_REVIEWS_CHECKED:
      return {
        ...state,
        loading: false,
        arrCheckedReview: [],
      };
    case SYNC_DATA:
      return {
        ...state,
        // loading: false,
      };
    case SYNC_COLLECTIONS:
      if (payload.length > 0) {
        state.collectionsSelect = payload.selected;
      }
      return {
        ...state,
      };

    case GET_VENDOR_PRODUCT:
      return {
        ...state,
        // loading: false,
        vendor: payload,
      };

    case GET_ALL_REVIEWS_BY_PRODUCT_IN_PAGE:
      return {
        ...state,
        reviewByProduct: payload,
        // loading: false,
        loadingTable: false,
      };
    case GET_ALL_REVIEWS_BY_PRODUCT:
      return {
        ...state,
        allReviewByProduct: payload,
        loading: false,
      };
    case GET_PRODUCT_DETAILS:
      return {
        ...state,
        product: payload,
        loading: false,
        loadingTheme: false,
      };
    case RELOAD_REVIEWS:
      return {
        ...state,
        loading: true,
      };
    case GET_ALL_COUNT_REVIEWS:
      return {
        ...state,
        countAllReviews: payload,
      };
    case GET_COUNT_REVIEW_BY_PRODUCT:
      return {
        ...state,
        countReviewByProduct: payload,
      };
    case GET_ALL_COUNT_PRODUCTS:
      return {
        ...state,
        countAllProducts: payload,
      };
    case GET_ALL_PRODUCTS_DB:
      return {
        ...state,
        productsInDB: payload,
      };
    case GET_COUNT_PRODUCTS_NO_REVIEWS:
      return {
        ...state,
        productNoReview: payload,
      };
    case ADD_REVIEW:
      return {
        ...state,
        dataInsertReview: payload,
      };
    case EDIT_REVIEW:
      return {
        ...state,
        dataInsertReview: payload,
      };
    case UPDATE_COUNT_REVIEW_PRODUCT:
      return {
        ...state,
      };
    case DELETE_IMAGE_MULTI_PRODUCTS:
      return {
        ...state,
      };
    case GET_ALL_PUBLISH_REVIEWS:
      return {
        ...state,
        countAllPublishReview: payload,
      };
    case GET_ALL_UNPUBLISH_REVIEWS:
      return {
        ...state,
        countAllUnPublishReview: payload,
      };
    // case DELETE_ALL_REVIEWS:
    //   return {
    //     ...state,
    //   };
    case DELETE_ONE_REVIEW:
      return {
        ...state,
        deleteImage: payload,
      };
    case DELETE_IMAGE:
      return {
        ...state,
      };
    case PUBLISH_ALL_REVIEWS:
      return {
        ...state,
        loading: false,
      };
    case UN_PUBLISH_ALL_REVIEWS:
      return {
        ...state,
        loading: false,
      };
    case PRODUCT_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
        loadingTable: false,
      };
    case GET_IMAGE_REVIEWS:
      return {
        ...state,
        imageReviews: payload,
        loading: false,
      };
    case GET_IMAGE_IN_REVIEW:
      return {
        ...state,
        imageInReview: payload,
        // loading: false,
      };
    case GET_REVIEWS_EDIT:
      return {
        ...state,
        reviewEdit: payload.reviewEdit[0],
        // loading: false,
      };
    // case CLEAR_DATA_EDIT:
    //   return {
    //     ...state,
    //     reviewEdit: ,
    //     // loading: false,
    //   };
    case IMPORT_REVIEWS_EXCEL:
      return {
        ...state,
        reviewImport: payload,
        loading: false,
      };
    case UN_PUBLISH_REVIEW_PRODUCTS_CHECKED:
      return {
        ...state,
        loading: false,
        arrCheckedProducts: [],
      };
    case PUBLISH_REVIEW_PRODUCTS_CHECKED:
      return {
        ...state,
        loading: false,
        arrCheckedProducts: [],
      };
    case UN_FLAG_REVIEW_PRODUCTS_CHECKED:
      return {
        ...state,
        loading: false,
        arrCheckedProducts: [],
      };
    case FLAG_REVIEW_PRODUCTS_CHECKED:
      return {
        ...state,
        loading: false,
        arrCheckedProducts: [],
      };
    case DELETE_REVIEW_PRODUCTS_CHECKED:
      return {
        ...state,
        loading: false,
        arrCheckedProducts: [],
      };
    case CHANGE_ARR_PRODUCTS_IMPORT:
      return {
        ...state,
        // loading: true,
        arrCheckedProducts: payload,
      };
    case RESET_ARR_PRODUCTS_IMPORT:
      return {
        ...state,
        // loading: true,
        arrCheckedProducts: [],
      };
    default:
      return state;
  }
}
