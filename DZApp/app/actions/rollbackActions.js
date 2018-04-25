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
import { syncOrders } from "./orderActions";
import { syncTopups } from "./topupActions";
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
    //console.log(order);
    dispatch(localRollback(rollback));
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