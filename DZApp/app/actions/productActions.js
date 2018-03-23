//@flow
import * as types from "./types";
import { URL } from "../constants/serversettings";
import { fetchWrapper } from "../functions/fetch";

/************ Synchronous Actions ***************/

//API request for product list started
export const requestProducts = () => {
  return {
    type: types.REQUEST_PRODUCTS
  };
};

//API response for product list received
export const receiveProducts = (products: []): {} => {
  return {
    type: types.RECEIVE_PRODUCTS,
    data: products
  };
};

//product list fetch failed
export const fetchProductsFailed = (error: {}): {} => {
  return {
    type: types.FETCH_PRODUCTS_FAILED,
    data: error
  };
};

/************ Asynchronous Actions ***************/

//request product list from API
export const fetchProducts = () => {
  return function(dispatch) {
    dispatch(requestProducts());
    return fetchWrapper(5000, fetch(URL + "/products"))
      .then(response => response.json())
      .then(json => dispatch(receiveProducts(json)))
      .catch(error => dispatch(fetchProductsFailed(error)));
  };
};
