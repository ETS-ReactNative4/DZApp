//@flow

import * as types from "./types";

import { Store } from "../store/store";
import { NetInfo } from "react-native";
import { URL } from "../constants/serversettings";

//functions
import { getCustomerById } from "../functions/customer";
import { getEventById } from "../functions/event";
import { fetchWrapper } from "../functions/fetch";

//actions
import { fetchCustomers } from "./customerActions";
import { fetchProducts } from "./productActions";
import { sendMessage, sendError } from "./messageActions";

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

export const localOrder = (order: {}): {} => {
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
      previousSubscriptionBalance: subscription.remainingCredit
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
    NetInfo.isConnected
      .fetch()
      .then(isConnected => {
        if (isConnected) {
          dispatch(syncOrders());
        } else {
          dispatch(sendError(strings.NO_CONNECTION));
        }
      })
      .catch(err => {
        console.warn(err);
      });
  };
};

export const syncOrders = () => {
  return function(dispatch) {
    dispatch(orderSyncStarted());
    let orders = Store.getState().OrderReducer.orders;
    return fetchWrapper(
      5000,
      fetch(URL + "/orders", {
        method: "POST",
        body: JSON.stringify(orders),
        headers: new Headers({
          "Content-Type": "application/json"
        })
      })
    )
      .then(response => {
        if (response.status === 200) {
          dispatch(sendMessage(strings.SYNCED));
          dispatch(orderSyncComplete());
          dispatch(fetchCustomers());
          dispatch(fetchProducts());
        } else {
          dispatch(sendError(strings.UNABLE_TO_SYNC));
          dispatch(orderSyncFailed());
        }
      })
      .catch(err => {
        dispatch(sendError(strings.UNABLE_TO_SYNC));
        dispatch(orderSyncFailed());
      });
  };
};
