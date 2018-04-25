//@flow
import * as types from "./types";
import { NetInfo } from "react-native";
import { URL } from "../constants/serversettings";
//import { fetchWrapper } from "../functions/fetch";
const fetch = require("react-native-cancelable-fetch");
import { sendMessage, sendError } from "./messageActions";
import * as strings from "../constants/strings";
import { Store } from "../store/store";

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
    NetInfo.isConnected
      .fetch()
      .then(isConnected => {
        if (isConnected && !Store.getState().SubscriptionReducer.isFetching) {
          dispatch(requestSubscriptions);

          let fetched;

          fetch(URL + "/subscriptions", {}, "subscriptions")
            .then(response => {
              fetched = true;
              return response.json();
            })
            .then(json => {
              dispatch(receiveSubscriptions(json));
              dispatch(sendMessage(strings.SYNCED));
            })
            .catch(error => {
              fetched = true;
              dispatch(fetchSubscriptionsFailed(error));
              dispatch(sendError(error.message));
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
        } else {
          dispatch(sendError(strings.NO_CONNECTION));
        }
      })
      .catch(err => {
        console.warn(err);
      });
  };
};
