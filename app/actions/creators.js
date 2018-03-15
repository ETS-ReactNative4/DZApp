//@flow
import * as ActionTypes from "./types";
import Roles from "../models/Roles";
import CustomerDAO from "../lib/data/mockremote/CustomerDAO";
import Customer from "../models/Customer";
import { store, persistor } from "../Store";
import fetchWrapper from "./fetchWrapper";

//ip addres to access localhost from android emulator
const URI = "http://10.0.0.2:8000"

/************ Synchronous Actions ***************/

//API request for customer list started
export const requestCustomers = () => {
  return {
    type: ActionTypes.REQUEST_CUSTOMERS
  };
};

//API response for customer list received
export const receiveCustomers = json => {
  let customers = [];
  for (let i = 0; i < json.length; i++) {
    //customers.push(Customer.fromObject(json[i]));
    customers.push(json[i]);
  }

  return {
    type: ActionTypes.RECEIVE_CUSTOMERS,
    data: customers
  };
};

//Set the active customer in global state
export const setCustomer = (customerId: number): {} => {
  return {
    type: ActionTypes.SET_CUSTOMER,
    data: customerId
  };
};

export const requestLogin = () => {
  return {
    type: ActionTypes.REQUEST_LOGIN,
  }
}

export const loginSuccess = (id:String) => {
  return {
    type: ActionTypes.LOGIN_SUCCESS,
    data: id
  }
}

export const loginError = (error:String) => {
  return {
    type: ActionTypes.LOGIN_ERROR,
    data: error
  }
}

/************ Asynchronous Actions ***************/

//request Customer list from API
export const fetchCustomers = () => {
  return function(dispatch) {
    dispatch(requestCustomers());
    return fetchWrapper(2000, fetch(URI + "/customers"))
      .then(response => response.json())
      .then(json => dispatch(receiveCustomers(json)))
      .catch(error => console.log(error));
  };
};

//authentication against the API, since we don't want to store sensitive information
//on mobile device
export const login = (userCredentials:{},navigation:{}) => {
  return function(dispatch){

    dispatch(requestLogin());

    return fetchWrapper(2000,
    fetch(URI + "/customers/login",{
      method:'POST',
      body: JSON.stringify(userCredentials),
      headers: new Headers({
        'Content-Type':'application/json'
      })
    })).then(response => response.json())
    .then(json => {
      if(json.error){
        dispatch(loginError(json.error));
      } else{
        navigation.navigate("EventScreen");
        dispatch(loginSuccess(json.id));
      } 
    })
    .catch(error => dispatch(loginError(error.message)));
  }
}
