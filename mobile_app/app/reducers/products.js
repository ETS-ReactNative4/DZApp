//@flow
import * as ActionConstants from "../actions/constants";

const initialState = {
  isFetching: false,
  products: [],
  error: null,
  order: {
    cashierId: null,
    eventId: null,
    customerId: null,
    timestamp: null,
    amountPayedFromCredit: null,
    amountPayedFromSubscriptionFee: null,
    orderlines: {}
  }
};

const reducer = (state: any = initialState, action: any) => {
  switch (action.type) {
    case ActionConstants.REQUEST_PRODUCTS:
      return Object.assign({}, state, {
        isFetching: true,
        error: null
      });
    case ActionConstants.RECEIVE_PRODUCTS:
      return Object.assign({}, state, {
        isFetching: false,
        products: action.data,
        error: null
      });
    case ActionConstants.FETCH_PRODUCTS_FAILED: {
      return Object.assign({}, state, {
        isFetching: false,
        error: action.data
      });
    }
    case ActionConstants.INCREMENT_PRODUCT_QUANTITY: {
      //we don't mutate state directly in redux,
      //hence the object cloning
      let newOrder = Object.assign({}, state.order);
      let newOrderLines = Object.assign({}, state.order.orderlines);
      let oldQuantity = newOrderLines[action.data];
      let newQuantity = oldQuantity ? oldQuantity + 1 : 1;
      newOrderLines[action.data] = newQuantity;
      newOrder.orderlines = newOrderLines;

      return Object.assign({}, state, {
        order: newOrder
      });
    }
    case ActionConstants.SET_PRODUCT_QUANTITY: {
      let newOrder = Object.assign({}, state.order);
      let newOrderLines = Object.assign({}, state.order.orderlines);
      let quantity = action.data.quantity;
      newOrderLines[action.data.productId] = quantity;
      newOrder.orderlines = newOrderLines;

      return Object.assign({}, state, {
        order: newOrder
      });
    }
    default:
      return state;
  }
};

export default reducer;
