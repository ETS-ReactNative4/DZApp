//@flow
import * as types from "../actions/types";

const initialState = {
  isAuthenticating: false,
  cashierId: null,
  isSyncing: false,
  closeouts: []
};

const CashierReducer = (state: {} = initialState, action: {}) => {
  switch (action.type) {
    case types.REQUEST_LOGIN:
      return Object.assign({}, state, {
        isAuthenticating: true,
        cashierId: null
      });
    case types.LOGIN_SUCCESS:
      return Object.assign({}, state, {
        isAuthenticating: false,
        cashierId: action.cashierId
      });
    case types.LOGIN_ERROR:
      return Object.assign({}, state, {
        isAuthenticating: false,
        cashierId: null
      });
    case types.LOGOUT: {
      return Object.assign({}, state, {
        cashierId: null
      });
    }
    case types.LOCAL_CLOSEOUT: {
      let closeout = action.data;
      let newCloseouts = state.closeouts.slice(0);
      newCloseouts.push(closeout);
      console.log(JSON.stringify(newCloseouts));

      return Object.assign({}, state, {
        closeouts: newCloseouts
      });
    }
    case types.CLOSEOUT_SYNC_STARTED: {
      return Object.assign({}, state, {
        isSyncing: true
      });
    }
    case types.CLOSEOUT_SYNC_COMPLETE: {
      return Object.assign({}, state, {
        isSyncing: false,
        closeouts: []
      });
    }
    case types.CLOSEOUT_SYNC_FAILED: {
      return Object.assign({}, state, {
        isSyncing: false
      });
    }
    default:
      return state;
  }
};

export default CashierReducer;
