//@flow
//components
import React, { Component } from "react";
import { Text } from "react-native";

//redux
import { createStore } from "redux";
import { Provider } from "react-redux";
import { reducer } from "./reducers/index";

//containers
import Routes from "./containers/Routes";

let store = createStore(reducer);

type Props = {};
type State = {};

export default class App extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Provider store={store}>
        <Routes />
      </Provider>
    );
  }
}
