//@flow
//components
import React, { Component } from "react";
import { Text } from "react-native";

//redux
import { Provider, connect } from "react-redux";
import { store, persistor } from "./Store";

//redux-persist
import { PersistGate } from "redux-persist/integration/react";

//containers
import RootNavigator from "./components/RootNavigator";
import LoadingScreen from "./containers/LoadingScreen";

//remove deprecation warns in emulator
import { YellowBox } from "react-native";
YellowBox.ignoreWarnings([
  "Warning: componentWillMount is deprecated",
  "Warning: componentWillReceiveProps is deprecated",
  "Warning: componentWillUpdate is deprecated"
]);

//persistor.purge();

type Props = {};
type State = {};

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={<LoadingScreen />} persistor={persistor}>
          <RootNavigator />
        </PersistGate>
      </Provider>
    );
  }
}
