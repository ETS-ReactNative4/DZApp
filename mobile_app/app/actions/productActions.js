import * as ActionConstants from "./constants";
import fetchWrapper from "./fetchWrapper";

/************ Synchronous Actions ***************/

//API request for product list started
export const requestProducts = () => {
  return {
    type: ActionConstants.REQUEST_PRODUCTS
  };
};

//API response for product list received
export const receiveProducts = json => {
  return {
    type: ActionConstants.RECEIVE_PRODUCTS,
    data: json
  };
};

//failed to get product list from server
export const fetchProductsFailed = (error: {}): {} => {
  return {
    type: ActionConstants.FETCH_PRODUCTS_FAILED,
    data: error
  };
};

/************ Asynchronous Actions ***************/

//request product list from API
export const fetchProducts = () => {
  return function(dispatch) {
    dispatch(requestProducts());
    return fetchWrapper(2000, fetch(ActionConstants.URL + "/products"))
      .then(response => response.json())
      .then(json => dispatch(receiveProducts(json)))
      .catch(error => dispatch(fetchProductsFailed(error)));
  };
};
