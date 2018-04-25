//@flow

import * as types from "./types";

import { Store } from "../store/store";
import { NetInfo } from "react-native";
import { URL } from "../constants/serversettings";

//functions
//import { fetchWrapper } from "../functions/fetch";
const fetch = require("react-native-cancelable-fetch");

//actions
import { localOrder } from "./orderActions";
import { localTopup } from "./topupActions";
import { fetchCustomers } from "./customerActions";
import { fetchProducts } from "./productActions";
import { fetchSubscriptions } from "./subscriptionActions";

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
    dispatch(syncRollbacks);
  };
};

export const syncRollbacks = () => {
  return function(dispatch) {
    NetInfo.isConnected
      .fetch()
      .then(isConnected => {
        if (isConnected) {
          let rollbacks = Store.getState().RollbackReducer.rollbacks;

          if (rollbacks.length > 0) {
            dispatch(rollbackSyncStarted);

            let fetched;

            fetch(
              URL + "/rollbacks",
              {
                method: "POST",
                body: JSON.stringify(rollbacks),
                headers: new Headers({
                  "Content-Type": "application/json"
                })
              },
              "rollbacks"
            )
              .then(response => {
                if (response.status === 200) {
                  fetched = true;
                  dispatch(sendMessage(strings.SYNCED));
                  dispatch(rollbackSyncComplete());
                  dispatch(fetchCustomers());
                  dispatch(fetchProducts());
                  dispatch(fetchSubscriptions());
                } else {
                  fetched = true;
                  dispatch(sendError(strings.UNABLE_TO_SYNC));
                  dispatch(rollbackSyncFailed());
                }
              })
              .catch(err => {
                fetched = true;
                dispatch(sendError(strings.UNABLE_TO_SYNC));
                dispatch(ROLLBACK_SYNC_FAILED());
              });

            //cancel the request after x seconds
            //and send appropriate error messages
            //when unsuccessfull
            setTimeout(() => {
              if (!fetched) {
                fetch.abort("rollbacks");
                dispatch(sendError(strings.UNABLE_TO_SYNC));
                dispatch(rollbackSyncFailed());
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
