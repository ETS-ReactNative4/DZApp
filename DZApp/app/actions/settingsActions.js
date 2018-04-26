//@flow
import * as types from "./types";

/************ Synchronous Actions ***************/

export const setHistoryCount = (count: number): {} => {
  return {
    type: types.SET_HISTORY_COUNT,
    data: count
  };
};
