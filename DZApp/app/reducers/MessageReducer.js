//@flow
import * as types from "../actions/types";

const initialState = {
  message: null,
  error: null
};

const MessageReducer = (state: {} = initialState, action: {}) => {
  switch (action.type) {
    case types.SEND_MESSAGE:
      //don't overwrite an existing message, resulting in multiple toasts overlapping
      if (!state.message) {
        return Object.assign({}, state, {
          message: action.data
        });
      } else return state;
    case types.SEND_ERROR:
      if (!state.error) {
        return Object.assign({}, state, {
          error: action.data
        });
      } else return state;
    case types.REMOVE_MESSAGE:
      return Object.assign({}, state, {
        message: null
      });
    case types.REMOVE_ERROR:
      return Object.assign({}, state, {
        error: null
      });
    default:
      return state;
  }
};

export default MessageReducer;
