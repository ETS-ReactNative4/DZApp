import {
  NEW_ORDER,
  ADD_ITEM_TO_ORDER,
  REMOVE_ITEM_FROM_ORDER,
  CONFIRM_ORDER
} from "./types";
import Order from "../models/Order";
import OrderLine from "../models/OrderLine";

export const newOrder = () => {
  return {
    type: NEW_ORDER,
    data: {}
  };
};

export const addItemToOrder = (productId, quantity) => {
  return {
    type: ADD_ITEM_TO_ORDER,
    data: {
      productId: productId,
      quantity: quantity
    }
  };
};

export const removeItemFromOrder = productId => {
  return {
    type: REMOVE_ITEM_FROM_ORDER,
    data: {
      productId: productId
    }
  };
};
