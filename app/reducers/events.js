//@flow
import * as ActionConstants from "../actions/constants";

const initialState = {
  isFetching: false,
  events: [],
  eventId: null
};

const reducer = (state: any = initialState, action: any) => {
  switch (action.type) {
    case ActionConstants.REQUEST_EVENTS:
      return Object.assign({}, state, {
        isFetching: true
      });
    case ActionConstants.RECEIVE_EVENTS:
      return Object.assign({}, state, {
        isFetching: false,
        events: action.data
      });
    case ActionConstants.SET_EVENT:
      return Object.assign({}, state, {
        eventId: action.data
      });
    default:
      return state;
  }
};

export default reducer;
