import {
  PRODUCT_TYPES_ERROR,
  CHANGE_CHECKED_PRODUCT_TYPES,
  LOADING_DATA_TABLE_PRODUCT_TYPES,
  GET_TYPE_PRODUCT,
  RELOAD_PRODUCT_TYPES,
  GET_ARR_PRODUCT_TYPES_IMPORT,
  CHANGE_CHECKED_PRODUCT_TYPES_IMPORT,
  CLEAR_DATA_IMPORT_PRODUCT_TYPE,
  GET_REVIEWS_EDIT_COLLECTION_TYPE,
  GET_COUNT_TYPE_PRODUCT,
} from "../constants/constants";

const initialState = {
  error: {},
  loading: true,
  loadingTable: false,
  arrCheckedProductTypes: [],
  productTypes: [],
  countProductTypes: 0,
  arrCheckedProductTypeImport: [],
  arrProductTypeImport: [],
  //import reviews
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case CLEAR_DATA_IMPORT_PRODUCT_TYPE:
      return {
        ...state,
        // loading: true,
        loadingTable: false,
        arrCheckedProductTypeImport: [],
        arrProductTypeImport: [],
      };
    case GET_ARR_PRODUCT_TYPES_IMPORT:
      return {
        ...state,
        // loading: true,
        arrProductTypeImport: payload,
      };
    case GET_REVIEWS_EDIT_COLLECTION_TYPE:
      return {
        ...state,
        // loading: true,
        arrProductTypeImport: payload.listProductTypes,
        arrCheckedProductTypeImport: payload.listArrCheckedProductType,
      };
    case CHANGE_CHECKED_PRODUCT_TYPES_IMPORT:
      return {
        ...state,
        arrCheckedProductTypeImport: payload,
      };
    case GET_TYPE_PRODUCT:
      return {
        ...state,
        loading: false,
        productTypes: payload,
        loadingTable: false,
      };
    case GET_COUNT_TYPE_PRODUCT:
      return {
        ...state,
        loading: false,
        countProductTypes: payload,
        loadingTable: false,
      };
    case LOADING_DATA_TABLE_PRODUCT_TYPES:
      return {
        ...state,
        loadingTable: true,
      };
    case CHANGE_CHECKED_PRODUCT_TYPES:
      return {
        ...state,
        arrCheckedProductTypeImport: payload,
      };
    case PRODUCT_TYPES_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
        loadingTable: false,
      };
    case RELOAD_PRODUCT_TYPES:
      return {
        ...state,
        loading: true,
      };
    default:
      return state;
  }
}
