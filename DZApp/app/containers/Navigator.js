//navigation
import { StackNavigator, SwitchNavigator } from "react-navigation";

//containers
import LoadingScreen from "./LoadingScreen";
import LoginScreen from "./LoginScreen";
import EventScreen from "./EventScreen";
import OrderScreen from "./OrderScreen";
import OverviewScreen from "./OverviewScreen";
import TopupScreen from "./TopupScreen";

const MainFlowNavigator = SwitchNavigator(
  {
    OrderScreen: {
      screen: OrderScreen
    },
    OverviewScreen: {
      screen: OverviewScreen
    },
    TopupScreen: {
      screen: TopupScreen
    }
  },
  {
    initialRouteName: "TopupScreen",
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
    initialRouteName: "LoadingScreen"
  }
);

export default Navigator;
