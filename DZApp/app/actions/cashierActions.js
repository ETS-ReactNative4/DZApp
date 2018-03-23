//@flow
import * as types from "./types";
import { URL } from "../constants/serversettings";
import { fetchWrapper } from "../functions/fetch";

/************ Synchronous Actions ***************/
export const requestLogin = () => {
  return {
    type: types.REQUEST_LOGIN
  };
};

export const loginSuccess = (id: String) => {
  return {
    type: types.LOGIN_SUCCESS,
    data: id
  };
};

export const loginError = (error: String) => {
  return {
    type: types.LOGIN_ERROR,
    data: error
  };
};

/************ Asynchronous Actions ***************/
//authentication against the API, since we don't want to store sensitive information
//on mobile device
export const login = (userCredentials: {}, navigation: {}) => {
  return function(dispatch) {
    dispatch(requestLogin());

    return fetchWrapper(
      5000,
      fetch(URL + "/customers/login", {
        method: "POST",
        body: JSON.stringify(userCredentials),
        headers: new Headers({
          "Content-Type": "application/json"
        })
      })
    )
      .then(response => response.json())
      .then(json => {
        if (json.error) {
          dispatch(loginError(json.error));
        } else {
          navigation.navigate("OrderScreen");
          dispatch(loginSuccess(json.id));
        }
      })
      .catch(error => dispatch(loginError(error.message)));
  };
};
