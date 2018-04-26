//@flow
import React, { Component } from "react";

//components
import { Keyboard } from "react-native";
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
  Footer,
  FooterTab,
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
  validateTopupAmount,
  reduceDecimals,
  validateIntegerBetween
} from "../functions/validation";
import { showInfoToast, showErrorToast } from "../functions/toast";

//redux
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

//actions
import { setHistoryCount } from "../actions/settingsActions";
import { sendMessage } from "../actions/messageActions";

type Props = {};

type State = {
  error: string,
  quantity: number
};

class HistorySettingsScreen extends Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      quantity: this.props.historyCount
    };

    this._checkLoginState();
  }

  render() {
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
            <Title>{strings.HISTORY}</Title>
            <Subtitle>
              {this.previousRouteName
                ? strings.CHANGE_AMOUNT
                : strings.ENTER_TOPUP_AMT}
            </Subtitle>
          </Body>
          <Right>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name="clock" />
            </Button>
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

  componentDidUpdate() {
    if (this.props.message !== null) {
      showInfoToast(this.props.message);
    }
    if (this.props.error !== null) {
      showErrorToast(this.props.error);
    }
  }

  _renderForm = () => {
    let quantity = this.state.quantity;
    let error = this.state.error;
    let disabled = this.state.error !== null || this.state.quantity === "";

    return (
      <Card>
        <CardItem header>
          <Text>{strings.HISTORY_SETTINGS_HEADER}</Text>
        </CardItem>
        <View>
          <View style={styles.cardForm}>
            <Item floatingLabel last>
              <Label>{strings.COUNT}</Label>
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
                <Text style={styles.primaryButtonText}>{strings.CONFIRM}</Text>
              </Button>
            </Body>
          </CardItem>
          <CardItem footer>
            <Button
              transparent
              full
              small
              onPress={() => {
                this.props.navigation.goBack();
              }}
            >
              <Text style={styles.smallButtonText}>{strings.CANCEL}</Text>
            </Button>
          </CardItem>
        </View>
      </Card>
    );
  };

  _checkLoginState = () => {
    if (!this.props.cashierId) this.props.navigation.navigate("AuthNavigator");
  };

  _onChangeText = value => {
    value = value.replace(/\s+/g, "");
    value = reduceDecimals(value, 0);
    let valid = validateIntegerBetween(value, 1, 10);
    if (valid) {
      this.setState({ error: null, quantity: value });
    } else {
      this.setState({
        error: strings.INVALID_HISTORYCOUNT,
        quantity: value
      });
    }
  };

  _onConfirmButtonPress = () => {
    Keyboard.dismiss();
    this.props.setHistoryCount(Number(this.state.quantity));
    this.props.sendMessage(strings.SETTINGS_CHANGED);

    this.props.navigation.goBack();
  };
}

const mapStateToProps = state => {
  return {
    cashierId: state.CashierReducer.cashierId,
    message: state.MessageReducer.message,
    historyCount: state.SettingsReducer.historyCount,
    error: state.MessageReducer.error
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      setHistoryCount,
      sendMessage
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(
  HistorySettingsScreen
);
