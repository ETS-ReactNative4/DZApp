//@flow
import { LOAD_CUSTOMERS, SET_CASHIER, SET_CUSTOMER } from "../actions/types";

const initialState = {
  customers: [],
  customerId: -1
};

const reducer = (state: any = initialState, action: any) => {
  switch (action.type) {
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
