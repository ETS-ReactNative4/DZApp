import { combineReducers } from "redux";

import customerReducer from "./customers";
import cashierReducer from "./cashiers";
import eventReducer from "./events";
import productReducer from "./products";

import { AsyncStorage } from "react-native";

import { persistReducer } from "redux-persist";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";

//redux-persist configurations
const rootPersistConfig = {
  key: "root",
  storage: AsyncStorage,
  stateReconciler: autoMergeLevel2,
  blacklist: ["cashierReducer", "customerReducer", "eventReducer"]
};

const customerReducerPersistConfig = {
  key: "customerReducer",
  storage: AsyncStorage,
  whitelist: ["customers"],
  stateReconciler: autoMergeLevel2
};

const eventReducerPersistConfig = {
  key: "eventReducer",
  storage: AsyncStorage,
  whitelist: ["events"],
  stateReconciler: autoMergeLevel2
};

const cashierReducerPersistConfig = {
  key: "cashierReducer",
  storage: AsyncStorage,
  whitelist: ["cashierId"],
  stateReconciler: autoMergeLevel2
};

const productReducerPersistConfig = {
  key: "productReducer",
  storage: AsyncStorage,
  whitelist: ["products"],
  stateReconciler: autoMergeLevel2
}

//create root reducer with persist configs
const reducer = combineReducers({
  customerReducer: persistReducer(
    customerReducerPersistConfig,
    customerReducer
  ),
  eventReducer: persistReducer(eventReducerPersistConfig, eventReducer),
  cashierReducer: persistReducer(cashierReducerPersistConfig, cashierReducer),
  productReducer: persistReducer(productReducerPersistConfig,productReducer)
});

export default persistReducer(rootPersistConfig, reducer);
