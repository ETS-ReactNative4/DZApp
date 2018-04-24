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
import { calculateTotal } from "../functions/order";

//actions
import { setOrderCustomer, resetOrder } from "../actions/orderActions";

//redux
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

//navigation
import { NavigationActions } from "react-navigation";

type Props = {};

type State = {};

class OrderSuccessScreen extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.props.resetOrder();
    this.props.setOrderCustomer(null);

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
            <Subtitle>{strings.ORDER_PROCESSED}</Subtitle>
          </Body>
          <Right />
        </Header>
        {/* HEADER END */}
        {/* CONTENT */}
        <Content padder contentContainerStyle={styles.scrollviewCenter}>
          {this._renderOrderInfo()}
        </Content>
        {/* CONTENT END */}
      </Container>
    );
  }

  _renderOrderInfo = () => {
    let isEvent = this.props.event.type === "event";

    return (
      <Card>
        <CardItem header>
          <Text>{strings.ORDER_PROCESSED}</Text>
        </CardItem>
        <CardItem bordered>
          <Grid>
            <Row>
              <Text style={styles.label}>{strings.EVENT}</Text>
            </Row>
            <Row style={styles.valueRow}>
              <Text style={styles.value}>{this.props.event.name}</Text>
            </Row>
            <Row>
              <Text style={styles.label}>{strings.CASHIER}</Text>
            </Row>
            <Row style={styles.valueRow}>
              <Text style={styles.value}>{this.props.cashierFullname}</Text>
            </Row>
          </Grid>
        </CardItem>
        <CardItem bordered>
          <Grid>
            <Row>
              <Text style={styles.label}>{strings.CUSTOMER}</Text>
            </Row>
            <Row style={styles.valueRow}>
              <Text style={styles.value}>{this.props.fullname}</Text>
            </Row>
            <Row>
              <Text style={styles.label}>{strings.PREV_BALANCE}</Text>
            </Row>
            <Row style={styles.valueRow}>
              <Text style={styles.value}>{this.props.previousBalance}</Text>
            </Row>
            {isEvent && (
              <View>
                <Row>
                  <Text style={styles.label}>
                    {strings.PREV_SUBSCRIPTION_BALANCE_LABEL}
                  </Text>
                </Row>
                <Row style={styles.valueRow}>
                  <Text style={styles.value}>
                    {this.props.previousSubscriptionBalance}
                  </Text>
                </Row>
              </View>
            )}
          </Grid>
        </CardItem>
        <CardItem bordered>
          <Grid>
            <Row>
              <Text style={styles.label}>{strings.PAYED_TOTAL_LABEL}</Text>
            </Row>
            <Row style={styles.valueRow}>
              <Text style={styles.value}>{this.props.payedTotal}</Text>
            </Row>
            <Row>
              <Text style={styles.label}>
                {strings.PAYED_FROM_CREDIT_LABEL}
              </Text>
            </Row>
            <Row style={styles.valueRow}>
              <Text style={styles.value}>{this.props.amtPayedFromCredit}</Text>
            </Row>
            {isEvent && (
              <View>
                <Row>
                  <Text style={styles.label}>
                    {strings.PAYED_FROM_SUBSCRIPTIONFEE_LABEL}
                  </Text>
                </Row>
                <Row style={styles.valueRow}>
                  <Text style={styles.value}>
                    {this.props.amtPayedFromSubscriptionFee}
                  </Text>
                </Row>
              </View>
            )}
          </Grid>
        </CardItem>
        <CardItem bordered>
          <Grid>
            <Row>
              <Text style={styles.label}>{strings.CURRENT_BALANCE}</Text>
            </Row>
            <Row style={styles.valueRow}>
              <Text style={styles.value}>{this.props.currentBalance}</Text>
            </Row>
            {isEvent && (
              <View>
                <Row>
                  <Text style={styles.label}>
                    {strings.CURRENT_SUBSCRIPTION_BALANCE_LABEL}
                  </Text>
                </Row>
                <Row style={styles.valueRow}>
                  <Text style={styles.value}>
                    {this.props.currentSubscriptionBalance}
                  </Text>
                </Row>
              </View>
            )}
          </Grid>
        </CardItem>
        <CardItem>
          <Body>
            <Button
              full
              style={styles.primaryActionButton}
              onPress={() => this._onConfirmButtonPress()}
            >
              <Text style={styles.primaryButtonText}>
                {strings.BACK_TO_PRODUCT_INPUT}
              </Text>
            </Button>
          </Body>
        </CardItem>
      </Card>
    );
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
    this._onConfirmButtonPress();
    return true;
  };

  _checkLoginState = () => {
    if (!this.props.cashierId) this.props.navigation.navigate("AuthNavigator");
  };

  _checkEventState = () => {
    if (!this.props.event._id) this.props.navigation.navigate("EventScreen");
  };

  _onConfirmButtonPress = () => {
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: "ProductScreen" })]
    });
    this.props.navigation.dispatch(resetAction);
  };
}

const mapStateToProps = state => {
  //values
  let order = state.OrderReducer.lastOrder;
  let event = state.EventReducer.events.find(e => e._id === order.eventId);
  let customer = getCustomerById(
    order.customerId,
    state.CustomerReducer.customers
  );
  let cashier = getCustomerById(
    state.CashierReducer.cashierId,
    state.CustomerReducer.customers
  );
  let payedTotal = order.orderlines
    ? calculateTotal(order.orderlines, state.ProductReducer.products)
    : "";
  let amtPayedFromCredit = order.amtPayedFromCredit;
  let amtPayedFromSubscriptionFee = order.amtPayedFromSubscriptionFee;
  let previousBalance = order.previousBalance;
  let previousSubscriptionBalance = order.previousSubscriptionBalance;
  let currentBalance = customer.creditBalance;
  let currentSubscriptionBalance = null;
  if (event.type === "event") {
    let subscription = state.SubscriptionReducer.subscriptions.find(
      s => s.customerId === order.customerId && s.eventId === order.eventId
    );
    currentSubscriptionBalance = subscription.remainingCredit;
  }

  //strings
  let fullname = getFullName(customer);
  let cashierFullname = getFullName(cashier);
  let payedTotalString = payedTotal.toFixed(2) + " €";
  let amtPayedFromCreditString = amtPayedFromCredit.toFixed(2) + " €";
  let amtPayedFromSubscriptionFeeString = amtPayedFromSubscriptionFee
    ? amtPayedFromSubscriptionFee.toFixed(2) + " €"
    : "0.00 €";
  let previousBalanceString = previousBalance.toFixed(2) + " €";
  let previousSubscriptionBalanceString = previousSubscriptionBalance
    ? previousSubscriptionBalance.toFixed(2) + " €"
    : "0.00 €";
  let currentBalanceString = currentBalance.toFixed(2) + " €";
  let currentSubscriptionBalanceString = currentSubscriptionBalance
    ? currentSubscriptionBalance.toFixed(2) + " €"
    : "0.00 €";

  return {
    fullname: fullname,
    cashierFullname: cashierFullname,
    previousBalance: previousBalanceString,
    currentBalance: currentBalanceString,
    previousSubscriptionBalance: previousSubscriptionBalanceString,
    currentSubscriptionBalance: currentSubscriptionBalanceString,
    payedTotal: payedTotalString,
    amtPayedFromCredit: amtPayedFromCreditString,
    amtPayedFromSubscriptionFee: amtPayedFromSubscriptionFeeString,
    message: state.MessageReducer.message,
    error: state.MessageReducer.error,
    cashierId: state.CashierReducer.cashierId,
    event: event
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ setOrderCustomer, resetOrder }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderSuccessScreen);
