//@flow
import * as types from "../actions/types";
import * as strings from "../constants/strings";

const initialState = {
  isSyncing: false,
  isProcessed: false,
  topups: [],
  cashInRegister: 0,
  lastTopup: null,
  currentAmount: null,
  currentCustomer: null
};

const TopupReducer = (state: {} = initialState, action: {}) => {
  switch (action.type) {
    case types.SET_TOPUP_AMOUNT: {
      return Object.assign({}, state, {
        currentAmount: action.data
      });
    }
    case types.SET_TOPUP_CUSTOMER: {
      return Object.assign({}, state, {
        currentCustomer: action.data
      });
    }
    case types.LOCAL_TOPUP:
      let topup = action.data;
      let amount = topup.amount;
      let newTopups = state.topups.slice(0);
      newTopups.push(topup);
      return Object.assign({}, state, {
        topups: newTopups,
        cashInRegister: state.cashInRegister + amount,
        lastTopup: topup,
        isProcessed: true
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
    case types.RESET_TOPUP_PROCESSED: {
      return Object.assign({}, state, {
        isProcessed: false
      });
    }
    default:
      return state;
  }
};

export default TopupReducer;
