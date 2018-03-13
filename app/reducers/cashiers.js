//@flow
import { LOGIN_SUCCESS, LOGIN_ERROR } from "../actions/types";

const initialState = {
  cashierId: -1,
  errorMessage: ""
};

const reducer = (state: any = initialState, action: any) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return Object.assign({}, state, {
        cashierId: action.data,
        errorMessage: ""
      });
    case LOGIN_ERROR:
      return Object.assign({}, state, {
        cashierId: -1,
        errorMessage: "Ongeldig(e) wachtwoord en/of gebruikersnaam"
      });
    default:
      return state;
  }
};

export default reducer;
