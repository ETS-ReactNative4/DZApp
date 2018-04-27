//@flow
import * as types from "../actions/types";

const initialState = {
  historyCount: 5,
  serverConfig: {
    port: 3000,
    address: "ec2-18-195-140-112.eu-central-1.compute.amazonaws.com",
    scheme: "http"
  }
};

const SettingsReducer = (state: {} = initialState, action: {}) => {
  switch (action.type) {
    case types.SET_HISTORY_COUNT:
      return Object.assign({}, state, {
        historyCount: action.data
      });
    case types.SET_SERVER_CONFIG:
      let newServerConfig = Object.assign({}, state.serverConfig);
      newServerConfig.port = action.data.port;
      newServerConfig.address = action.data.address;
      newServerConfig.scheme = action.data.scheme;

      return Object.assign({}, state, {
        serverConfig: newServerConfig
      });
    default:
      return state;
  }
};

export default SettingsReducer;
