//navigation
import { StackNavigator, SwitchNavigator } from "react-navigation";

//containers
import LoadingScreen from "./LoadingScreen";
import LoginScreen from "./LoginScreen";
import EventScreen from "./EventScreen";
import OrderScreen from "./OrderScreen";
import OverviewScreen from "./OverviewScreen";

const MainFlowNavigator = StackNavigator(
  {
    OrderScreen: {
      screen: OrderScreen
    },
    OverviewScreen: {
      screen: OverviewScreen
    }
  },
  {
    initialRouteName: "OrderScreen",
    headerMode: "none"
  }
);

const Navigator = SwitchNavigator(
  {
    LoadingScreen: {
      screen: LoadingScreen
    },
    LoginScreen: {
      screen: LoginScreen
    },
    EventScreen: {
      screen: EventScreen
    },
    MainFlow: {
      screen: MainFlowNavigator
    }
  },
  {
    initialRouteName: "MainFlow"
  }
);

export default Navigator;
