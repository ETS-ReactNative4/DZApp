//@flow
import * as types from "./types";
import * as strings from "../constants/strings";
//import { URL } from "../constants/serversettings";

//import { fetchWrapper } from "../functions/fetch";
const fetch = require("react-native-cancelable-fetch");
import { sendError, sendMessage } from "./messageActions";
import { NetInfo } from "react-native";
import { Store } from "../store/store";
import { getURL } from "../functions/server";

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

export const logout = (): {} => {
  return {
    type: types.LOGOUT
  };
};

export const localCloseout = (closeout: {}): {} => {
  return {
    type: types.LOCAL_CLOSEOUT,
    data: closeout
  };
};

export const closeoutSyncedStarted = () => {
  return { type: types.CLOSEOUT_SYNC_STARTED };
};

export const closeoutSyncComplete = () => {
  return { type: types.CLOSEOUT_SYNC_COMPLETE };
};

export const closeoutSyncFailed = () => {
  return { type: types.CLOSEOUT_SYNC_FAILED };
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
            getURL() + "/api/Login",
            {
              method: "POST",
              body: JSON.stringify(userCredentials),
              headers: new Headers({
                "Content-Type": "application/json; charset=utf-8"
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
                dispatch(loginSuccess(json.customer.id));
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
          }, 50000);
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

export const processCloseout = (closeout: {}) => {
  return function(dispatch) {
    dispatch(localCloseout(closeout));
    dispatch(syncCloseouts());
  };
};

export const syncCloseouts = () => {
  return function(dispatch) {
    NetInfo.isConnected
      .fetch()
      .then(isConnected => {
        if (isConnected && !Store.getState().CashierReducer.isSyncing) {
          let closeouts = Store.getState().CashierReducer.closeouts;

          if (closeouts.length > 0) {
            dispatch(closeoutSyncedStarted());
            let fetched;

            fetch(
              getURL() + "/closeouts",
              {
                method: "POST",
                body: JSON.stringify(closeouts),
                headers: new Headers({
                  "Content-Type": "application/json"
                })
              },
              "closeouts"
            )
              .then(response => {
                fetched = true;
                if (response.status === 200) {
                  dispatch(sendMessage(strings.SYNCED));
                  dispatch(closeoutSyncComplete());
                } else {
                  dispatch(sendError(strings.UNABLE_TO_SYNC));
                  dispatch(closeoutSyncFailed());
                }
              })
              .catch(err => {
                fetched = true;
                dispatch(sendError(strings.UNABLE_TO_SYNC));
                dispatch(closeoutSyncFailed());
              });

            //cancel the request after x seconds
            //and send appropriate error messages
            //when unsuccessfull
            setTimeout(() => {
              if (!fetched) {
                fetch.abort("closeouts");
                dispatch(sendError(strings.SERVER_TIMEOUT));
                dispatch(closeoutSyncFailed());
              }
            }, 5000);
          }
        } else {
          dispatch(sendError(strings.NO_CONNECTION));
        }
      })
      .catch(err => {
        console.warn(err);
      });
  };
};
