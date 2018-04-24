//@flow
import * as types from "./types";
import { URL } from "../constants/serversettings";
import { fetchWrapper } from "../functions/fetch";

/************ Synchronous Actions ***************/

//API request for customer list started
export const requestCustomers = (): {} => {
  return {
    type: types.REQUEST_CUSTOMERS
  };
};

//API response for customer list received
export const receiveCustomers = (customers): {} => {
  return {
    type: types.RECEIVE_CUSTOMERS,
    data: customers
  };
};

// //Set the active customer in global state
// export const setCustomer = (customerId: String): {} => {
//   return {
//     type: types.SET_CUSTOMER,
//     data: customerId
//   };
// };

//customer list fetch failed
export const fetchCustomersFailed = (error: {}): {} => {
  return {
    type: types.FETCH_CUSTOMERS_FAILED,
    data: error
  };
};

/************ Asynchronous Actions ***************/

//request Customer list from API
export const fetchCustomers = () => {
  return function(dispatch) {
    dispatch(requestCustomers());
    return fetchWrapper(5000, fetch(URL + "/customers"))
      .then(response => response.json())
      .then(json => dispatch(receiveCustomers(json)))
      .catch(error => dispatch(fetchCustomersFailed(error)));
  };
};
