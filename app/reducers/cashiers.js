//@flow
import * as ActionConstants from "../actions/constants";

const initialState = {
  isAuthenticating: true,
  cashierId: null,
  errorMessage: ""
};

const reducer = (state: any = initialState, action: any) => {
  switch (action.type) {
    case ActionConstants.REQUEST_LOGIN:
      return Object.assign({},state, {
        isAuthenticating: true,
        cashierId: null,
        errorMessage: "",
      })
    case ActionConstants.LOGIN_SUCCESS:
      return Object.assign({}, state, {
        isAuthenticating: false,
        cashierId: action.data,
        errorMessage: ""
      });
    case ActionConstants.LOGIN_ERROR:
      return Object.assign({}, state, {
        isAuthenticating: false,
        cashierId: null,
        errorMessage: action.data
      });
    default:
      return state;
  }
};

export default reducer;
