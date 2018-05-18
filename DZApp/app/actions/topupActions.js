//@flow
import * as types from "./types";
import * as strings from "../constants/strings";

import { NetInfo } from "react-native";
//import { URL } from "../constants/serversettings";

//import { fetchWrapper } from "../functions/fetch";
const fetch = require("react-native-cancelable-fetch");

import { fetchCustomers } from "./customerActions";
import { Store } from "../store/store";
import { sendMessage, sendError } from "./messageActions";
import { getURL } from "../functions/server";

/************ Synchronous Actions ***************/

//API request for product list started
export const setTopupAmount = (amount: number): {} => {
  return {
    type: types.SET_TOPUP_AMOUNT,
    data: amount
  };
};

export const setTopupCustomer = (customer: {}): {} => {
  return {
    type: types.SET_TOPUP_CUSTOMER,
    data: customer
  };
};

export const localTopup = (topup: {}, rollback: boolean = false): {} => {
  let customers = Store.getState().CustomerReducer.customers;
  let customer = customers.find(c => c._id === topup.customerId);
  let previousBalance = customer.creditBalance;

  return {
    type: types.LOCAL_TOPUP,
    data: { topup: topup, previousBalance: previousBalance, rollback: rollback }
  };
};

export const topupSyncStarted = () => {
  return { type: types.TOPUP_SYNC_STARTED };
};

export const topupSyncComplete = () => {
  return { type: types.TOPUP_SYNC_COMPLETE };
};

export const topupSyncFailed = () => {
  return { type: types.TOPUP_SYNC_FAILED };
};

/************ Asynchronous Actions ***************/

export const topupBalance = (topup: {}) => {
  return function(dispatch) {
    dispatch(localTopup(topup));
    dispatch(syncTopups());
  };
};

export const syncTopups = () => {
  return function(dispatch) {
    //fix for known ios NetInfo bug: add an eventlistener
    //https://github.com/facebook/react-native/issues/8615
    const onInitialNetConnection = isConnected => {
      console.log(`Is initially connected: ${isConnected}`);
      NetInfo.isConnected.removeEventListener(onInitialNetConnection);
    };
    NetInfo.isConnected.addEventListener(
      "connectionChange",
      onInitialNetConnection
    );
    NetInfo.isConnected
      .fetch()
      .then(isConnected => {
        if (isConnected && !Store.getState().TopupReducer.isSyncing) {
          let topups = Store.getState().TopupReducer.topups;
          if (topups.length > 0) {
            console.log("topups to sync: " + JSON.stringify(topups, null, 4));
            dispatch(topupSyncStarted());

            let fetched;

            fetch(
              getURL() + "/api/BalanceTopup/CreateRange",
              {
                method: "POST",
                body: JSON.stringify(topups),
                headers: new Headers({
                  "Content-Type": "application/json"
                })
              },
              "topups"
            )
              .then(response => {
                fetched = true;
                if (response.status === 200) {
                  dispatch(sendMessage(strings.SYNCED));
                  dispatch(topupSyncComplete());
                  // dispatch(fetchCustomers());
                } else {
                  dispatch(sendError(strings.UNABLE_TO_SYNC));
                  dispatch(topupSyncFailed());
                }
              })
              .catch(err => {
                fetched = true;
                dispatch(sendError(strings.UNABLE_TO_SYNC));
                dispatch(topupSyncFailed());
              });

            //cancel the request after x seconds
            //and send appropriate error messages
            //when unsuccessfull
            setTimeout(() => {
              if (!fetched) {
                fetch.abort("topups");
                dispatch(sendError(strings.SERVER_TIMEOUT));
                dispatch(topupSyncFailed());
              }
            }, 5000);
          }
        } else {
          dispatch(sendError(strings.NO_CONNECTION));
        }
      })
      .catch(err => {
        console.warn(err);
      });
  };
};
