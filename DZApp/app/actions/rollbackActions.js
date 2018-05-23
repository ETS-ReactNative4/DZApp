//@flow

import * as types from "./types";

import { Store } from "../store/store";
import { NetInfo } from "react-native";
// import { URL } from "../constants/serversettings";

//functions
//import { fetchWrapper } from "../functions/fetch";
const fetch = require("react-native-cancelable-fetch");

//actions
import { localOrder } from "./orderActions";
import { localTopup, syncTopups } from "./topupActions";
import { fetchCustomers } from "./customerActions";
import { fetchProducts } from "./productActions";
import { fetchSubscriptions } from "./subscriptionActions";
import { syncOrders } from "./orderActions";

import { sendMessage, sendError } from "./messageActions";

//constants
import * as strings from "../constants/strings";
import { getURL, getToken, isLoggedIn } from "../functions/server";
import { logout } from "./cashierActions";

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
    dispatch(syncRollbacks);
  };
};

export const syncRollbacks = () => {
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
        if (isConnected) {
          if (!Store.getState().RollbackReducer.isSyncing && isLoggedIn()) {
            let rollbacks = Store.getState().RollbackReducer.rollbacks;

            if (rollbacks.length > 0) {
              dispatch(rollbackSyncStarted);

              //sync orders/topups first in case we want to rollback
              //a previously unsynced o/t remotely
              // (localid not known in backend)
              dispatch(syncOrders());
              dispatch(syncTopups());

              //only sync rollbacks when no unsynced orders or topups remain
              let topups = Store.getState().TopupReducer.topups;
              let orders = Store.getState().OrderReducer.orders;
              if (topups.length === 0 && orders.length === 0) {
                let fetched;

                console.log(rollbacks);

                fetch(
                  getURL() + "/api/Rollback/CreateRange",
                  {
                    method: "POST",
                    body: JSON.stringify(rollbacks),
                    headers: new Headers({
                      Authorization: "Bearer " + getToken(),
                      "Content-Type": "application/json"
                    })
                  },
                  "rollbacks"
                )
                  .then(response => {
                    fetched = true;
                    if (response.status === 200 || response.status === 201) {
                      dispatch(sendMessage(strings.SYNCED));
                      dispatch(rollbackSyncComplete());
                    } else if (response.status === 401) {
                      //token is no longer valid => log out the cashier
                      dispatch(sendError(strings.TOKEN_EXPIRED));
                    } else {
                      console.log("error post rollback");
                      dispatch(sendError(strings.UNABLE_TO_SYNC));
                      dispatch(rollbackSyncFailed());
                    }
                  })
                  .catch(err => {
                    console.log(
                      "error post rollback: " + JSON.stringify(err, null, 4)
                    );

                    fetched = true;
                    dispatch(sendError(strings.UNABLE_TO_SYNC));
                    dispatch(rollbackSyncFailed());
                  });

                //cancel the request after x seconds
                //and send appropriate error messages
                //when unsuccessfull
                setTimeout(() => {
                  if (!fetched) {
                    fetch.abort("rollbacks");
                    dispatch(sendError(strings.SERVER_TIMEOUT));
                    dispatch(rollbackSyncFailed());
                  }
                }, 5000);
              }
            }
          }
        } else {
          dispatch(sendError(strings.NO_CONNECTION));
        }
      })
      .catch(err => console.warn(err));
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
