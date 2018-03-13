//@flow
import React, { Component } from "react";
import { StackNavigator } from "react-navigation";
import LoginScreen from "../containers/LoginScreen";
import EventScreen from "../containers/EventScreen";
import LogoTitle from "../components/LogoTitle";
import colors from "../styles/colors";

const RootNavigator = StackNavigator(
  {
    LoginScreen: {
      screen: LoginScreen,
      navigationOptions: {
        title: "Aanmelden"
      }
    },
    EventScreen: {
      screen: EventScreen,
      navigationOptions: {
        title: "Kies Evenement"
      }
    }
  },
  {
    initialRouteName: "LoginScreen",
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
