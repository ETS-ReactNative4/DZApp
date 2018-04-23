//@flow
import * as types from "./types";
import { NetInfo } from "react-native";
import { URL } from "../constants/serversettings";
import { fetchWrapper } from "../functions/fetch";
import { sendMessage, sendError } from "./messageActions";

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
    //check network connection
    //send an error if not connected
    //perform api call if connected
    NetInfo.isConnected
      .fetch()
      .then(isConnected => {
        if (isConnected) {
          dispatch(requestSubscriptions());
          return fetchWrapper(5000, fetch(URL + "/subscriptions"))
            .then(response => response.json())
            .then(json => dispatch(receiveSubscriptions(json)))
            .catch(error => dispatch(fetchSubscriptionsFailed(error)));
        } else {
          dispatch(sendError(strings.NO_CONNECTION));
        }
      })
      .catch(err => {
        console.warn(err);
      });
  };
};
