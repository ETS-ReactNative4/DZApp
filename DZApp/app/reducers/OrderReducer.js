//@flow
import * as types from "../actions/types";

const initialState = {
  orderlines: {},
  currentCustomer: null,
  minTopupAmount: null,
  topupAmount: null
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
    default: {
      return state;
    }
  }
};

export default OrderReducer;
