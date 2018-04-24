//@flow
import React, { Component } from "react";

import { BackHandler } from "react-native";

//components
import {
  Container,
  Header,
  Left,
  Right,
  Thumbnail,
  Body,
  Title,
  Content,
  View,
  Button,
  Icon,
  Text,
  CardItem,
  Card,
  Subtitle
} from "native-base";
import { Col, Row, Grid } from "react-native-easy-grid";
import Toast from "react-native-root-toast";

//styles
import styles from "../styles/styles";
import colors from "../styles/colors";

//resources
import * as strings from "../constants/strings";

//functions
import { showInfoToast, showErrorToast } from "../functions/toast";
import { getCustomerById, getFullName } from "../functions/customer";

//actions
import {
  setMinimumOrderTopupAmount,
  setOrderCustomer,
  setOrderTopupAmount
} from "../actions/orderActions";

//redux
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

//navigation
import { NavigationActions } from "react-navigation";

type Props = {};

type State = {
  previousBalance: number,
  currentBalance: number,
  fullname: String,
  amount: number
};

class OrderTopupSuccessScreen extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      previousBalance: props.previousBalance,
      currentBalance: props.currentBalance,
      fullName: props.fullname,
      amount: props.amount
    };
    this.props.setOrderTopupAmount(null);
    this.props.setMinimumOrderTopupAmount(null);

    this._checkLoginState();
    this._checkEventState();
  }

  render() {
    return (
      <Container>
        {/* HEADER */}
        <Header style={styles.primaryBackground}>
          <Left>
            <Thumbnail
              square
              small
              source={require("../assets/images/logo.gif")}
            />
          </Left>
          <Body>
            <Title>{strings.ORDER}</Title>
            <Subtitle>{strings.TOPPED_UP}</Subtitle>
          </Body>
          <Right>
            <Button transparent>
              <Icon name="menu" />
            </Button>
          </Right>
        </Header>
        {/* HEADER END */}
        {/* CONTENT */}
        <Content padder contentContainerStyle={styles.scrollviewCenter}>
          {this._renderTopupInfo()}
        </Content>
        {/* CONTENT END */}
      </Container>
    );
  }

  _renderTopupInfo = () => {
    return (
      <Card>
        <CardItem header>
          <Text>{strings.TOPPED_UP}</Text>
        </CardItem>
        <CardItem>
          <Grid>
            <Row>
              <Text style={styles.label}>{strings.CUSTOMER}</Text>
            </Row>
            <Row style={styles.valueRow}>
              <Text style={styles.value}>{this.state.fullName}</Text>
            </Row>
            <Row>
              <Text style={styles.label}>{strings.PREV_BALANCE}</Text>
            </Row>
            <Row style={styles.valueRow}>
              <Text style={styles.value}>{this.state.previousBalance}</Text>
            </Row>
            <Row>
              <Text style={styles.label}>{strings.AMOUNT_LABEL}</Text>
            </Row>
            <Row style={styles.valueRow}>
              <Text style={styles.value}>{this.state.amount}</Text>
            </Row>
            <Row>
              <Text style={styles.label}>{strings.CURRENT_BALANCE}</Text>
            </Row>
            <Row style={styles.valueRow}>
              <Text style={styles.value}>{this.state.currentBalance}</Text>
            </Row>
          </Grid>
        </CardItem>
        <CardItem>
          <Body>
            <Button
              full
              style={styles.primaryActionButton}
              onPress={() => this._onFinishOrderButtonPress()}
            >
              <Text style={styles.primaryButtonText}>
                {strings.FINISH_ORDER}
              </Text>
            </Button>
          </Body>
        </CardItem>
      </Card>
    );
  };

  _checkLoginState = () => {
    if (!this.props.cashierId) this.props.navigation.navigate("AuthNavigator");
  };

  _checkEventState = () => {
    if (!this.props.eventId) this.props.navigation.navigate("EventScreen");
  };

  componentDidUpdate() {
    if (this.props.message !== null) {
      showInfoToast(this.props.message);
    }
    if (this.props.error !== null) {
      showErrorToast(this.props.error);
    }
  }

  componentDidMount() {
    BackHandler.addEventListener(
      "hardwareBackPress",
      this._onBackButtonPressAndroid
    );
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      "hardwareBackPress",
      this._onBackButtonPressAndroid
    );
  }

  _onBackButtonPressAndroid = () => {
    this._onFinishOrderButtonPress();
    return true;
  };

  _onFinishOrderButtonPress = () => {
    const resetAction = NavigationActions.reset({
      index: 3,
      actions: [
        NavigationActions.navigate({ routeName: "ProductScreen" }),
        NavigationActions.navigate({ routeName: "OverviewScreen" }),
        NavigationActions.navigate({ routeName: "OrderCustomerScreen" }),
        NavigationActions.navigate({ routeName: "OrderConfirmScreen" })
      ]
    });
    this.props.navigation.dispatch(resetAction);
  };
}

const mapStateToProps = state => {
  let topup = state.TopupReducer.lastTopup;
  let previousBalance = topup.previousBalance;
  let amount = topup.amount;
  let customer = getCustomerById(
    topup.customerId,
    state.CustomerReducer.customers
  );
  let currentBalance = customer.creditBalance;

  let fullname = customer ? getFullName(customer) : "";
  let previousBalanceString = previousBalance
    ? previousBalance.toFixed(2) + " €"
    : "0.00 €";
  let amountString = amount ? amount.toFixed(2) + " €" : "0.00 €";
  let currentBalanceString = currentBalance
    ? currentBalance.toFixed(2) + " €"
    : "0.00 €";

  return {
    fullname: fullname,
    previousBalance: previousBalanceString,
    currentBalance: currentBalanceString,
    amount: amountString,
    message: state.MessageReducer.message,
    error: state.MessageReducer.error,
    cashierId: state.CashierReducer.cashierId,
    eventId: state.EventReducer.eventId
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    { setOrderTopupAmount, setMinimumOrderTopupAmount, setOrderCustomer },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(
  OrderTopupSuccessScreen
);
