//@flow
//components
import React, { Component } from "react";

//redux and redux-persist
import { Provider, connect } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Store, Persistor } from "./store/store";

//containers
// import LoginScreen from "./containers/LoginScreen";
import LoadingScreen from "./containers/LoadingScreen";
import Navigator from "./containers/Navigator";
import { Root } from "native-base";

//syncing actions
import { fetchEvents } from "./actions/eventActions";
import { fetchCustomers } from "./actions/customerActions";
import { fetchProducts } from "./actions/productActions";
import { fetchSubscriptions } from "./actions/subscriptionActions";
import { syncOrders } from "./actions/orderActions";
import { syncTopups } from "./actions/topupActions";
import { syncRollbacks } from "./actions/rollbackActions";
import { syncAll } from "./actions/syncActions";

//constants
import { SYNC_INTERVAL } from "./constants/appsettings";

type Props = {};
type State = {};

export default class App extends Component {
  render() {
    //Persistor.purge();
    return (
      <Provider store={Store}>
        <PersistGate
          loading={<LoadingScreen />}
          persistor={Persistor}
          onBeforeLift={() => {
            this._onBeforeLift(Store);
          }}
        >
          <Root>
            <Navigator />
          </Root>
        </PersistGate>
      </Provider>
    );
  }

  //do an initial sync and start sync service
  _onBeforeLift(store) {
    console.ignoredYellowBox = ["Setting a timer"];

    this._fetchEvents(store);
    this._fetchCustomers(store);
    this._fetchProducts(store);
    this._fetchSubscriptions(store);
    this._syncOrders(store);
    this._syncTopups(store);
    this._syncRollbacks(store);

    setInterval(() => {
      store.dispatch(syncAll());
    }, SYNC_INTERVAL);
  }

  async _fetchEvents(store) {
    return await store.dispatch(fetchEvents());
  }

  async _fetchCustomers(store) {
    return await store.dispatch(fetchCustomers());
  }

  async _fetchProducts(store) {
    return await store.dispatch(fetchProducts());
  }

  async _fetchSubscriptions(store) {
    return await store.dispatch(fetchSubscriptions());
  }

  async _syncOrders(store) {
    return await store.dispatch(syncOrders());
  }

  async _syncTopups(store) {
    return await store.dispatch(syncTopups());
  }

  async _syncRollbacks(store) {
    return await store.dispatch(syncRollbacks());
  }
}
