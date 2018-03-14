//@flow
import {
  REQUEST_CUSTOMERS,
  RECEIVE_CUSTOMERS,
  LOAD_CUSTOMERS,
  SET_CUSTOMER,
  SET_CASHIER,
  LOGIN_SUCCESS,
  LOGIN_ERROR
} from "./types";
import Roles from "../models/Roles";
import CustomerDAO from "../lib/data/mockremote/CustomerDAO";
import Customer from "../models/Customer";
import Store from "../Store";
import fetchWrapper from "./fetchWrapper";

//request customer list from API
export const requestCustomers = () => {
  return {
    type: REQUEST_CUSTOMERS
  };
};

//receive customer list from API
export const receiveCustomers = json => {
  let customers = [];
  for (let i = 0; i < json.length; i++) {
    customers.push(Customer.fromObject(json[i]));
  }

  return {
    type: RECEIVE_CUSTOMERS,
    data: customers
  };
};

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

export const login = (userCredentials: {}, navigation: {}) => {
  let customers = Store.getState().customerReducer.customers;
  let cashiers = customers.filter(c => c.role === Roles.CASHIER);
  let cashierId = null;

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

  if (cashierId) {
    navigation.navigate("EventScreen");
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

//asynchronous actions for API calls
export const fetchCustomers = () => {
  return function(dispatch) {
    dispatch(requestCustomers());

    // return fetch("http://10.0.0.2:8000/customers", {
    //   method: "GET",
    //   timeout: 10
    // })
    //   .then(response => response.json(), error => dispatch(loadCustomers()))
    //   .then(json => dispatch(receiveCustomers(json)));
    return fetchWrapper(1000, fetch("http://10.0.2.2:8000/customers"))
      .then(response => response.json())
      .then(json => dispatch(receiveCustomers(json)))
      .catch(error => console.log("An error occured", error));
  };
};
