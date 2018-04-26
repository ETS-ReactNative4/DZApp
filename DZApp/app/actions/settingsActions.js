//@flow
import * as types from "./types";

/************ Synchronous Actions ***************/

export const setHistoryCount = (count: number): {} => {
  return {
    type: types.SET_HISTORY_COUNT,
    data: count
  };
};

export const setServerConfig = (
  port: number,
  address: String,
  scheme: String
): {} => {
  return {
    type: types.SET_SERVER_CONFIG,
    data: { port: port, address: address, scheme: scheme }
  };
};
