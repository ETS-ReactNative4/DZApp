//@flow

import {
  NEW_ORDER,
  ADD_ITEM_TO_ORDER,
  REMOVE_ITEM_FROM_ORDER
} from "../actions/types";
import Order from "../models/Order";

export const mkOrderState = (order: Order = new Order()) => {
  return {
    order: order
  };
};

function addItemToOrder(order: Order, productId: number, quantity: number) {
  order.addUnits(productId, quantity);
  //console.log(productId + ": " + order.getQuantity(productId));
  return mkOrderState(order);
}

function removeItemFromOrder(order: Order, productId: number) {
  order.removeUnit(productId);
  //console.log(productId + ": " + order.getQuantity(productId));
  return mkOrderState(order);
}

const reducer = (state: Order = mkOrderState(), action: any) => {
  switch (action.type) {
    case NEW_ORDER:
      return mkOrderState();
    case ADD_ITEM_TO_ORDER:
      return addItemToOrder(
        state.order,
        action.data.productId,
        action.data.quantity
      );
    case REMOVE_ITEM_FROM_ORDER:
      return removeItemFromOrder(state.order, action.data.productId);
    default:
      return state;
  }
};

export default reducer;
