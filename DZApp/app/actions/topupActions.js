//@flow
import * as types from "./types";
import * as strings from "../constants/strings";

import { NetInfo } from "react-native";
import { URL } from "../constants/serversettings";

import { fetchWrapper } from "../functions/fetch";

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

export const localTopup = (topup: {}): {} => {
  let customers = Store.getState().CustomerReducer.customers;
  let customer = customers.find(c => c._id === topup.customerId);
  let previousBalance = customer.creditBalance;

  return {
    type: types.LOCAL_TOPUP,
    data: { topup: topup, previousBalance: previousBalance }
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
    return fetchWrapper(
      5000,
      fetch(URL + "/topups", {
        method: "POST",
        body: JSON.stringify(topups),
        headers: new Headers({
          "Content-Type": "application/json"
        })
      })
    )
      .then(response => {
        if (response.status === 200) {
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
  };
};
