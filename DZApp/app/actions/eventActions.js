//@flow
import * as types from "./types";
import { URL } from "../constants/serversettings";
import { fetchWrapper } from "../functions/fetch";

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
export const setEvent = (eventId: String, navigation: {}): {} => {
  navigation.navigate("OrderScreen");
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
    dispatch(requestEvents());
    return fetchWrapper(5000, fetch(URL + "/events"))
      .then(response => response.json())
      .then(json => dispatch(receiveEvents(json)))
      .catch(error => dispatch(fetchEventsFailed(error)));
  };
};
