//@flow
import * as types from "../actions/types";

const initialState = {
  historyCount: 5,
  serverConfig: {
    port: 8883,
    address: "ec2-52-29-5-250.eu-central-1.compute.amazonaws.com",
    //address: "192.168.0.132",
    scheme: "http"
  },
  token: null
};

const SettingsReducer = (state: {} = initialState, action: {}) => {
  switch (action.type) {
    case types.LOGIN_SUCCESS:
      return Object.assign({}, state, {
        token: action.token
        //token: "test"
      });
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
