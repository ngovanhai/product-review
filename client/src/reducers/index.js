import { combineReducers } from "redux";
import reviews from "./reviews";
import importReviewUrl from "./importReviewUrl";
import listReviews from "./listReviews";
import alert from "./alert";
import settings from "./settings";
import statistical from "./statistical";
import collections from "./collections";
import productTypes from "./productTypes";
export default combineReducers({
  reviews,
  importReviewUrl,
  alert,
  settings,
  listReviews,
  statistical,
  collections,
  productTypes,
});
