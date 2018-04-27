//@flow
import * as types from "../actions/types";

const initialState = {
  orderlines: {},
  currentCustomer: null,
  minTopupAmount: null,
  topupAmount: null,
  orders: [],
  history: [],
  lastOrder: null,
  isSyncing: false,
  historyCount: 5
};

const OrderReducer = (state: {} = initialState, action: {}) => {
  switch (action.type) {
    case types.SET_PRODUCT_QUANTITY: {
      let quantity = action.data.quantity;
      let productId = action.data.productId;

      //clone the old orderlines as not to mutate existing state
      //this is a redux best-practice
      let newOrderlines = Object.assign({}, state.orderlines);
      newOrderlines[productId] = quantity;

      return Object.assign({}, state, { orderlines: newOrderlines });
    }
    case types.RESET_ORDER: {
      return Object.assign({}, state, { orderlines: initialState.orderlines });
    }
    case types.SET_ORDER_CUSTOMER: {
      return Object.assign({}, state, { currentCustomer: action.data });
    }
    case types.SET_MINIMUM_ORDER_TOPUP_AMOUNT: {
      return Object.assign({}, state, { minTopupAmount: action.data });
    }
    case types.SET_ORDER_TOPUP_AMOUNT: {
      return Object.assign({}, state, { topupAmount: action.data });
    }
    case types.LOCAL_ORDER: {
      let rollback = action.data.rollback;
      let order = action.data.order;

      if (!rollback) {
        let previousBalance = action.data.previousBalance;
        let previousSubscriptionBalance =
          action.data.previousSubscriptionBalance;

        //construct the lastOrder object for display in OrderSuccessScreen
        let lastOrder = Object.assign({}, order);
        lastOrder.previousBalance = previousBalance;
        lastOrder.previousSubscriptionBalance = previousSubscriptionBalance;

        //clone the unsynced order array and add new order
        let newOrders = state.orders.slice(0);
        newOrders.push(order);

        //clone the history order array and add new topup
        //to start of array
        //respecting the max history count
        let newHistory = state.history.slice(0);
        newHistory.unshift(order);
        if (newHistory.length > state.historyCount)
          newHistory = newHistory.slice(0, state.historyCount);

        let newState = Object.assign({}, state, {
          orders: newOrders,
          lastOrder: lastOrder,
          history: newHistory
        });

        //console.log("unsynced orders length: " + newState.orders.length);

        return newState;
      } else {
        //remove order from history in case of a rollback
        let newHistory = state.history.slice(0);
        let orderToRemove = newHistory.find(o => o.localId === order.localId);
        let index = newHistory.indexOf(orderToRemove);
        newHistory.splice(index, 1);
        return Object.assign({}, state, { history: newHistory });
      }
    }
    case types.ORDER_SYNC_STARTED: {
      console.log("order sync started");

      return Object.assign({}, state, {
        isSyncing: true
      });
    }
    case types.ORDER_SYNC_COMPLETE: {
      //remove all locally stored orders
      console.log("order sync complete");

      return Object.assign({}, state, {
        orders: [],
        isSyncing: false
      });
    }
    case types.ORDER_SYNC_FAILED: {
      console.log("order sync complete");

      return Object.assign({}, state, {
        isSyncing: false
      });
    }

    case types.SET_HISTORY_COUNT: {
      let newHistory = state.history.slice(0);
      if (newHistory.length > action.data)
        newHistory = newHistory.slice(0, action.data);

      return Object.assign({}, state, {
        historyCount: action.data,
        history: newHistory
      });
    }
    case types.LOCAL_CLOSEOUT: {
      return Object.assign({}, state, {
        history: []
      });
    }
    default: {
      return state;
    }
  }
};

export default OrderReducer;
