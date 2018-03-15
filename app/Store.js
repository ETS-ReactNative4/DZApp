//@flow
import { createStore, applyMiddleware } from "redux";
import { AsyncStorage } from "react-native";

import {fetchCustomers} from "./actions/creators";

//redux-persist
import { persistStore, persistReducer } from "redux-persist";

//middleware
import thunk from "redux-thunk";
import { createLogger } from "redux-logger";

//reducer
import rootReducer from "./reducers/index";

const middleware = [thunk, createLogger()];

export const store = createStore(rootReducer, applyMiddleware(...middleware));
export const persistor = persistStore(store, null,() => store.dispatch(fetchCustomers()));
