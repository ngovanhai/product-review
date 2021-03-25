import {
  COLLECTION_ERROR,
  CHANGE_CHECKED_COLLECTION,
  LOADING_DATA_TABLE_COLLECTION,
  GET_TYPE_PRODUCT,
  GET_COLLECTIONS,
  RELOAD_COLLECTION,
  CHANGE_CHECKED_COLLECTION_IMPORT,
  GET_ARR_COLLECTIONS_IMPORT,
  CLEAR_DATA_IMPORT_COLLECTION,
  GET_REVIEWS_EDIT_COLLECTION_TYPE,
  GET_COUNT_COLLECTIONS,
  SYNC_COLLECTIONS,
} from "../constants/constants";

const initialState = {
  error: {},
  loading: true,
  loadingTable: false,
  // arrCheckedCollection: [],
  arrCheckedCollectionImport: [],
  collections: [],
  productType: [],
  arrCollectionImports: [],
  countCollections: 0,
  //import reviews
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case CLEAR_DATA_IMPORT_COLLECTION:
      return {
        ...state,
        // loading: true,
        loadingTable: false,
        arrCheckedCollectionImport: [],
        arrCollectionImports: [],
      };
    case GET_REVIEWS_EDIT_COLLECTION_TYPE:
      return {
        ...state,
        arrCollectionImports: payload.listCollections,
        arrCheckedCollectionImport: payload.listArrCheckedCollection,
      };
    case GET_COLLECTIONS:
      return {
        ...state,
        loading: false,
        collections: payload,
        loadingTable: false,
      };
    // case SYNC_COLLECTIONS:
    //   if (payload.data.length > 0) {
    //     state.collections = payload.data;
    //   }
    //   return {
    //     ...state,
    //     loadingTable: false,
    //   };
    case GET_COUNT_COLLECTIONS:
      return {
        ...state,
        loading: false,
        countCollections: payload,
        // loadingTable: false,
      };
    case GET_ARR_COLLECTIONS_IMPORT:
      return {
        ...state,
        loading: false,
        arrCollectionImports: payload,
      };
    case CHANGE_CHECKED_COLLECTION_IMPORT:
      return {
        ...state,
        arrCheckedCollectionImport: payload,
      };
    case GET_TYPE_PRODUCT:
      return {
        ...state,
        loading: false,
        productType: payload,
        loadingTable: false,
      };
    case LOADING_DATA_TABLE_COLLECTION:
      return {
        ...state,
        loadingTable: true,
      };
    case CHANGE_CHECKED_COLLECTION:
      return {
        ...state,
        // arrCheckedCollection: payload,
        arrCheckedCollectionImport: payload,
      };
    case COLLECTION_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
        loadingTable: false,
      };
    case RELOAD_COLLECTION:
      return {
        ...state,
        loading: true,
      };
    default:
      return state;
  }
}
