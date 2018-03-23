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

//actions
import { fetchEvents } from "./actions/eventActions";
import { fetchCustomers } from "./actions/customerActions";
import { fetchProducts } from "./actions/productActions";

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

  //try to sync with server before lifting the PersistGate
  _onBeforeLift(store) {
    this._fetchEvents(store);
    this._fetchCustomers(store);
    this._fetchProducts(store);
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
}
