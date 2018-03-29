//@flow
import React, { Component } from "react";

import { BackHandler } from "react-native";

//components
import {
  Container,
  Header,
  Left,
  Thumbnail,
  Body,
  Title,
  Content,
  View,
  Footer,
  FooterTab,
  Button,
  Icon,
  Text,
  CardItem,
  Card
} from "native-base";
import { Col, Row, Grid } from "react-native-easy-grid";
import Toast from "react-native-root-toast";

//styles
import styles from "../styles/styles";
import colors from "../styles/colors";

//resources
import * as strings from "../constants/strings";

//functions
import { toStringWithDecimals } from "../functions/number";
import { showInfoToast, showErrorToast } from "../functions/toast";

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

class TopupSuccessScreen extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      previousBalance: props.previousBalance,
      currentBalance: props.currentBalance,
      fullName: props.fullname,
      amount: props.amount
    };
    this._checkLoginState();
  }

  render() {
    let fullname = this.props.fullname;
    let previousBalance =
      toStringWithDecimals(this.props.previousBalance, 2) + " €";
    let currentBalance =
      toStringWithDecimals(this.props.currentBalance, 2) + " €";
    let amount = toStringWithDecimals(this.props.amount, 2) + " €";

    return (
      <Container>
        <Header style={styles.primaryBackground}>
          <Left>
            <Thumbnail
              square
              source={require("../assets/images/site_dz.jpg")}
            />
          </Left>
          <Body>
            <Title>{strings.TOPUP}</Title>
          </Body>
        </Header>
        <Content padder contentContainerStyle={styles.scrollviewCenter}>
          {this._renderTopupInfo()}
        </Content>
        <Footer>
          <FooterTab style={styles.primaryBackground}>
            <Button
              vertical
              onPress={() => {
                this.props.navigation.navigate("OrderScreen");
              }}
            >
              <Icon name="grid" />
              <Text style={styles.tabbarText}>{strings.ORDER}</Text>
            </Button>
            <Button
              vertical
              onPress={() => {
                this.props.navigation.navigate("OverviewScreen");
              }}
            >
              <Icon name="list" />
              <Text style={[styles.tabbarText, styles.white]}>
                {strings.OVERVIEW}
              </Text>
            </Button>
            <Button vertical style={styles.secondaryBackground}>
              <Icon name="cash" style={styles.white} />
              <Text style={[styles.tabbarText, styles.white]}>
                {strings.TOPUP}
              </Text>
            </Button>
            <Button vertical>
              <Icon name="clock" />
              <Text style={styles.tabbarText}>{strings.HISTORY}</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }

  _checkLoginState = () => {
    if (!this.props.cashierId) this.props.navigation.navigate("AuthNavigator");
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
    this._onTopupButtonPress();
    return true;
  };

  _renderTopupInfo = () => {
    return (
      <Card>
        <CardItem header>
          <Text>{strings.TOPUP_COMPLETE}</Text>
        </CardItem>
        <CardItem>
          <Grid>
            <Col style={{ width: 125, marginRight: 10 }}>
              <Row>
                <Text style={styles.label}>{strings.CUSTOMER}</Text>
              </Row>
              <Row>
                <Text style={styles.label}>{strings.PREV_BALANCE}</Text>
              </Row>
              <Row>
                <Text style={styles.label}>{strings.AMOUNT_LABEL}</Text>
              </Row>
              <Row>
                <Text style={styles.label}>{strings.CURRENT_BALANCE}</Text>
              </Row>
            </Col>
            <Col>
              <Row>
                <Text style={styles.value}>{this.state.fullname}</Text>
              </Row>
              <Row>
                <Text style={styles.value}>{this.state.previousBalance}</Text>
              </Row>
              <Row>
                <Text style={styles.value}>{this.state.amount}</Text>
              </Row>
              <Row>
                <Text style={styles.value}>{this.state.currentBalance}</Text>
              </Row>
            </Col>
          </Grid>
        </CardItem>
        <CardItem footer>
          <Grid>
            <Col>
              <Button
                transparent
                full
                small
                onPress={() => {
                  this._onPOSButtonPress();
                }}
              >
                <Text style={styles.smallButtonText}>{strings.TO_POS}</Text>
              </Button>
            </Col>
            <Col>
              <Button
                transparent
                full
                small
                onPress={() => {
                  this._onTopupButtonPress();
                }}
              >
                <Text style={styles.smallButtonText}>{strings.TO_TOPUP}</Text>
              </Button>
            </Col>
          </Grid>
        </CardItem>
      </Card>
    );
  };

  _onPOSButtonPress = () => {
    this.props.navigation.navigate("OrderScreen");
  };

  _onTopupButtonPress = () => {
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({
          routeName: "TopupAmountScreen",
          params: { reset: true }
        })
      ]
    });
    this.props.navigation.dispatch(resetAction);
  };
}

const mapStateToProps = state => {
  let topup = state.TopupReducer.lastTopup;
  let previousBalance = state.TopupReducer.previousBalance;
  let amount = topup.amount;
  let customer = state.CustomerReducer.customers.find(
    c => c._id === topup.customerId
  );
  let currentBalance = customer.creditBalance;

  let fullname = `${customer.firstName} ${customer.lastName}`;
  let previousBalanceString = toStringWithDecimals(previousBalance, 2) + " €";
  let amountString = toStringWithDecimals(amount, 2) + " €";
  let currentBalanceString = toStringWithDecimals(currentBalance, 2) + " €";

  return {
    fullname: fullname,
    previousBalance: previousBalanceString,
    currentBalance: currentBalanceString,
    amount: amountString,
    message: state.MessageReducer.message,
    error: state.MessageReducer.error,
    cashierId: state.CashierReducer.cashierId
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({}, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(TopupSuccessScreen);
