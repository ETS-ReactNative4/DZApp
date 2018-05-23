//@flow
import * as types from "./types";
import { NetInfo } from "react-native";
// import { URL } from "../constants/serversettings";
//import { fetchWrapper } from "../functions/fetch";
const fetch = require("react-native-cancelable-fetch");
import { sendMessage, sendError } from "./messageActions";
import * as strings from "../constants/strings";
import { Store } from "../store/store";
import { getURL, getToken, isLoggedIn } from "../functions/server";
import { logout } from "./cashierActions";

/************ Synchronous Actions ***************/

//API request for subscription list started
export const requestSubscriptions = () => {
  return {
    type: types.REQUEST_SUBSCRIPTIONS
  };
};

//API response for subscription list received
export const receiveSubscriptions = (subscriptions: []): {} => {
  return {
    type: types.RECEIVE_SUBSCRIPTIONS,
    data: subscriptions
  };
};

//subscription list fetch failed
export const fetchSubscriptionsFailed = (error: {}): {} => {
  return {
    type: types.FETCH_SUBSCRIPTIONS_FAILED,
    data: error
  };
};

/************ Asynchronous Actions ***************/

//request subscription list from API
export const fetchSubscriptions = () => {
  return function(dispatch) {
    //fix for known ios NetInfo bug: add an eventlistener
    //https://github.com/facebook/react-native/issues/8615
    const onInitialNetConnection = isConnected => {
      //console.log(`Is initially connected: ${isConnected}`);
      NetInfo.isConnected.removeEventListener(onInitialNetConnection);
    };
    NetInfo.isConnected.addEventListener(
      "connectionChange",
      onInitialNetConnection
    );
    NetInfo.isConnected
      .fetch()
      .then(isConnected => {
        if (isConnected) {
          if (
            !Store.getState().SubscriptionReducer.isFetching &&
            isLoggedIn()
          ) {
            dispatch(requestSubscriptions);

            let fetched;

            fetch(
              getURL() + "/api/EventSubscription",
              {
                method: "GET",
                headers: new Headers({
                  Authorization: "Bearer " + getToken()
                })
              },
              "subscriptions"
            )
              .then(response => {
                fetched = true;

                if (response.status === 200) {
                  return response.json();
                } else if (response.status === 401) {
                  //token no longer valid => log out the cashier
                  return { refreshToken: "true" };
                }
                return null;
              })
              .then(json => {
                if (json) {
                  if (json.refreshToken) {
                    dispatch(sendError(strings.TOKEN_EXPIRED));
                  } else {
                    dispatch(
                      receiveSubscriptions(
                        json.map(subscription => ({
                          ...subscription,
                          _id: subscription.id
                        }))
                      )
                    );
                    dispatch(sendMessage(strings.SYNCED));
                  }
                } else {
                  console.log("error fetch subscriptions");
                  dispatch(fetchSubscriptionsFailed(strings.UNABLE_TO_SYNC));
                  dispatch(sendError(strings.UNABLE_TO_SYNC));
                }
              })
              .catch(error => {
                console.log(
                  "error fetch subscriptions: " + JSON.stringify(err, null, 4)
                );

                fetched = true;
                dispatch(fetchSubscriptionsFailed(strings.UNABLE_TO_SYNC));
                dispatch(sendError(strings.UNABLE_TO_SYNC));
              });
            //cancel the request after x seconds
            //and send appropriate error messages
            //when unsuccessfull
            setTimeout(() => {
              if (!fetched) {
                fetch.abort("subscriptions");
                dispatch(sendError(strings.SERVER_TIMEOUT));
                dispatch(fetchSubscriptionsFailed(strings.SERVER_TIMEOUT));
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
