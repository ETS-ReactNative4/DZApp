//@flow
import * as types from "./types";
import * as strings from "../constants/strings";
import { URL } from "../constants/serversettings";
import { fetchWrapper } from "../functions/fetch";
import { sendError, sendMessage } from "./messageActions";

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
          dispatch(sendError(json.error));
          dispatch(loginError(json.error));
        } else {
          navigation.navigate("OrderScreen");
          dispatch(sendMessage(strings.AUTHENTICATED));
          dispatch(loginSuccess(json.id));
          navigation.navigate("MainFlowNavigator");
        }
      })
      .catch(error => {
        dispatch(sendError(error.message));
        dispatch(loginError(error.message));
      });
  };
};
