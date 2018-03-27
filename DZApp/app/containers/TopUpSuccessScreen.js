//Template screen with basic imports and redux integration

//@flow
import React, { Component } from "react";

//components
import {
  Container,
  Text,
  View,
  Button,
  Header,
  Content,
  Body,
  Left,
  Thumbnail,
  Footer,
  FooterTab,
  Icon,
  Title,
  H3,
  Form,
  Item,
  Label,
  Input
} from "native-base";
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
import { resetTopupProcessed } from "../actions/topupActions";

type Props = {};

type State = {};

class TopupSuccessScreen extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {};
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
        <Content padder>
          <View style={styles.content}>{this._renderTopupInfo()}</View>
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

  componentDidMount() {
    this.props.resetTopupProcessed();
  }

  componentDidUpdate() {
    if (this.props.message !== null) {
      showInfoToast(this.props.message);
    }
    if (this.props.error !== null) {
      showErrorToast(this.props.error);
    }
  }

  _renderTopupInfo = () => {
    return (
      <View>
        <View style={[styles.valueRow, { marginBottom: 10 }]}>
          <H3 style={styles.label}>{strings.CUSTOMER}</H3>
          <H3 style={styles.value}>{this.props.fullname}</H3>
        </View>
        <View style={[styles.valueRow, { marginBottom: 10 }]}>
          <H3 style={styles.label}>{strings.PREV_BALANCE}</H3>
          <H3 style={styles.value}>{this.props.previousBalance}</H3>
        </View>
        <View style={[styles.valueRow, { marginBottom: 10 }]}>
          <H3 style={styles.label}>{strings.AMOUNT}</H3>
          <H3 style={styles.value}>{this.props.amount}</H3>
        </View>
        <View style={[styles.valueRow, { marginBottom: 10 }]}>
          <H3 style={styles.label}>{strings.CURRENT_BALANCE}</H3>
          <H3 style={styles.value}>{this.props.currentBalance}</H3>
        </View>
      </View>
    );
  };
}

const mapStateToProps = state => {
  let topup = state.TopupReducer.lastTopup;
  let amount = topup.amount;
  let customer = state.CustomerReducer.customers.find(
    c => c._id === topup.customerId
  );
  let currentBalance = customer.creditBalance;
  let previousBalance = currentBalance - amount;

  let fullName = `${customer.firstName} ${customer.lastName}`;
  let previousBalanceString = toStringWithDecimals(previousBalance, 2) + " €";
  let amountString = toStringWithDecimals(amount, 2) + " €";
  let currentBalanceString = toStringWithDecimals(currentBalance, 2) + " €";

  return {
    fullname: state.TopupReducer.lastTopup.fullname,
    previousBalance: previousBalanceString,
    currentBalance: currentBalanceString,
    amount: amountString,
    message: state.MessageReducer.message,
    error: state.MessageReducer.error
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ resetTopupProcessed }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(TopupSuccessScreen);
