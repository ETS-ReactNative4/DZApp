//@flow
import * as types from "../actions/types";
import * as strings from "../constants/strings";

const initialState = {
  isSyncing: false,
  topups: [],
  cashInRegister: 0,
  lastTopup: null,
  currentAmount: null,
  currentCustomer: null,
  history: [],
  historyCount: 5
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
      let rollback = action.data.rollback;
      let topup = action.data.topup;
      if (!rollback) {
        let previousBalance = action.data.previousBalance;
        let lastTopup = Object.assign({}, topup);
        lastTopup.previousBalance = previousBalance;
        let amount = topup.amount;

        //clone the unsynced topup array and add new topup
        let newTopups = state.topups.slice(0);
        newTopups.push(topup);

        //clone the history topup array and add new topup
        //respecting the max history count
        let newHistory = state.history.slice(0);
        newHistory.unshift(topup);
        if (newHistory.length > state.historyCount)
          newHistory = newHistory.slice(0, state.historyCount);

        let newState = Object.assign({}, state, {
          topups: newTopups,
          cashInRegister: state.cashInRegister + amount,
          lastTopup: lastTopup,
          history: newHistory
        });

        console.log("unsynced topups length: " + newState.topups.length);
        return newState;
      } else {
        //remove topup from history in case of a rollback
        let newHistory = state.history.slice(0);
        let topupToRemove = newHistory.find(t => t.localId === topup.localId);
        let index = newHistory.indexOf(topupToRemove);
        newHistory.splice(index, 1);
        return Object.assign({}, state, {
          history: newHistory,
          cashInRegister: state.cashInRegister - topupToRemove.amount
        });
      }

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

    case types.RESET_PREVIOUS_BALANCE: {
      return Object.assign({}, state, {
        previousBalance: null
      });
    }
    case types.SET_HISTORY_COUNT: {
      let newHistory = state.history.slice(0);
      if (newHistory.length > action.data)
        newHistory = newHistory.slice(0, action.data);

      return Object.assign({}, state, {
        historyCount: action.data,
        history: newHistory
      });
    }
    case types.LOCAL_CLOSEOUT: {
      return Object.assign({}, state, {
        history: [],
        cashInRegister: 0
      });
    }
    default:
      return state;
  }
};

export default TopupReducer;
