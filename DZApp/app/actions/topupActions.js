//@flow
import * as types from "./types";
import * as strings from "../constants/strings";

import { NetInfo } from "react-native";
import { URL } from "../constants/serversettings";

//import { fetchWrapper } from "../functions/fetch";
const fetch = require("react-native-cancelable-fetch");

import { fetchCustomers } from "./customerActions";
import { Store } from "../store/store";
import { sendMessage, sendError } from "./messageActions";

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
    NetInfo.isConnected
      .fetch()
      .then(isConnected => {
        if (isConnected) {
          dispatch(syncTopups());
        } else {
          dispatch(sendError(strings.NO_CONNECTION));
        }
      })
      .catch(err => {
        console.warn(err);
      });
  };
};

export const syncTopups = () => {
  return function(dispatch) {
    dispatch(topupSyncStarted());
    let topups = Store.getState().TopupReducer.topups;
    let success;

    fetch(
      URL + "/topups",
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
        if (response.status === 200) {
          success = true;
          dispatch(sendMessage(strings.SYNCED));
          dispatch(topupSyncComplete());
          dispatch(fetchCustomers());
        } else {
          dispatch(sendError(strings.UNABLE_TO_SYNC));
          dispatch(topupSyncFailed());
        }
      })
      .catch(err => {
        dispatch(sendError(strings.UNABLE_TO_SYNC));
        dispatch(topupSyncFailed());
      });

    //cancel the request after x seconds
    //and send appropriate error messages
    //when unsuccessfull  
    setTimeout(() => {
      fetch.abort("topups");
      if (!success) {
        dispatch(sendError(strings.UNABLE_TO_SYNC));
        dispatch(topupSyncFailed());
      }
    }, 5000);
  };
};
