//@flow
import * as types from "./types";
// import { URL } from "../constants/serversettings";
//import { fetchWrapper } from "../functions/fetch";
const fetch = require("react-native-cancelable-fetch");
import { NetInfo } from "react-native";
import { sendError, sendMessage } from "./messageActions";
import * as strings from "../constants/strings";
import { Store } from "../store/store";
import { getURL } from "../functions/server";

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
    NetInfo.isConnected
      .fetch()
      .then(isConnected => {
        if (isConnected && !Store.getState().CustomerReducer.isFetching) {
          dispatch(requestCustomers);

          let fetched;

          fetch(getURL() + "/customers", {}, "customers")
            .then(response => {
              fetched = true;
              return response.json();
            })
            .then(json => {
              dispatch(receiveCustomers(json));
              dispatch(sendMessage(strings.SYNCED));
            })
            .catch(error => {
              fetched = true;
              dispatch(fetchCustomersFailed(error));
              dispatch(sendError(error.message));
            });
          //cancel the request after x seconds
          //and send appropriate error messages
          //when unsuccessfull
          setTimeout(() => {
            if (!fetched) {
              fetch.abort("customers");
              dispatch(sendError(strings.SERVER_TIMEOUT));
              dispatch(fetchCustomersFailed(strings.SERVER_TIMEOUT));
            }
          }, 5000);
        } else {
          dispatch(sendError(strings.NO_CONNECTION));
        }
      })
      .catch(err => {
        console.warn(err);
      });
  };
};
