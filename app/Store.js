//@flow
import { createStore, applyMiddleware } from "redux";
import { AsyncStorage } from "react-native";

import { fetchCustomers } from "./actions/customerActions";
import { fetchEvents } from "./actions/eventActions";

//redux-persist
import { persistStore } from "redux-persist";

//middleware
import thunk from "redux-thunk";
import { createLogger } from "redux-logger";

//reducer
import rootReducer from "./reducers/index";

const middleware = [thunk, createLogger()];

export const store = createStore(rootReducer, applyMiddleware(...middleware));
//after rehydrating the store, we fetch updated list from backend (e.g. customers, products,...)
export const persistor = persistStore(store, null, () => {
  store.dispatch(fetchCustomers());
  store.dispatch(fetchEvents());
});
