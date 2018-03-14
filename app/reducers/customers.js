//@flow
import {
  REQUEST_CUSTOMERS,
  RECEIVE_CUSTOMERS,
  LOAD_CUSTOMERS,
  SET_CASHIER,
  SET_CUSTOMER
} from "../actions/types";

const initialState = {
  isFetching: false,
  customers: [],
  customerId: null
};

const reducer = (state: any = initialState, action: any) => {
  switch (action.type) {
    case REQUEST_CUSTOMERS:
      return Object.assign({}, state, {
        isFetching: true
      });
    case RECEIVE_CUSTOMERS:
      return Object.assign({}, state, {
        customers: action.data
      });

    case LOAD_CUSTOMERS:
      return Object.assign({}, state, {
        customers: action.data
      });
    case SET_CUSTOMER:
      return Object.assign({}, state, {
        customerId: action.data
      });
    default:
      return state;
  }
};

export default reducer;
