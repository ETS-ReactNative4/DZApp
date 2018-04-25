//@flow
import * as types from "./types";
import * as strings from "../constants/strings";
import { URL } from "../constants/serversettings";
//import { fetchWrapper } from "../functions/fetch";
const fetch = require("react-native-cancelable-fetch");
import { sendError, sendMessage } from "./messageActions";
import { NetInfo } from "react-native";
import { Store } from "../store/store";

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
    NetInfo.isConnected
      .fetch()
      .then(isConnected => {
        if (isConnected && !Store.getState().CashierReducer.isAuthenticating) {
          dispatch(requestLogin());
          let fetched;

          fetch(
            URL + "/customers/login",
            {
              method: "POST",
              body: JSON.stringify(userCredentials),
              headers: new Headers({
                "Content-Type": "application/json"
              })
            },
            "login"
          )
            .then(response => {
              fetched = true;
              return response.json();
            })
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
              fetched = true;
              dispatch(sendError(error.message));
              dispatch(loginError(error.message));
            });

          //cancel the request after x seconds
          //and send appropriate error messages
          //when unsuccessfull
          setTimeout(() => {
            if (!fetched) {
              fetch.abort("login");
              dispatch(sendError(strings.SERVER_TIMEOUT));
              dispatch(loginError(strings.SERVER_TIMEOUT));
            }
          }, 5000);
        } else {
          dispatch(sendError(strings.NO_CONNECTION));
          dispatch(loginError(strings.NO_CONNECTION));
        }
      })
      .catch(err => {
        console.warn(err);
      });
  };
};
