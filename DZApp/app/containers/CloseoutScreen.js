//@flow
import React, { Component } from "react";

//components
import { Alert, BackHandler } from "react-native";
import {
  Container,
  Header,
  Left,
  Right,
  Body,
  Title,
  Content,
  Radio,
  ListItem,
  Item,
  Input,
  Label,
  Button,
  Text,
  View,
  Card,
  CardItem,
  Icon,
  Spinner
} from "native-base";
import { Grid, Col, Row } from "react-native-easy-grid";

//styles
import styles from "../styles/styles";
import colors from "../styles/colors";

//resources
import * as strings from "../constants/strings";

//redux
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

//actions
import { processCloseout } from "../actions/cashierActions";
import { sendMessage } from "../actions/messageActions";

//functions
import { showErrorToast, showInfoToast } from "../functions/toast";
import { reduceDecimals } from "../functions/validation";

//libs
import moment from "moment-timezone";

type Props = {};

type State = {
  countedAmount: String,
  error: String
};

class CloseoutScreen extends Component<Props, State> {
  constructor(props) {
    super(props);

    const { params } = this.props.navigation.state;
    this.previousRouteName = params ? params.previousState.routeName : null;

    this.state = {
      countedAmount: "",
      error: null
    };

    this._checkLoginState();
  }

  render() {
    return (
      <Container>
        <Header style={styles.primaryBackground}>
          <Left>
            <Button
              transparent
              onPress={() =>
                this.props.navigation.navigate(this.previousRouteName)
              }
            >
              <Icon name="arrow-back" style={styles.white} />
            </Button>
          </Left>
          <Body>
            <Title>{strings.CLOSEOUT_SCREEN_TITLE}</Title>
          </Body>
          <Right />
        </Header>
        <Content padder contentContainerStyle={styles.scrollViewCenter}>
          <Card>{this._renderForm()}</Card>
        </Content>
      </Container>
    );
  }

  _renderForm() {
    let error = this.state.error;
    let disabled = this.state.countedAmount === "" || this.state.error !== null;

    let expectedAmount = this.props.expectedAmount.toFixed(2) + " €";
    let countedAmount = this.state.countedAmount;

    let difference = Number(this.props.expectedAmount - countedAmount);
    let differenceString = difference.toFixed(2) + " €";

    return (
      <View>
        <CardItem header>
          <Text style={styles.header1}>{strings.CLOSEOUT_SCREEN_TITLE}</Text>
        </CardItem>
        <CardItem>
          <Body>
            <Grid>
              <Row>
                <Text style={styles.label}>
                  {strings.EXPECTED_AMOUNT_LABEL}
                </Text>
              </Row>
              <Row style={styles.valueRow}>
                <Text style={styles.value}>{expectedAmount}</Text>
              </Row>
            </Grid>
          </Body>
        </CardItem>
        <View style={styles.cardForm}>
          <Item floatingLabel last>
            <Label>{"Geteld bedrag"}</Label>
            <Input
              keyboardType="numeric"
              onChangeText={value => this._onChangeText(value)}
              value={countedAmount.toString()}
            />
          </Item>
        </View>
        {error && (
          <CardItem>
            <Text style={styles.error}>{error}</Text>
          </CardItem>
        )}
        {!disabled && (
          <CardItem>
            <Body>
              <Grid>
                <Row>
                  <Text style={styles.label}>{strings.DIFFERENCE_LABEL}</Text>
                </Row>
                <Row style={styles.valueRow}>
                  <Text style={styles.value}>{differenceString}</Text>
                </Row>
              </Grid>
            </Body>
          </CardItem>
        )}
        <CardItem>
          <Body>
            <Button
              full
              onPress={() => this._showAlert()}
              disabled={disabled}
              style={
                disabled
                  ? styles.primaryActionButtonDisabled
                  : styles.primaryActionButton
              }
            >
              <Text style={styles.primaryButtonText}>
                {strings.CONFIRM_CLOSEOUT}
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
                  this.props.navigation.navigate(this.previousRouteName);
                }}
              >
                <Text style={styles.smallButtonText}>{strings.CANCEL}</Text>
              </Button>
            </Col>
            <Col />
          </Grid>
        </CardItem>
      </View>
    );
  }

  componentDidUpdate() {
    if (this.props.error !== null) {
      showErrorToast(this.props.error);
    }
    if (this.props.message !== null) {
      showInfoToast(this.props.message);
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
    this.props.navigation.navigate(this.previousRouteName);
    return true;
  };

  _checkLoginState = () => {
    if (!this.props.cashierId) this.props.navigation.navigate("AuthNavigator");
  };

  _onChangeText = value => {
    value = value.replace(/\s+/g, "");
    value = reduceDecimals(value, 2);
    valueNumber = Number(value);
    let valid = !isNaN(valueNumber) && valueNumber >= 0; //&& isFinite(value);

    if (valid) {
      this.setState({ error: null, countedAmount: value });
    } else {
      this.setState({
        error: strings.INVALID_CLOSEOUT_COUNT,
        countedAmount: value
      });
    }
  };

  _showAlert() {
    Alert.alert(
      strings.CLOSEOUT_ALERT_HEADER,
      strings.CLOSEOUT_ALERT_MESSAGE,
      [
        { text: strings.CANCEL, onPress: () => {}, style: "cancel" },
        { text: strings.OK, onPress: () => this._onAlertConfirmation() }
      ],
      { cancelable: false }
    );
  }

  _onAlertConfirmation() {
    let closeout = {
      cashierId: this.props.cashierId,
      timestamp: new Date().toISOString(),
      expectedCash: this.props.expectedAmount,
      countedCash: Number(this.state.countedAmount)
    };
    this.props.processCloseout(closeout);
    this.props.sendMessage(strings.CLOSED_OUT);
    this.props.navigation.navigate(this.previousRouteName);
  }
}

const mapStateToProps = state => {
  return {
    error: state.MessageReducer.error,
    message: state.MessageReducer.message,
    expectedAmount: state.TopupReducer.cashInRegister,
    cashierId: state.CashierReducer.cashierId
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ processCloseout, sendMessage }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(CloseoutScreen);
