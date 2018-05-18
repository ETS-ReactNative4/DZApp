//@flow
import * as types from "./types";
// import { URL } from "../constants/serversettings";
//import { fetchWrapper } from "../functions/fetch";
const fetch = require("react-native-cancelable-fetch");
import { NetInfo } from "react-native";
import { sendError, sendMessage } from "./messageActions";
import * as strings from "../constants/strings";
import { Store } from "../store/store";
import { getURL } from "../functions/server";

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
    //fix for known ios NetInfo bug: add an eventlistener
    //https://github.com/facebook/react-native/issues/8615
    const onInitialNetConnection = isConnected => {
      console.log(`Is initially connected: ${isConnected}`);
      NetInfo.isConnected.removeEventListener(onInitialNetConnection);
    };
    NetInfo.isConnected.addEventListener(
      "connectionChange",
      onInitialNetConnection
    );
    NetInfo.isConnected
      .fetch()
      .then(isConnected => {
        if (isConnected) {
          if (!Store.getState().ProductReducer.isFetching) {
            dispatch(requestProducts);

            let fetched;

            fetch(getURL() + "/products", {}, "products")
              .then(response => {
                fetched = true;
                return response.json();
              })
              .then(json => {
                dispatch(receiveProducts(json));
                dispatch(sendMessage(strings.SYNCED));
              })
              .catch(error => {
                fetched = true;
                dispatch(fetchProductsFailed(error));
                dispatch(sendError(error.message));
              });
            //cancel the request after x seconds
            //and send appropriate error messages
            //when unsuccessfull
            setTimeout(() => {
              if (!fetched) {
                fetch.abort("products");
                dispatch(sendError(strings.SERVER_TIMEOUT));
                dispatch(fetchProductsFailed(strings.SERVER_TIMEOUT));
              }
            }, 5000);
          }
        } else {
          dispatch(sendError(strings.NO_CONNECTION));
        }
      })
      .catch(err => console.warn(err));
  };
};
