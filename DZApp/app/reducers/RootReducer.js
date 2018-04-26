import { combineReducers } from "redux";

import CashierReducer from "./CashierReducer";
import EventReducer from "./EventReducer";
import CustomerReducer from "./CustomerReducer";
import ProductReducer from "./ProductReducer";
import OrderReducer from "./OrderReducer";
import TopupReducer from "./TopupReducer";
import SubscriptionReducer from "./SubscriptionReducer";
import RollbackReducer from "./RollbackReducer";
import MessageReducer from "./MessageReducer";
import SettingsReducer from "./SettingsReducer";

import { AsyncStorage } from "react-native";

import { persistReducer } from "redux-persist";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";

//redux-persist configuration => defines the storage and which parts of the state
//managed by the individual reducers gets persisted/rehydrated

const rootPersistConfig = {
  key: "root",
  storage: AsyncStorage,
  stateReconciler: autoMergeLevel2,
  blacklist: [
    "CashierReducer",
    "EventReducer",
    "ProductReducer",
    "OrderReducer",
    "TopupReducer",
    "SubscriptionReducer",
    "RollbackReducer",
    "MessageReducer",
    "SettingsReducer"
  ]
};

const cashierPersistConfig = {
  key: "CashierReducer",
  storage: AsyncStorage,
  whitelist: ["cashierId"],
  stateReconciler: autoMergeLevel2
};

const eventPersistConfig = {
  key: "EventReducer",
  storage: AsyncStorage,
  whitelist: ["events", "eventId"],
  stateReconciler: autoMergeLevel2
};

const customerPersistConfig = {
  key: "CustomerReducer",
  storage: AsyncStorage,
  whitelist: ["customers"],
  stateReconciler: autoMergeLevel2
};

const productPersistConfig = {
  key: "ProductReducer",
  storage: AsyncStorage,
  whitelist: ["products"],
  stateReconciler: autoMergeLevel2
};

const orderPersistConfig = {
  key: "OrderReducer",
  storage: AsyncStorage,
  whitelist: ["orders", "lastOrder", "history","historyCount"],
  stateReconciler: autoMergeLevel2
};

const topupPersistConfig = {
  key: "TopupReducer",
  storage: AsyncStorage,
  whitelist: ["topups", "cashInRegister", "lastTopup", "history","historyCount"],
  stateReconciler: autoMergeLevel2
};

const subscriptionPersistConfig = {
  key: "SubscriptionReducer",
  storage: AsyncStorage,
  whitelist: ["subscriptions"],
  stateReconciler: autoMergeLevel2
};

const rollbackPersistConfig = {
  key: "RollbackReducer",
  storage: AsyncStorage,
  whitelist: ["subscriptions"],
  stateReconciler: autoMergeLevel2
};

const settingsPersistConfig = {
  key: "SettingsReducer",
  storage: AsyncStorage,
  whitelist: ["historyCount"],
  stateReconciler: autoMergeLevel2
};

//combined reducer => each reducer manages a part of the global state
//these different reducers are combined in a RootReducer, which we
//will use to create our global state store (see store.js)
const RootReducer = combineReducers({
  CashierReducer: persistReducer(cashierPersistConfig, CashierReducer),
  EventReducer: persistReducer(eventPersistConfig, EventReducer),
  CustomerReducer: persistReducer(customerPersistConfig, CustomerReducer),
  ProductReducer: persistReducer(productPersistConfig, ProductReducer),
  OrderReducer: persistReducer(orderPersistConfig, OrderReducer),
  TopupReducer: persistReducer(topupPersistConfig, TopupReducer),
  SubscriptionReducer: persistReducer(
    subscriptionPersistConfig,
    SubscriptionReducer
  ),
  RollbackReducer: persistReducer(rollbackPersistConfig, RollbackReducer),
  SettingsReducer: persistReducer(settingsPersistConfig, SettingsReducer),
  MessageReducer: MessageReducer
});

export default persistReducer(rootPersistConfig, RootReducer);
