import {
  API_REQUEST,
  ERROR_RESPONSE,
  SET_LOADING,
  SET_NOTIFICATION_COUNT,
  SUCCESS_RESPONSE,
} from "../actionTypes";

const initialState = {
  isLoading: false,
  error: false,
  message: "",
  notificationCount: 0,
};

export const commonReducer = (state = initialState, action) => {
  switch (action.type) {
    case API_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: false,
        message: "",
      };
    case SUCCESS_RESPONSE:
      return {
        ...state,
        isLoading: false,
        error: false,
        message: action.payload,
      };
    case ERROR_RESPONSE:
      return {
        ...state,
        isLoading: false,
        error: true,
        message: action.payload,
      };
    case SET_NOTIFICATION_COUNT:
      return {
        ...state,
        notificationCount: action.payload,
      };
    case SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
};
