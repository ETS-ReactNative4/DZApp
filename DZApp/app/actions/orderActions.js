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

export const resetOrder = () => {
  return {
    type: types.RESET_ORDER
  };
};

export const setOrderCustomer = (customer: {}):{} => {
  return{
    type: types.SET_ORDER_CUSTOMER,
    data: customer
  }
}

export const setMinimumOrderTopupAmount = (amount: number): {} => {
  return {
    type: types.SET_MINIMUM_ORDER_TOPUP_AMOUNT,
    data: amount
  }
} 

export const setOrderTopupAmount = (amount: number):{} => {
  return{
    type: types.SET_ORDER_TOPUP_AMOUNT,
    data: amount
  }
}
