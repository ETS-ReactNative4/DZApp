//@flow
import * as types from "./types";
// import { URL } from "../constants/serversettings";
//import { fetchWrapper } from "../functions/fetch";
const fetch = require("react-native-cancelable-fetch");
import { NetInfo } from "react-native";
import { sendError, sendMessage } from "./messageActions";
import { logout } from "./cashierActions";
import * as strings from "../constants/strings";
import { Store } from "../store/store";
import { getURL, getToken, isLoggedIn } from "../functions/server";

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
    //fix for known ios NetInfo bug: add an eventlistener
    //https://github.com/facebook/react-native/issues/8615
    const onInitialNetConnection = isConnected => {
      //console.log(`Is initially connected: ${isConnected}`);
      NetInfo.isConnected.removeEventListener(onInitialNetConnection);
    };

    NetInfo.isConnected.addEventListener(
      "connectionChange",
      onInitialNetConnection
    );
    NetInfo.isConnected
      .fetch()
      .then(isConnected => {
        if (isConnected) {
          if (!Store.getState().CustomerReducer.isFetching && isLoggedIn()) {
            dispatch(requestCustomers);

            let fetched;

            fetch(
              getURL() + "/api/Customer",
              {
                method: "GET",
                headers: new Headers({
                  Authorization: "Bearer " + getToken()
                })
              },
              "customers"
            )
              .then(response => {
                fetched = true;
                if (response.status === 200) {
                  return response.json();
                } else if (response.status === 401) {
                  //token no longer valid
                  return { refreshToken: "true" };
                }
                return null;
              })
              .then(json => {
                if (json) {
                  if (json.refreshToken) {
                    dispatch(sendError(strings.TOKEN_EXPIRED));
                  } else {
                    dispatch(
                      receiveCustomers(
                        json.map(customer => ({
                          ...customer,
                          _id: customer.id,
                          role:
                            customer.role == "admin" ? "cashier" : customer.role
                        }))
                      )
                    );
                    dispatch(sendMessage(strings.SYNCED));
                  }
                }
                 else {
                  console.log("error get customer");
                  dispatch(fetchCustomersFailed(strings.UNABLE_TO_SYNC));
                  dispatch(sendError(strings.UNABLE_TO_SYNC));
                }
              })
              .catch(error => {
                console.log(
                  "error get customer: " + JSON.stringify(err, null, 4)
                );

                fetched = true;
                dispatch(fetchCustomersFailed(strings.UNABLE_TO_SYNC));
                dispatch(sendError(strings.UNABLE_TO_SYNC));
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
          }
        } else {
          dispatch(sendError(strings.NO_CONNECTION));
        }
      })
      .catch(err => console.warn(err));
  };
};
