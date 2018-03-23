//@flow
import * as types from "../actions/types";

const initialState = {
  isFetching: false,
  events: [],
  eventId: null,
  errorMessage: null
};

const EventReducer = (state: {} = initialState, action: {}) => {
  switch (action.type) {
    case types.REQUEST_EVENTS:
      return Object.assign({}, state, {
        isFetching: true,
        errorMessage: null
      });
    case types.RECEIVE_EVENTS:
      return Object.assign({}, state, {
        isFetching: false,
        events: action.data,
        errorMessage: null
      });
    case types.SET_EVENT:
      return Object.assign({}, state, {
        eventId: action.data
      });
    case types.FETCH_EVENTS_FAILED:
      return Object.assign({}, state, {
        isFetching: false,
        errorMessage: action.data
      });
    default:
      return state;
  }
};

export default EventReducer;
