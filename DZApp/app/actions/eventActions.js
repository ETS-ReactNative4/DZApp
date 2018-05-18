//@flow
import * as types from "./types";
// import { URL } from "../constants/serversettings";
//import { fetchWrapper } from "../functions/fetch";
const fetch = require("react-native-cancelable-fetch");
import { NetInfo } from "react-native";
import { sendError, sendMessage } from "./messageActions";
import * as strings from "../constants/strings";
import { Store } from "../store/store";
import { getURL } from "../functions/server";

/************ Synchronous Actions ***************/

//API request for event list started
export const requestEvents = (): {} => {
  return {
    type: types.REQUEST_EVENTS
  };
};

//API response for event list received
export const receiveEvents = (events: []): {} => {
  return {
    type: types.RECEIVE_EVENTS,
    data: events
  };
};

//Set the active event in global state
export const setEvent = (
  eventId: String,
  navigation: {},
  previousRouteName = null
): {} => {
  navigation.navigate(previousRouteName ? previousRouteName : "OrderScreen");
  return {
    type: types.SET_EVENT,
    data: eventId
  };
};

//event list fetch failed
export const fetchEventsFailed = (error: {}): {} => {
  return {
    type: types.FETCH_EVENTS_FAILED,
    data: error
  };
};

/************ Asynchronous Actions ***************/
//request event list from API
export const fetchEvents = () => {
  return function(dispatch) {
    //fix for known ios NetInfo bug: add an eventlistener
    //https://github.com/facebook/react-native/issues/8615
    const onInitialNetConnection = isConnected => {
      console.log(`Is initially connected: ${isConnected}`);
      NetInfo.isConnected.removeEventListener(onInitialNetConnection);
    };
    NetInfo.isConnected.addEventListener(
      "connectionChange",
      onInitialNetConnection
    );
    NetInfo.isConnected
      .fetch()
      .then(isConnected => {
        if (isConnected && !Store.getState().EventReducer.isFetching) {
          dispatch(requestEvents);

          let fetched;

          fetch(getURL() + "/api/Event", {}, "events")
            .then(response => {
              fetched = true;
              return response.json();
            })
            .then(json => {
              dispatch(receiveEvents(json.map(event => ({...event, _id: event.id }))));
              dispatch(sendMessage(strings.SYNCED));
            })
            .catch(error => {
              fetched = true;
              dispatch(fetchEventsFailed(error));
              dispatch(sendError(error.message));
            });
          //cancel the request after x seconds
          //and send appropriate error messages
          //when unsuccessfull
          setTimeout(() => {
            if (!fetched) {
              fetch.abort("events");
              dispatch(sendError(strings.SERVER_TIMEOUT));
              dispatch(fetchEventsFailed(strings.SERVER_TIMEOUT));
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
