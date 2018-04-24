//@flow
import * as types from "../actions/types";

const initialState = {
  isFetching: false,
  customers: [],
  //customerId: null,
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
    // case types.SET_CUSTOMER:
    //   return Object.assign({}, state, {
    //     customerId: action.data
    //   });
    case types.FETCH_CUSTOMERS_FAILED: {
      return Object.assign({}, state, {
        isFetching: false,
        errorMessage: action.data
      });
    }
    case types.LOCAL_TOPUP: {
      //get info from action
      let topup = action.data.topup;
      let customerId = topup.customerId;
      let topupAmount = topup.amount;
      //clone the customer and set new balance
      let customer = state.customers.find(c => c._id === customerId);
      let newCustomer = updateCreditBalance(customer, topupAmount);
      //clone the customers and set cloned customer
      let newCustomers = cloneCustomersWithUpdatedCustomer(
        customer,
        newCustomer,
        state.customers
      );

      return Object.assign({}, state, {
        customers: newCustomers
      });
    }
    case types.LOCAL_ORDER: {
      let order = action.data.order;
      let customerId = order.customerId;
      let amtPayedFromCredit = order.amtPayedFromCredit;
      //clone the customer and set the new balance
      let customer = state.customers.find(c => c._id === customerId);
      let newCustomer = updateCreditBalance(customer, -amtPayedFromCredit);
      //clone the customers and set cloned customer
      let newCustomers = cloneCustomersWithUpdatedCustomer(
        customer,
        newCustomer,
        state.customers
      );

      return Object.assign({}, state, {
        customers: newCustomers
      });
    }

    default:
      return state;
  }
};

const updateCreditBalance = (customer: {}, amount: number): {} => {
  let newCustomer = Object.assign({}, customer);
  newCustomer.creditBalance += amount;
  return newCustomer;
};

const cloneCustomersWithUpdatedCustomer = (
  customer: {},
  newCustomer: {},
  customers: []
): [] => {
  let newCustomers = customers.slice(0);
  let index = newCustomers.indexOf(customer);
  newCustomers[index] = newCustomer;
  return newCustomers;
};

export default CustomerReducer;
