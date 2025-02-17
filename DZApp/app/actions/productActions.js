//@flow
import * as types from "./types";
// import { URL } from "../constants/serversettings";
//import { fetchWrapper } from "../functions/fetch";
const fetch = require("react-native-cancelable-fetch");
import { NetInfo } from "react-native";
import { sendError, sendMessage } from "./messageActions";
import * as strings from "../constants/strings";
import { Store } from "../store/store";
import { getURL, getToken, isLoggedIn } from "../functions/server";
import { logout } from "./cashierActions";

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
          if (!Store.getState().ProductReducer.isFetching && isLoggedIn()) {
            dispatch(requestProducts);

            let fetched;
            console.log(
              "token: " + JSON.stringify("Bearer " + getToken(), null, 4)
            );
            fetch(
              getURL() + "/api/Product",
              {
                method: "GET",
                headers: new Headers({
                  Authorization: "Bearer " + getToken()
                })
              },
              "products"
            )
              .then(response => {
                fetched = true;
                if (response.status === 200) {
                  return response.json();
                } else if (response.status === 401) {
                  //token no longer valid
                  return { refreshToken: "true" };
                }
                return null;
              })
              .then(json => {
                if (json) {
                  if (json.refreshToken) {
                    dispatch(sendError(strings.TOKEN_EXPIRED));
                  } else {
                    dispatch(
                      receiveProducts(
                        json.map(product => ({ ...product, _id: product.id }))
                      )
                    );
                    dispatch(sendMessage(strings.SYNCED));
                  }
                } else {
                  console.log("error fetch products");
                  dispatch(fetchProductsFailed(strings.UNABLE_TO_SYNC));
                  dispatch(sendError(strings.UNABLE_TO_SYNC));
                }
              })
              .catch(error => {
                console.log(
                  "error fetching products: " +
                    JSON.stringify(error.message, null, 4)
                );
                fetched = true;
                dispatch(fetchProductsFailed(strings.UNABLE_TO_SYNC));
                dispatch(sendError(strings.UNABLE_TO_SYNC));
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
      .catch(err => {
        console.warn(err);
      });
  };
};
