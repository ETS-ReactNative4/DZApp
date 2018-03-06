//@flow
import React, { Component } from "react";

import { Platform, StyleSheet, Text, View } from "react-native";

import { StackNavigator, TabNavigator, TabBarTop } from "react-navigation";

import LoginScreen from "./containers/LoginScreen";
import ChooseEventScreen from "./containers/ChooseEventScreen";
import CategoryScreen from "./containers/CategoryScreen";
import CategoryDAO from "./lib/data/CategoryDAO";

import { Provider } from "react-redux";
import { createStore, applyMiddleware, combineReducers, compose } from "redux";
import thunkMiddleware from "redux-thunk";
import createLogger from "redux-logger";

type Props = {};
type State = {
  rootstack: StackNavigator
};

export default class App extends Component<Props, State> {
  componentWillMount() {
    const screens = {};
    CategoryDAO.fetchAll().forEach(category => {
      screens[category.name] = {
        screen: props => <CategoryScreen {...props} category={category} />
      };
    });

    const OrderTabs = TabNavigator(screens, {
      tabBarPosition: "bottom",
      animationEnabled: true,
      tabBarComponent: TabBarTop,
      tabBarOptions: {
        scrollEnabled: true
      }
    });

    const RootStack = StackNavigator(
      {
        Login: {
          screen: LoginScreen
        },
        ChooseEvent: {
          screen: ChooseEventScreen
        },
        OrderScreen: {
          screen: OrderTabs
        }
      },
      {
        initialRouteName: "OrderScreen"
      }
    );
    this.setState({ rootstack: RootStack });
  }

  constructor(props: Props) {
    super(props);
    this.state = {
      rootstack: null
    };
  }

  render() {
    if (this.state.rootstack) return <this.state.rootstack />;
    else return <Text>Nuthing</Text>;
  }
}
