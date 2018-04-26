//@flow
import React, { Component } from "react";
import { Keyboard, BackHandler } from "react-native";

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

//styles
import styles from "../styles/styles";
import colors from "../styles/colors";

//resources
import * as strings from "../constants/strings";

//functions
import {
  validateOrderTopupAmount,
  reduceDecimals
} from "../functions/validation";
import { showInfoToast, showErrorToast } from "../functions/toast";

//redux
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import {
  setOrderTopupAmount,
  setMinimumOrderTopupAmount,
  setOrderCustomer
} from "../actions/orderActions";

//libs
import { NavigationActions } from "react-navigation";

type Props = {};

type State = {
  quantity: number,
  error: string
};

class OrderAmountScreen extends Component<Props, State> {
  constructor(props) {
    super(props);

    const { params } = this.props.navigation.state;
    this.previousRouteName =
      params && params.previousState ? params.previousState.routeName : null;

    this.state = {
      quantity: this.props.amount || this.props.minAmount || "",
      error: null
    };

    this._checkLoginState();
    this._checkEventState();
  }

  render() {
    return (
      <Container>
        {/* HEADER */}
        <Header style={styles.primaryBackground}>
          <Left>
            {this.previousRouteName ? (
              <Button
                transparent
                onPress={() => this.props.navigation.goBack()}
              >
                <Icon name="arrow-back" style={styles.white} />
              </Button>
            ) : (
              <Thumbnail
                square
                small
                source={require("../assets/images/logo.gif")}
              />
            )}
          </Left>
          <Body>
            <Title>{strings.ORDER}</Title>
            <Subtitle>
              {this.previousRouteName
                ? strings.CHANGE_AMOUNT
                : strings.ENTER_TOPUP_AMT}
            </Subtitle>
          </Body>
          <Right>
           
          </Right>
        </Header>
        {/* HEADER END */}
        {/* CONTENT */}
        <Content padder contentContainerStyle={styles.scrollviewCenter}>
          {this._renderForm()}
        </Content>
        {/* CONTENT END */}
      </Container>
    );
  }

  _renderForm = () => {
    let quantity = this.state.quantity;
    let error = this.state.error;
    let disabled = this.state.error !== null || this.state.quantity === "";

    return (
      <Card>
        <CardItem header>
          <Text>
            {this.previousRouteName
              ? strings.CHANGE_AMOUNT
              : strings.ENTER_TOPUP_AMT}
          </Text>
        </CardItem>
        <View>
          <View style={styles.cardForm}>
            <Item floatingLabel last>
              <Label>{strings.AMOUNT}</Label>
              <Input
                keyboardType="numeric"
                onChangeText={value => this._onChangeText(value)}
                value={quantity.toString()}
              />
            </Item>
          </View>
          {error && (
            <CardItem>
              <Text style={styles.error}>{error}</Text>
            </CardItem>
          )}
          <CardItem>
            <Body>
              <Button
                full
                onPress={() => this._onConfirmButtonPress()}
                disabled={disabled}
                style={
                  !disabled
                    ? styles.primaryActionButton
                    : styles.primaryActionButtonDisabled
                }
              >
                <Text style={styles.primaryButtonText}>
                  {this.previousRouteName
                    ? strings.CHANGE_AMOUNT
                    : strings.CONFIRM_AMT}
                </Text>
              </Button>
            </Body>
          </CardItem>
          <CardItem footer>
            <Button
              transparent
              full
              small
              onPress={() => this._onCancelButtonPress()}
            >
              <Text style={styles.smallButtonText}>{strings.CANCEL}</Text>
            </Button>
          </CardItem>
        </View>
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
    this._onCancelButtonPress();
    return true;
  };

  _checkLoginState = () => {
    if (!this.props.cashierId) this.props.navigation.navigate("AuthNavigator");
  };

  _checkEventState = () => {
    if (!this.props.eventId) this.props.navigation.navigate("EventScreen");
  };

  _onChangeText = value => {
    value = reduceDecimals(value, 2);
    let valid = validateOrderTopupAmount(value, this.props.minAmount);
    if (valid) {
      this.setState({ error: null, quantity: value });
    } else {
      this.setState({
        error: strings.BIGGER_THAN_MIN_ERROR(this.props.minAmount),
        quantity: value
      });
    }
  };

  _onConfirmButtonPress = () => {
    Keyboard.dismiss();
    this.props.setOrderTopupAmount(Number(this.state.quantity));

    this.previousRouteName === null
      ? this.props.navigation.navigate("OrderTopupConfirmScreen")
      : this.props.navigation.goBack();
  };

  _onCancelButtonPress = () => {
    if (this.previousRouteName) this.props.navigation.goBack();
    else {
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
    }
  };
}

const mapStateToProps = state => {
  return {
    cashierId: state.CashierReducer.cashierId,
    eventId: state.EventReducer.eventId,
    message: state.MessageReducer.message,
    error: state.MessageReducer.error,
    minAmount: state.OrderReducer.minTopupAmount,
    amount: state.OrderReducer.topupAmount
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      setOrderTopupAmount,
      setMinimumOrderTopupAmount,
      setOrderCustomer
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderAmountScreen);
