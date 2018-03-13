//@flow
import {
  LOAD_CUSTOMERS,
  SET_CUSTOMER,
  SET_CASHIER,
  LOGIN_SUCCESS,
  LOGIN_ERROR
} from "./types";
import Roles from "../models/Roles";
import CustomerDAO from "../lib/data/mockremote/CustomerDAO";
import Store from "../Store";
// import { NavigationActions } from "react-navigation";
// import dispatch from "redux-thunk";

export const loadCustomers = () => {
  let customers = CustomerDAO.fetchAll();
  return {
    type: LOAD_CUSTOMERS,
    data: customers
  };
};

export const setCustomer = (customerId: number): {} => {
  return {
    type: SET_CUSTOMER,
    data: customerId
  };
};

export const login = (userCredentials: {}) => {
  let customers = Store.getState().customerReducer.customers;
  let cashiers = customers.filter(c => c.role === Roles.CASHIER);
  let cashierId = -1;

  for (let i = 0; i < cashiers.length; i++) {
    let userName = cashiers[i].userName;
    let regexp = new RegExp(userName, "i");
    if (
      userCredentials.userName.match(regexp) &&
      userCredentials.password === cashiers[i].hashedPass
    ) {
      cashierId = cashiers[i].id;
      break;
    }
  }

  if (cashierId !== -1) {
    return {
      type: LOGIN_SUCCESS,
      data: cashierId
    };
  } else {
    return {
      type: LOGIN_ERROR
    };
  }
};
