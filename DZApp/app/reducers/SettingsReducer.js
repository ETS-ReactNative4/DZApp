//@flow
import * as types from "../actions/types";

const initialState = {
  historyCount: 5
};

const SettingsReducer = (state: {} = initialState, action: {}) => {
  switch (action.type) {
    case types.SET_HISTORY_COUNT:
      return Object.assign({}, state, {
        historyCount: action.data
      });
    default:
      return state;
  }
};

export default SettingsReducer;
