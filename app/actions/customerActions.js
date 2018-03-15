import * as ActionConstants from './constants';
import fetchWrapper from "./fetchWrapper";

/************ Synchronous Actions ***************/

//API request for customer list started
export const requestCustomers = () => {
    return {
      type: ActionConstants.REQUEST_CUSTOMERS
    };
  };
  
  //API response for customer list received
  export const receiveCustomers = json => {    
    return {
      type: ActionConstants.RECEIVE_CUSTOMERS,
      data: json
    };
  };
  
  //Set the active customer in global state
  export const setCustomer = (customerId: String): {} => {
    return {
      type: ActionConstants.SET_CUSTOMER,
      data: customerId
    };
  };

/************ Asynchronous Actions ***************/

//request Customer list from API
export const fetchCustomers = () => {
    return function(dispatch) {
      dispatch(requestCustomers());
      return fetchWrapper(2000, fetch(ActionConstants.URL + "/customers"))
        .then(response => response.json())
        .then(json => dispatch(receiveCustomers(json)))
        .catch(error => console.log(error));
    };
  };