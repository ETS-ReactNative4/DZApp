//navigation
import { StackNavigator, SwitchNavigator } from "react-navigation";

//containers
import LoadingScreen from "./LoadingScreen";
import LoginScreen from "./LoginScreen";
import EventScreen from "./EventScreen";

//OrderNavigator
import OrderScreen from "./OrderScreen";
import OverviewScreen from "./OverviewScreen";
import OrderCustomerScreen from "./OrderCustomerScreen";
import OrderAmountScreen from "./OrderAmountScreen";
import OrderTopupConfirmScreen from "./OrderTopupConfirmScreen";
import OrderTopupSuccessScreen from "./OrderTopupSuccessScreen";
import OrderConfirmScreen from "./OrderConfirmScreen";
import OrderSuccessScreen from "./OrderSuccessScreen";

//TopupNavigator
import TopupAmountScreen from "./TopupAmountScreen";
import TopupCustomerScreen from "./TopupCustomerScreen";
import TopupSuccessScreen from "./TopUpSuccessScreen";
import TopupConfirmScreen from "./TopupConfirmScreen";

const TopupNavigator = StackNavigator(
  {
    TopupAmountScreen: {
      screen: TopupAmountScreen
    },
    TopupCustomerScreen: {
      screen: TopupCustomerScreen
    },
    TopupConfirmScreen: {
      screen: TopupConfirmScreen
    },
    TopupSuccessScreen: {
      screen: TopupSuccessScreen
    }
  },
  {
    initialRouteName: "TopupAmountScreen",
    headerMode: "none"
  }
);

const AuthNavigator = StackNavigator(
  {
    LoginScreen: {
      screen: LoginScreen
    }
  },
  {
    initialRouteName: "LoginScreen",
    headerMode: "none"
  }
);

const OrderNavigator = StackNavigator(
  {
    ProductScreen: {
      screen: OrderScreen
    },
    OverviewScreen: {
      screen: OverviewScreen
    },
    OrderCustomerScreen: {
      screen: OrderCustomerScreen
    },
    OrderAmountScreen: {
      screen: OrderAmountScreen
    },
    OrderTopupConfirmScreen: {
      screen: OrderTopupConfirmScreen
    },
    OrderTopupSuccessScreen: {
      screen: OrderTopupSuccessScreen
    },
    OrderConfirmScreen: {
      screen: OrderConfirmScreen
    },
    OrderSuccessScreen: {
      screen: OrderSuccessScreen
    }
  },
  {
    initialRouteName: "ProductScreen",
    headerMode: "none"
  }
);

const MainFlowNavigator = SwitchNavigator(
  {
    OrderScreen: {
      screen: OrderNavigator
    },
    TopupNavigator: {
      screen: TopupNavigator
    }
  },
  {
    initialRouteName: "TopupNavigator",
    headerMode: "none"
  }
);

const Navigator = SwitchNavigator(
  {
    LoadingScreen: {
      screen: LoadingScreen
    },
    AuthNavigator: {
      screen: AuthNavigator
    },
    EventScreen: {
      screen: EventScreen
    },
    MainFlowNavigator: {
      screen: MainFlowNavigator
    }
  },
  {
    initialRouteName: "EventScreen"
  }
);

export default Navigator;
