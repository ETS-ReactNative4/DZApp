//navigation
import { StackNavigator, SwitchNavigator } from "react-navigation";

//containers
import LoadingScreen from "./LoadingScreen";
import LoginScreen from "./LoginScreen";
import EventScreen from "./EventScreen";
import OrderScreen from "./OrderScreen";
import OverviewScreen from "./OverviewScreen";
import TopupScreen from "./TopupScreen";
import TopupSuccessScreen from "./TopUpSuccessScreen";

const TopupNavigator = StackNavigator(
  {
    TopupScreen: {
      screen: TopupScreen
    },
    TopupSuccessScreen: {
      screen: TopupSuccessScreen
    }
  },
  {
    initialRouteName: "TopupScreen",
    headerMode: "none"
  }
);

const MainFlowNavigator = SwitchNavigator(
  {
    OrderScreen: {
      screen: OrderScreen
    },
    OverviewScreen: {
      screen: OverviewScreen
    },
    TopupNavigator: {
      screen: TopupNavigator
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
    initialRouteName: "LoadingScreen"
  }
);

export default Navigator;
