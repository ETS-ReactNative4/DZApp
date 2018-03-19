import * as ActionConstants from "./constants";
import fetchWrapper from "./fetchWrapper";

/************ Synchronous Actions ***************/

//API request for customer list started
export const requestEvents = () => {
  return {
    type: ActionConstants.REQUEST_EVENTS
  };
};

//API response for customer list received
export const receiveEvents = json => {
  return {
    type: ActionConstants.RECEIVE_EVENTS,
    data: json
  };
};

//Set the active customer in global state
export const setEvent = (eventId: String): {} => {
  return {
    type: ActionConstants.SET_EVENT,
    data: eventId
  };
};

export const fetchEventsFailed = (error: {}): {} => {
  return {
    type: ActionConstants.FETCH_EVENTS_FAILED,
    data: error
  };
};

/************ Asynchronous Actions ***************/

//request Customer list from API
export const fetchEvents = () => {
  return function(dispatch) {
    dispatch(requestEvents());
    return fetchWrapper(2000, fetch(ActionConstants.URL + "/events"))
      .then(response => response.json())
      .then(json => dispatch(receiveEvents(json)))
      .catch(error => dispatch(fetchEventsFailed(error)));
  };
};
