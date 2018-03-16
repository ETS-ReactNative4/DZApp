//@flow
import * as ActionConstants from "../actions/constants";

const initialState = {
  isFetching: false,
  products: [],  
  error: null
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

    default:
      return state;
  }
};

export default reducer;