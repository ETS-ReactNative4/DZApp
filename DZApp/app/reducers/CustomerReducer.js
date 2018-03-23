//@flow
import * as types from "../actions/types";

const initialState = {
  isFetching: false,
  customers: [],
  customerId: null,
  errorMessage: null
};

const CustomerReducer = (state: {} = initialState, action: {}) => {
  switch (action.type) {
    case types.REQUEST_CUSTOMERS:
      return Object.assign({}, state, {
        isFetching: true,
        errorMessage: null
      });
    case types.RECEIVE_CUSTOMERS:
      return Object.assign({}, state, {
        isFetching: false,
        customers: action.data,
        errorMessage: null
      });
    case types.SET_CUSTOMER:
      return Object.assign({}, state, {
        customerId: action.data
      });
    case types.FETCH_CUSTOMERS_FAILED: {
      return Object.assign({}, state, {
        isFetching: false,
        errorMessage: action.data
      });
    }

    default:
      return state;
  }
};

export default CustomerReducer;
