//@flow

import * as types from "./types";

//set the amount in the orderline corresponding to
//the given productId to the given quantity
export const setProductQuantity = (productId: number, quantity: number): {} => {
  return {
    type: types.SET_PRODUCT_QUANTITY,
    data: {
      productId: productId,
      quantity: quantity
    }
  };
};
