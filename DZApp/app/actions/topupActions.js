//@flow
import * as types from "./types";
import * as strings from "../constants/strings";

import { NetInfo } from "react-native";
import { URL } from "../constants/serversettings";

import { fetchWrapper } from "../functions/fetch";

import { fetchCustomers } from "./customerActions";
import { Store } from "../store/store";
import { sendMessage, sendError } from "./messageActions";

import { toStringWithDecimals } from "../functions/number";

/************ Synchronous Actions ***************/

//API request for product list started
export const localTopup = (topup: {}): {} => {
  return {
    type: types.LOCAL_TOPUP,
    data: topup
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

export const resetTopupProcessed = () => {
  return { type: types.RESET_TOPUP_PROCESSED };
};

/************ Asynchronous Actions ***************/

export const topupBalance = (topup: {}) => {
  return function(dispatch) {
    dispatch(localTopup(topup));
    let connectionType;
    NetInfo.isConnected.fetch().then(isConnected => {
      if (isConnected) {
        dispatch(syncTopups());
      }
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
          dispatch(sendError(strings.SYNCED));
          dispatch(topupSyncFailed());
        }
      })
      .catch(err => {
        dispatch(sendError(string.SYNCED));
        dispatch(topupSyncFailed());
      });
  };
};

const _getTopupInfo = topup => {
  let customers = Store.getState().CustomerReducer.customers;
  let customer = customer.find(c => c._id === topup.customerId);
  let fullname = `${customer.firstName} ${customer.lastName}`;

  let previousBalance = customer.creditBalance;
  let amount = topup.amount;
  let nextBalance = previousBalance + amount;
  return {
    fullname: fullname,
    previousBalance: toStringWithDecimals(previousBalance, 2) + " €",
    amount: toStringWithDecimals(amount, 2) + " €",
    currentBalance: toStringWithDecimals(currentBalance, 2) + " €"
  };
};
