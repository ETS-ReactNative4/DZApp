//@flow
import * as types from "./types";

/************ Synchronous Actions ***************/

export const sendMessage = (message: String): {} => {
  return {
    type: types.SEND_MESSAGE,
    data: message
  };
};

export const sendError = (error: String): {} => {
  return {
    type: types.SEND_ERROR,
    data: error
  };
};

//API response for customer list received
export const removeMessage = (): {} => {
  return {
    type: types.REMOVE_MESSAGE
  };
};

//Set the active customer in global state
export const removeError = (): {} => {
  return {
    type: types.REMOVE_ERROR
  };
};

/************ Asynchronous Actions ***************/
