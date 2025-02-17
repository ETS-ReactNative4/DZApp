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

export const removeMessage = (): {} => {
  return {
    type: types.REMOVE_MESSAGE
  };
};

export const removeError = (): {} => {
  return {
    type: types.REMOVE_ERROR
  };
};