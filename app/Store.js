//@flow
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { createLogger } from "redux-logger";
import rootReducer from "./reducers/index";
import {
  createReduxBoundAddListener,
  createReactNavigationReduxMiddleware
} from "react-navigation-redux-helpers";

const loggerMiddleWare = createLogger();

const Store = createStore(
  rootReducer,
  applyMiddleware(thunk, loggerMiddleWare)
);

export default Store;
