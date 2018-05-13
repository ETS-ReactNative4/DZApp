//@flow
import React, { Component } from "react";
import { BackHandler } from "react-native";

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
  Right,
  Thumbnail,
  Icon,
  Title,
  Item,
  Label,
  Input,
  Card,
  CardItem,
  Subtitle
} from "native-base";
import { Col, Row, Grid } from "react-native-easy-grid";
import { TopupConfirmModal } from "../components/TopupConfirmModal";

//styles
import styles from "../styles/styles";
import colors from "../styles/colors";

//resources
import * as strings from "../constants/strings";

//functions
import { showInfoToast, showErrorToast } from "../functions/toast";
import { getFullName } from "../functions/customer";

//libs
import moment from "moment-timezone";
import { v4 as uuidv4 } from "uuid";

//redux
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

//actions
import { topupBalance } from "../actions/topupActions";
import {
  setOrderCustomer,
  setMinimumOrderTopupAmount,
  setOrderTopupAmount
} from "../actions/orderActions";

//navigation
import { NavigationActions } from "react-navigation";

type Props = {};

type State = {
  error: string
};

class OrderTopupConfirmScreen extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      error: null
    };
    this._checkLoginState();
    this._checkEventState();
  }

  render() {
    let fullNameString = this.props.fullNameString;
    let amountString = this.props.amountString;

    return (
      <Container>
        {/* HEADER */}
        <Header style={styles.primaryBackground}>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrow-back" style={styles.white} />
            </Button>
          </Left>
          <Body>
            <Title>{strings.ORDER}</Title>
            <Subtitle>{strings.CONFIRM}</Subtitle>
          </Body>
          <Right />
        </Header>
        {/* HEADER END */}
        {/* CONTENT */}
        <Content padder contentContainerStyle={styles.scrollviewCenter}>
          {this._renderOverview()}
          <TopupConfirmModal
            ref="modal"
            onConfirmButtonPress={() => this._onModalConfirmButtonPress()}
            fullname={fullNameString}
            amountString={amountString}
          />
        </Content>
        {/* CONTENT END */}
      </Container>
    );
  }

  _renderOverview = () => {
    let fullNameString = this.props.fullNameString;
    let currentBalanceString = this.props.currentBalanceString;
    let amountString = this.props.amountString;

    return (
      <Card>
        <CardItem header>
          <Text>{strings.TOPUP_CONFIRM}</Text>
        </CardItem>
        <CardItem>
          <Grid>
            <Row>
              <Text style={styles.label}>{strings.CUSTOMER}</Text>
            </Row>
            <Row style={styles.valueRow}>
              <Text style={styles.value}>{fullNameString}</Text>
            </Row>
            <Row>
              <Text style={styles.label}>{strings.CURRENT_BALANCE}</Text>
            </Row>
            <Row style={styles.valueRow}>
              <Text style={styles.value}>{currentBalanceString}</Text>
            </Row>
            <Row>
              <Text style={styles.label}>{strings.TOPUP_AMOUNT}</Text>
            </Row>
            <Row style={styles.valueRow}>
              <Text style={styles.value}>{amountString}</Text>
            </Row>
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
                  this._onCancelButtonPress();
                }}
              >
                <Text style={styles.smallButtonText}>{strings.CANCEL}</Text>
              </Button>
            </Col>
            <Col>
              <Button
                transparent
                full
                small
                onPress={() => this.props.navigation.goBack()}
              >
                <Text style={styles.smallButtonText}>
                  {strings.CHANGE_AMOUNT}
                </Text>
              </Button>
            </Col>
          </Grid>
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
    this.props.navigation.goBack();
    return true;
  };

  _checkLoginState = () => {
    if (!this.props.cashierId) this.props.navigation.navigate("AuthNavigator");
  };
  _checkEventState = () => {
    if (!this.props.eventId) this.props.navigation.navigate("EventScreen");
  };

  _onConfirmButtonPress = () => {
    this._toggleModalVisible();
  };

  _onModalConfirmButtonPress = () => {
    this._toggleModalVisible();
    this.props.topupBalance({
      localId: uuidv4(),
      cashierId: this.props.cashierId,
      customerId: this.props.customer._id,
      timestamp: new Date().toISOString(),
      amount: this.props.amount
    });
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: "OrderTopupSuccessScreen" })
      ]
    });
    this.props.navigation.dispatch(resetAction);
  };

  _toggleModalVisible = () => {
    let modal = this.refs.modal;
    modal.setState({ isVisible: !modal.state.isVisible });
  };

  _onChangeAmountButtonPress = () => {
    this.props.navigation.navigate("OrderAmountScreen", {
      previousState: this.props.navigation.state
    });
  };

  _onCancelButtonPress = () => {
    this.props.setOrderCustomer(null);
    this.props.setMinimumOrderTopupAmount(null);
    this.props.setOrderTopupAmount(null);

    const returnAction = NavigationActions.reset({
      index: 2,
      actions: [
        NavigationActions.navigate({ routeName: "ProductScreen" }),
        NavigationActions.navigate({ routeName: "OverviewScreen" }),
        NavigationActions.navigate({ routeName: "OrderCustomerScreen" })
      ]
    });
    this.props.navigation.dispatch(returnAction);
  };
}

const mapStateToProps = state => {
  let customer = state.OrderReducer.currentCustomer;
  let amount = state.OrderReducer.topupAmount;

  let fullNameString = customer ? getFullName(customer) : "";
  let amountString = amount ? `${amount.toFixed(2)} €` : "0.00 €";
  let currentBalanceString = customer
    ? `${customer.creditBalance.toFixed(2)} €`
    : "0.00 €";

  return {
    cashierId: state.CashierReducer.cashierId,
    customer: customer,
    amount: amount,
    fullNameString: fullNameString,
    amountString: amountString,
    currentBalanceString: currentBalanceString,
    eventId: state.EventReducer.eventId,
    message: state.MessageReducer.message,
    error: state.MessageReducer.error
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      topupBalance,
      setOrderCustomer,
      setOrderTopupAmount,
      setMinimumOrderTopupAmount
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(
  OrderTopupConfirmScreen
);
