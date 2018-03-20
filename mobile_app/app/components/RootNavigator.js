//@flow
import React, { Component } from "react";
import { StackNavigator, SwitchNavigator } from "react-navigation";

import LoginScreen from "../containers/LoginScreen";
import EventScreen from "../containers/EventScreen";
import LoadingScreen from "../containers/LoadingScreen";
import OrderScreen from "../containers/OrderScreen";

import LogoTitle from "../components/LogoTitle";
import colors from "../styles/colors";

const flowNavigator = StackNavigator(
  {
    OrderScreen: {
      screen: OrderScreen,
      navigationOptions: {
        title: "Bestellen"
      }
    }
  },
  {
    initialRouteName: "OrderScreen",
    navigationOptions: {
      headerStyle: {
        backgroundColor: colors.PRIMARY_COLOR
      },
      headerTintColor: colors.TITLE_COLOR,
      headerTitleStyle: {
        fontWeight: "bold"
      },
      headerTitle: props => <LogoTitle title={props.children} />
    }
  }
);

const RootNavigator = SwitchNavigator(
  {
    LoadingScreen: {
      screen: LoadingScreen
    },
    LoginScreen: {
      screen: LoginScreen
      // navigationOptions: {
      //   title: "Aanmelden"
      // }
    },
    EventScreen: {
      screen: EventScreen
      // navigationOptions: {
      //   title: "Kies Evenement"
      // }
    },
    MainFlow: flowNavigator
  },
  {
    initialRouteName: "MainFlow",
    navigationOptions: {
      headerStyle: {
        backgroundColor: colors.PRIMARY_COLOR
      },
      headerTintColor: colors.TITLE_COLOR,
      headerTitleStyle: {
        fontWeight: "bold"
      },
      headerTitle: props => <LogoTitle title={props.children} />
    }
  }
);

export default RootNavigator;
