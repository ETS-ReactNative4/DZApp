//@flow

import * as types from "./types";

import { Store } from "../store/store";
import { NetInfo } from "react-native";
import { URL } from "../constants/serversettings";

//functions
import { fetchWrapper } from "../functions/fetch";

//actions
import { fetchCustomers } from "./customerActions";
import { fetchProducts } from "./productActions";
import { fetchSubscriptions } from "./subscriptionActions";
import { syncOrders, localOrder } from "./orderActions";
import { syncTopups, localTopup } from "./topupActions";

import { sendMessage, sendError } from "./messageActions";

//constants
import * as strings from "../constants/strings";

/************ Synchronous Actions ***************/
export const localRollback = (rollback: {}): {} => {
  return {
    type: types.LOCAL_ROLLBACK,
    data: rollback
  };
};

export const rollbackSyncStarted = () => {
  return { type: types.ROLLBACK_SYNC_STARTED };
};

export const rollbackSyncComplete = () => {
  return { type: types.ROLLBACK_SYNC_COMPLETE };
};

export const rollbackSyncFailed = () => {
  return { type: types.ROLLBACK_SYNC_FAILED };
};

/************ Asynchronous Actions ***************/

export const processRollback = (rollback: {}) => {
  return function(dispatch) {
    //adds a rollback to the unsynced rollbacks global state
    dispatch(localRollback(rollback));
    if (rollback.orderId) {
      //performs a negative order locally
      let order = Store.getState().OrderReducer.history.find(
        o => o.localId === rollback.orderId
      );
      dispatch(localOrder(negativeOrder(order), true));
    } else {
      //performs a negative topup locally
      let topup = Store.getState().TopupReducer.history.find(
        t => t.localId === rollback.topupId
      );
      dispatch(localTopup(negativeTopup(topup), true));
    }

    //attemp to sync rollbacks with backend
    NetInfo.isConnected
      .fetch()
      .then(isConnected => {
        if (isConnected) {
          //first attempt to sync unsynced orders and topups,
          //so the localid's of these objects are known in backend
          dispatch(syncOrders());
          dispatch(syncTopups());
          dispatch(syncRollbacks());
        } else {
          dispatch(sendError(strings.NO_CONNECTION));
        }
      })
      .catch(err => {
        console.warn(err);
      });
  };
};

export const syncRollbacks = () => {
  console.log("sync rollbacks...");

  return function(dispatch) {
    dispatch(rollbackSyncStarted());
    let rollbacks = Store.getState().RollbackReducer.rollbacks;
    return fetchWrapper(
      5000,
      fetch(URL + "/rollbacks", {
        method: "POST",
        body: JSON.stringify(rollbacks),
        headers: new Headers({
          "Content-Type": "application/json"
        })
      })
    )
      .then(response => {
        if (response.status === 200) {
          dispatch(sendMessage(strings.SYNCED));
          dispatch(rollbackSyncComplete());
          //get up to date information from backend
          dispatch(fetchCustomers());
          dispatch(fetchProducts());
          dispatch(fetchSubscriptions());
        } else {
          dispatch(sendError(strings.UNABLE_TO_SYNC));
          dispatch(rollbackSyncFailed());
        }
      })
      .catch(err => {
        dispatch(sendError(strings.UNABLE_TO_SYNC));
        dispatch(rollbackSyncFailed());
      });
  };
};

const negativeOrder = order => {
  let negativeOrder = Object.assign({}, order);
  negativeOrder.amtPayedFromCredit = -negativeOrder.amtPayedFromCredit;
  negativeOrder.amtPayedFromSubscriptionFee = -negativeOrder.amtPayedFromSubscriptionFee;
  negativeOrder.orderlines.forEach(ol => {
    ol.quantity = -ol.quantity;
  });
  return negativeOrder;
};

const negativeTopup = topup => {
  let negativeTopup = Object.assign({}, topup);
  negativeTopup.amount = -negativeTopup.amount;
  return negativeTopup;
};
