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
  Item,
  Label,
  Input,
  Card,
  CardItem
} from "native-base";
import { Col, Row, Grid } from "react-native-easy-grid";
import { TopupConfirmModal } from "../components/TopupConfirmModal";

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
import { topupBalance } from "../actions/topupActions";

type Props = {};

type State = {
  error: string
};

class TopupConfirmScreen extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      error: null
    };
    this._checkLoginState();
  }

  render() {
    let amountString = toStringWithDecimals(this.props.amount, 2) + " €";
    let fullname =
      this.props.customer.firstName + " " + this.props.customer.lastName;

    return (
      <Container>
        <Header style={styles.primaryBackground}>
          <Grid>
            <Row>
              <Button
                transparent
                onPress={() => this.props.navigation.goBack()}
              >
                <Icon name="arrow-back" style={styles.white} />
              </Button>
              <Thumbnail
                square
                source={require("../assets/images/site_dz.jpg")}
              />
            </Row>
          </Grid>
          <Body>
            <Title>{strings.TOPUP}</Title>
          </Body>
        </Header>
        <Content padder>
          {this._renderOverview()}
          <TopupConfirmModal
            ref="modal"
            onConfirmButtonPress={() => this._onModalConfirmButtonPress()}
            fullname={fullname}
            amountString={amountString}
          />
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

  componentDidUpdate() {
    if (this.props.message !== null) {
      showInfoToast(this.props.message);
    }
    if (this.props.error !== null) {
      showErrorToast(this.props.error);
    }
  }

  _renderOverview = () => {
    let amount = this.props.amount;
    let customer = this.props.customer;

    let fullName = customer.firstName + " " + customer.lastName;
    let currentBalanceString =
      toStringWithDecimals(customer.creditBalance, 2) + " €";
    let amountString = toStringWithDecimals(amount, 2) + " €";

    return (
      <Card>
        <CardItem header>
          <Text>{strings.TOPUP_CONFIRM}</Text>
        </CardItem>
        <CardItem>
          <Grid>
            <Col style={{ width: 150, marginRight: 10 }}>
              <Row>
                <Text style={styles.label}>{strings.CUSTOMER}</Text>
              </Row>
              <Row>
                <Text style={styles.label}>{strings.CURRENT_BALANCE}</Text>
              </Row>
              <Row>
                <Text style={styles.label}>{strings.TOPUP_AMOUNT}</Text>
              </Row>
            </Col>
            <Col>
              <Row>
                <Text style={styles.value}>{fullName}</Text>
              </Row>
              <Row>
                <Text style={styles.value}>{currentBalanceString}</Text>
              </Row>
              <Row>
                <Text style={styles.value}>{amountString}</Text>
              </Row>
            </Col>
          </Grid>
        </CardItem>
        <CardItem>
          <Body>
            <Button
              full
              onPress={() => this._onConfirmButtonPress()}
              style={styles.primaryActionButton}
            >
              <Text style={styles.primaryButtonText}>
                {strings.TOPUP_BALANCE}
              </Text>
            </Button>
          </Body>
        </CardItem>
        <CardItem footer>
          <Grid>
            <Col>
              <Button
                transparent
                full
                small
                onPress={() => {
                  this._onChangeAmountButtonPress();
                }}
              >
                <Text style={styles.smallButtonText}>
                  {strings.CHANGE_AMOUNT}
                </Text>
              </Button>
            </Col>
            <Col>
              <Button
                transparent
                full
                small
                onPress={() => {
                  this._onChangeCustomerButtonPress();
                }}
              >
                <Text style={styles.smallButtonText}>
                  {strings.CHANGE_CUSTOMER}
                </Text>
              </Button>
            </Col>
          </Grid>
        </CardItem>
      </Card>
    );
  };

  _checkLoginState = () => {
    if (!this.props.cashierId) this.props.navigation.navigate("AuthNavigator");
  };

  _onConfirmButtonPress = () => {
    this._toggleModalVisible();
  };

  _onModalConfirmButtonPress = () => {
    this._toggleModalVisible();
    this.props.topupBalance({});
  };

  _toggleModalVisible = () => {
    let modal = this.refs.modal;
    modal.setState({ isVisible: !modal.state.isVisible });
  };

  _onChangeAmountButtonPress = () => {
    this.props.navigation.navigate("TopupAmountScreen", {
      previousState: this.props.navigation.state
    });
  };

  _onChangeCustomerButtonPress = () => {
    this.props.navigation.navigate("TopupCustomerScreen", {
      previousState: this.props.navigation.state
    });
  };
}

const mapStateToProps = state => {
  return {
    cashierId: state.CashierReducer.cashierId,
    customer: state.TopupReducer.currentCustomer,
    amount: state.TopupReducer.currentAmount,
    message: state.MessageReducer.message,
    error: state.MessageReducer.error
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ topupBalance }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(TopupConfirmScreen);
