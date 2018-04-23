//@flow
import * as types from "../actions/types";

const initialState = {
  isFetching: false,
  subscriptions: [],
  errorMessage: null
};

const SubscriptionReducer = (state: {} = initialState, action: {}) => {
  switch (action.type) {
    case types.REQUEST_SUBSCRIPTIONS:
      return Object.assign({}, state, {
        isFetching: true,
        errorMessage: null
      });
    case types.RECEIVE_SUBSCRIPTIONS:
      return Object.assign({}, state, {
        isFetching: false,
        subscriptions: action.data,
        errorMessage: null
      });
    case types.FETCH_SUBSCRIPTIONS_FAILED: {
      return Object.assign({}, state, {
        isFetching: false,
        errorMessage: action.data
      });
    }
    default:
      return state;
  }
};

export default SubscriptionReducer;
