//@flow
import * as types from "../actions/types";

const initialState = {
  isFetching: false,
  products: [],
  errorMessage: null
};

const ProductReducer = (state: {} = initialState, action: {}) => {
  switch (action.type) {
    case types.REQUEST_PRODUCTS:
      return Object.assign({}, state, {
        isFetching: true,
        errorMessage: null
      });
    case types.RECEIVE_PRODUCTS:
      return Object.assign({}, state, {
        isFetching: false,
        products: action.data,
        errorMessage: null
      });
    case types.FETCH_PRODUCTS_FAILED: {
      return Object.assign({}, state, {
        isFetching: false,
        errorMessage: action.data
      });
    }
    default:
      return state;
  }
};

export default ProductReducer;
