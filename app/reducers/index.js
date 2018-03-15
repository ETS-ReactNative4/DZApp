import { combineReducers } from "redux";
import customerReducer from "./customers";
import cashierReducer from "./cashiers";

import { AsyncStorage } from "react-native";

import { persistReducer } from "redux-persist";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";
//import storage from "redux-persist/lib/storage";

//redux-persist configurations
const rootPersistConfig = {
  key: "root",
  storage: AsyncStorage,
  stateReconciler: autoMergeLevel2,
  blacklist: ["cashierReducer", "customerReducer"]
};

const customerReducerPersistConfig = {
  key: "customerReducer",
  storage: AsyncStorage,
  whitelist: ["customers"],
  stateReconciler: autoMergeLevel2
};

const reducer = combineReducers({
  customerReducer: persistReducer(
    customerReducerPersistConfig,
    customerReducer
  ),
  cashierReducer: cashierReducer
});

export default persistReducer(rootPersistConfig, reducer);
//export default reducer;
