//@flow
import * as types from "../actions/types";
import * as strings from "../constants/strings";

const initialState = {
  isSyncing: false,
  topups: [],
  cashInRegister: 0
};

const TopupReducer = (state: {} = initialState, action: {}) => {
  switch (action.type) {
    case types.LOCAL_TOPUP:
      let amount = action.data.amount;
      let newTopups = state.topups.slice(0);
      newTopups.push(action.data);
      return Object.assign({}, state, {
        topups: newTopups,
        cashInRegister: state.cashInRegister + amount
      });
    case types.TOPUP_SYNC_STARTED: {
      return Object.assign({}, state, {
        isSyncing: true
      });
    }
    case types.TOPUP_SYNC_COMPLETE: {
      //remove all locally stored topups
      return Object.assign({}, state, {
        topups: [],
        isSyncing: false
      });
    }
    case types.TOPUP_SYNC_FAILED: {
      return Object.assign({}, state, {
        isSyncing: false
      });
    }
    default:
      return state;
  }
};

export default TopupReducer;
