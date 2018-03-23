//@flow
import * as types from "../actions/types";

const initialState = {
  orderlines: {}
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
    default: {
      return state;
    }
  }
};

export default OrderReducer;
