//Template screen with basic imports and redux integration

//@flow
import React, { Component } from "react";

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
  H2
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
import { resetTopupProcessed } from "../actions/topupActions";

type Props = {};

type State = {};

class TopupSuccessScreen extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {};
    this._onPress = this._onPress.bind(this);
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
            <Grid>
              <Row>
                <Button
                  transparent
                  onPress={() => this.props.navigation.goBack()}
                >
                  <Icon name="arrow-back" />
                </Button>
                <Thumbnail
                  square
                  source={require("../assets/images/site_dz.jpg")}
                />
              </Row>
            </Grid>
          </Left>
          <Body>
            <Title>{strings.TOPUP}</Title>
          </Body>
        </Header>
        <Content padder>
          <View style={styles.content}>
            {this._renderTopupInfo()}
            {this._renderButton()}
          </View>
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

  _renderTopupInfo = () => {
    return (
      <View>
        <H2 style={styles.title}>{strings.TOPUP_COMPLETE}</H2>
        <Grid>
          <Col style={{ width: 125, marginRight: 10 }}>
            <Row>
              <Text style={styles.label}>{strings.CUSTOMER}</Text>
            </Row>
            <Row>
              <Text style={styles.label}>{strings.PREV_BALANCE}</Text>
            </Row>
            <Row>
              <Text style={styles.label}>{strings.AMOUNT}</Text>
            </Row>
            <Row>
              <Text style={styles.label}>{strings.CURRENT_BALANCE}</Text>
            </Row>
          </Col>
          <Col>
            <Row>
              <Text style={styles.value}>{this.props.fullname}</Text>
            </Row>
            <Row>
              <Text style={styles.value}>{this.props.previousBalance}</Text>
            </Row>
            <Row>
              <Text style={styles.value}>{this.props.amount}</Text>
            </Row>
            <Row>
              <Text style={styles.value}>{this.props.currentBalance}</Text>
            </Row>
          </Col>
        </Grid>
      </View>
    );
  };

  _renderButton = () => {
    return (
      <View>
        <Button
          block
          style={styles.primaryActionButton}
          onPress={this._onPress}
        >
          <Text style={styles.white}>{strings.BACK}</Text>
        </Button>
      </View>
    );
  };

  _onPress = () => {
    this.props.navigation.goBack();
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
  return bindActionCreators({ resetTopupProcessed }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(TopupSuccessScreen);
