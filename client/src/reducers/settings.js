import {
  GET_SETTINGS,
  SHOW_NOTIFICATION_DEMO,
  HIDE_NOTIFICATION_DEMO,
  SAVE_ERROR,
  SAVE_SETTINGS,
  RELOAD_SETTINGS,
} from "../constants/constants";

const initialState = {
  dataSettings: [],
  loading: true,
  notificationsDemo: false,
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case GET_SETTINGS:
      return {
        ...state,
        dataSettings: payload,
        loading: false,
      };
    case SAVE_SETTINGS:
      return {
        ...state,
        loading: false,
      };
    case RELOAD_SETTINGS:
      return {
        ...state,
        loading: true,
      };
    case SHOW_NOTIFICATION_DEMO:
      return {
        ...state,
        notificationsDemo: true,
      };
    case HIDE_NOTIFICATION_DEMO:
      return {
        ...state,
        notificationsDemo: false,
      };
    case SAVE_ERROR:
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
}
