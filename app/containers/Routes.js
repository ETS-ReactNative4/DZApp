//@flow

//react-native
import React, { Component } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";

//nav
import { StackNavigator, TabNavigator, TabBarTop } from "react-navigation";

//containers
import LoginScreen from "./LoginScreen";
import ChooseEventScreen from "./ChooseEventScreen";
import CategoryScreen from "./CategoryScreen";

//other
import CategoryDAO from "../lib/data/CategoryDAO";
import Category from "../models/Category";

//redux
import { connect } from "react-redux";

type Props = {
  categories: Category[]
};
type State = {};

class Routes extends Component<Props, State> {
  constructor(props) {
    super(props);
  }

  render() {
    //create a TabNavigator based on the different product categories
    const screens = {};
    this.props.categories.forEach(category => {
      screens[category.name] = {
        screen: props => <CategoryScreen {...props} category={category} />
      };
    });

    const CategoryTabs = TabNavigator(screens, {
      tabBarPosition: "bottom",
      animationEnabled: true,
      tabBarComponent: TabBarTop,
      tabBarOptions: {
        scrollEnabled: true
      }
    });

    //create the main StackNavigator
    const RootStack = StackNavigator(
      {
        Login: {
          screen: LoginScreen
        },
        ChooseEvent: {
          screen: ChooseEventScreen
        },
        OrderScreen: {
          screen: CategoryTabs
        }
      },
      {
        initialRouteName: "OrderScreen"
      }
    );

    return <RootStack />;
  }
}

const mapStateToProps = state => {
  return {
    categories: state.categories
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Routes);
