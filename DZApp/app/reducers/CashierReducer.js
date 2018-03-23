//@flow
import * as types from "../actions/types";

const initialState = {
  isAuthenticating: false,
  cashierId: null,
  errorMessage: null
};

const CashierReducer = (state: {} = initialState, action: {}) => {
  switch (action.type) {
    case types.REQUEST_LOGIN:
      return Object.assign({}, state, {
        isAuthenticating: true,
        cashierId: null,
        errorMessage: null
      });
    case types.LOGIN_SUCCESS:
      return Object.assign({}, state, {
        isAuthenticating: false,
        cashierId: action.data,
        errorMessage: null
      });
    case types.LOGIN_ERROR:
      return Object.assign({}, state, {
        isAuthenticating: false,
        cashierId: null,
        errorMessage: action.data
      });
    default:
      return state;
  }
};

export default CashierReducer;
