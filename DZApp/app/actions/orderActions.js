//@flow
import * as types from "./types";

import { Store } from "../store/store";
import { NetInfo } from "react-native";
//import { URL } from "../constants/serversettings";

//functions
import { getCustomerById } from "../functions/customer";
import { getEventById } from "../functions/event";
// import { fetchWrapper } from "../functions/fetch";
const fetch = require("react-native-cancelable-fetch");
//actions
import { fetchCustomers } from "./customerActions";
import { fetchProducts } from "./productActions";
import { fetchSubscriptions } from "./subscriptionActions";
import { sendMessage, sendError } from "./messageActions";

//constants
import * as strings from "../constants/strings";
import { getURL } from "../functions/server";

/************ Synchronous Actions ***************/
export const setProductQuantity = (productId: number, quantity: number): {} => {
  return {
    type: types.SET_PRODUCT_QUANTITY,
    data: {
      productId: productId,
      quantity: quantity
    }
  };
};

export const resetOrder = () => {
  return {
    type: types.RESET_ORDER
  };
};

export const setOrderCustomer = (customer: {}): {} => {
  return {
    type: types.SET_ORDER_CUSTOMER,
    data: customer
  };
};

export const setMinimumOrderTopupAmount = (amount: number): {} => {
  return {
    type: types.SET_MINIMUM_ORDER_TOPUP_AMOUNT,
    data: amount
  };
};

export const setOrderTopupAmount = (amount: number): {} => {
  return {
    type: types.SET_ORDER_TOPUP_AMOUNT,
    data: amount
  };
};

export const localOrder = (order: {}, rollback: boolean = false): {} => {
  let customer = getCustomerById(
    order.customerId,
    Store.getState().CustomerReducer.customers
  );
  let event = getEventById(order.eventId, Store.getState().EventReducer.events);
  let subscription = null;
  if (event.type === "event") {
    subscription = Store.getState().SubscriptionReducer.subscriptions.find(
      s => s.eventId === event._id && s.customerId === customer._id
    );
  }
  return {
    type: types.LOCAL_ORDER,
    data: {
      order: order,
      previousBalance: customer.creditBalance,
      previousSubscriptionBalance: subscription
        ? subscription.remainingCredit
        : null,
      rollback: rollback
    }
  };
};

export const orderSyncStarted = () => {
  return { type: types.ORDER_SYNC_STARTED };
};

export const orderSyncComplete = () => {
  return { type: types.ORDER_SYNC_COMPLETE };
};

export const orderSyncFailed = () => {
  return { type: types.ORDER_SYNC_FAILED };
};

/************ Asynchronous Actions ***************/
export const processOrder = (order: {}) => {
  return function(dispatch) {
    dispatch(localOrder(order));
    dispatch(syncOrders());
  };
};

export const syncOrders = () => {
  return function(dispatch) {
     //fix for known ios NetInfo bug: add an eventlistener
    //https://stackoverflow.com/questions/48766705/ios-netinfo-isconnected-returns-always-false
    NetInfo.isConnected.fetch().then(isConnected => {});
    NetInfo.isConnected.addEventListener("connectionChange", isConnected => {
      if (isConnected) {
        if (!Store.getState().OrderReducer.isSyncing) {
          let orders = Store.getState().OrderReducer.orders;

          if (orders.length > 0) {
            console.log("orders to sync: " + JSON.stringify(orders));
            dispatch(orderSyncStarted());

            let fetched;

            fetch(
              getURL() + "/orders",
              {
                method: "POST",
                body: JSON.stringify(orders),
                headers: new Headers({
                  "Content-Type": "application/json"
                })
              },
              "orders"
            )
              .then(response => {
                if (response.status === 200) {
                  fetched = true;
                  dispatch(sendMessage(strings.SYNCED));
                  dispatch(orderSyncComplete());
                  console.log("orders synced");
                  // dispatch(fetchCustomers());
                  // dispatch(fetchProducts());
                  // dispatch(fetchSubscriptions());
                } else {
                  fetched = true;
                  dispatch(sendError(strings.UNABLE_TO_SYNC));
                  dispatch(orderSyncFailed());
                }
              })
              .catch(err => {
                fetched = true;
                dispatch(sendError(strings.UNABLE_TO_SYNC));
                dispatch(orderSyncFailed());
              });

            //cancel the request after x seconds
            //and send appropriate error messages
            //when unsuccessfull
            setTimeout(() => {
              if (!fetched) {
                fetch.abort("orders");
                dispatch(sendError(strings.SERVER_TIMEOUT));
                dispatch(orderSyncFailed());
              }
            }, 5000);
          }
        }
      } else {
        dispatch(sendError(strings.NO_CONNECTION));
      }
    });
  };
};
