//@flow
import * as types from "../actions/types";

const initialState = {
  isAuthenticating: false,
  cashierId: null
};

const CashierReducer = (state: {} = initialState, action: {}) => {
  switch (action.type) {
    case types.REQUEST_LOGIN:
      return Object.assign({}, state, {
        isAuthenticating: true,
        cashierId: null
      });
    case types.LOGIN_SUCCESS:
      return Object.assign({}, state, {
        isAuthenticating: false,
        cashierId: action.data
      });
    case types.LOGIN_ERROR:
      return Object.assign({}, state, {
        isAuthenticating: false,
        cashierId: null
      });
    default:
      return state;
  }
};

export default CashierReducer;
