//@flow
import * as types from "../actions/types";
import * as strings from "../constants/strings";

let historyCount = 5;

const initialState = {
  isSyncing: false,
  //isProcessed: false,
  topups: [],
  cashInRegister: 0,
  lastTopup: null,
  currentAmount: null,
  currentCustomer: null,
  previousBalance: null,
  history: []
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
      let topup = action.data.topup;
      let previousBalance = action.data.previousBalance;
      let amount = topup.amount;

      //clone the unsynced topup array and add new topup to the cloned unsynced array
      let newTopups = state.topups.slice(0);
      newTopups.push(topup);

      //clone the history topup array and add new topup to the cloned history array
      //respecting the max history count
      let newHistory = state.topups.slice(0);
      newHistory.unshift(topup);
      if (newHistory.length > historyCount)
        newHistory = newHistory.slice(0, historyCount - 1);

      let newState = Object.assign({}, state, {
        topups: newTopups,
        cashInRegister: state.cashInRegister + amount,
        lastTopup: topup,
        //isProcessed: true,
        previousBalance: previousBalance,
        history: newHistory
      });
      console.log("topup state after local:\n" + JSON.stringify(newState));
      return newState;
    case types.TOPUP_SYNC_STARTED: {
      return Object.assign({}, state, {
        isSyncing: true
      });
    }
    case types.TOPUP_SYNC_COMPLETE: {
      //remove all locally stored topups
      let newState = Object.assign({}, state, {
        topups: [],
        isSyncing: false
      });
      console.log("topup state after sync:\n" + JSON.stringify(newState));
      return newState;
    }
    case types.TOPUP_SYNC_FAILED: {
      return Object.assign({}, state, {
        isSyncing: false
      });
    }
    // case types.RESET_TOPUP_PROCESSED: {
    //   return Object.assign({}, state, {
    //     isProcessed: false
    //   });
    // }
    case types.RESET_PREVIOUS_BALANCE: {
      return Object.assign({}, state, {
        previousBalance: null
      });
    }
    default:
      return state;
  }
};

export default TopupReducer;
