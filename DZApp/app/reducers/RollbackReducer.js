//@flow
import * as types from "../actions/types";

const initialState = {
  rollbacks: [],
  isSyncing: false
};

const RollbackReducer = (state: {} = initialState, action: {}) => {
  switch (action.type) {
    case types.LOCAL_ROLLBACK: {
      let newRollbacks = state.rollbacks.slice(0);
      newRollbacks.push(action.data);
      return Object.assign({}, state, { rollbacks: newRollbacks });
    }
    case types.ROLLBACK_SYNC_STARTED: {
      return Object.assign({}, state, {
        isSyncing: true
      });
    }
    case types.ROLLBACK_SYNC_COMPLETE: {
      //remove all locally stored orders
      return Object.assign({}, state, {
        rollbacks: [],
        isSyncing: false
      });
    }
    case types.ROLLBACK_SYNC_FAILED: {
      return Object.assign({}, state, {
        isSyncing: false
      });
    }
    default: {
      return state;
    }
  }
};

export default RollbackReducer;
