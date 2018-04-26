//@flow
import React, { Component } from "react";

//components
import { Keyboard, Alert } from "react-native";
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
import {
  Menu,
  MenuProvider,
  MenuOptions,
  MenuOption,
  MenuTrigger
} from "react-native-popup-menu";
import { Col, Row, Grid } from "react-native-easy-grid";

//styles
import styles from "../styles/styles";
import colors from "../styles/colors";

//resources
import * as strings from "../constants/strings";

//functions
import { validateTopupAmount, reduceDecimals } from "../functions/validation";
import { showInfoToast, showErrorToast } from "../functions/toast";

//redux
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

//actions
import { setTopupAmount } from "../actions/topupActions";
import { sendMessage } from "../actions/messageActions";
import { logout } from "../actions/cashierActions";
import { syncAll } from "../actions/syncActions";

//libs
import { NavigationActions } from "react-navigation";

type Props = {};

type State = {
  quantity: number,
  error: string
};

class TopupAmountScreen extends Component<Props, State> {
  constructor(props) {
    super(props);

    const { params } = this.props.navigation.state;
    this.previousRouteName =
      params && params.previousState ? params.previousState.routeName : null;

    this.state = {
      quantity: this.props.amount || "",
      error: null
    };

    this._checkLoginState();
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
            <Title>{strings.TOPUP}</Title>
            <Subtitle>
              {this.previousRouteName
                ? strings.CHANGE_AMOUNT
                : strings.ENTER_TOPUP_AMT}
            </Subtitle>
          </Body>
          <Right>{this._renderPopupMenu()}</Right>
        </Header>
        {/* HEADER END */}
        {/* CONTENT */}
        <Content padder contentContainerStyle={styles.scrollviewCenter}>
          {this._renderForm()}
        </Content>
        {/* CONTENT END */}
        {/* FOOTER */}
        {!this.previousRouteName && (
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
              <Button vertical style={styles.secondaryBackground}>
                <Icon name="cash" style={styles.white} />
                <Text style={[styles.tabbarText, styles.white]}>
                  {strings.TOPUP}
                </Text>
              </Button>
              <Button
                vertical
                onPress={() => {
                  this.props.navigation.navigate("HistoryNavigator");
                }}
              >
                <Icon name="clock" />
                <Text style={styles.tabbarText}>{strings.HISTORY}</Text>
              </Button>
            </FooterTab>
          </Footer>
        )}
        {/* FOOTER END */}
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
          {this.previousRouteName && (
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
          )}
        </View>
      </Card>
    );
  };

  _renderPopupMenu() {
    return (
      <Button transparent>
        <Menu>
          <MenuTrigger>
            <Icon name="menu" style={styles.popupMenuIcon} />
          </MenuTrigger>
          <MenuOptions>
            <MenuOption onSelect={() => this.props.syncAll()}>
              <Text style={styles.popupMenuText}>{strings.FORCE_SYNC}</Text>
            </MenuOption>
            <MenuOption onSelect={() => this._onCloseoutMenuOptionPress()}>
              <Text style={styles.popupMenuText}>
                {strings.CLOSEOUT_SCREEN_TITLE}
              </Text>
            </MenuOption>
            <MenuOption onSelect={() => this._onServerConfigMenuOptionPress()}>
              <Text style={styles.popupMenuText}>{strings.SERVER_CONFIG}</Text>
            </MenuOption>
            <View style={styles.divider} />
            <MenuOption onSelect={() => this._onLogoutMenuOptionPress()}>
              <Text style={styles.popupMenuText}>
                {strings.LOGOOUT_ALERT_HEADER}
              </Text>
            </MenuOption>
          </MenuOptions>
        </Menu>
      </Button>
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

  _checkLoginState = () => {
    if (!this.props.cashierId) this.props.navigation.navigate("AuthNavigator");
  };

  _onChangeText = value => {
    value = value.replace(/\s+/g, "");
    value = reduceDecimals(value, 2);
    let valid = validateTopupAmount(value);
    if (valid) {
      this.setState({ error: null, quantity: value });
    } else {
      this.setState({
        error: strings.INVALID_AMOUNT,
        quantity: value
      });
    }
  };

  _onConfirmButtonPress = () => {
    Keyboard.dismiss();
    this.props.setTopupAmount(Number(this.state.quantity));

    this.previousRouteName === null
      ? this.props.navigation.navigate("TopupCustomerScreen")
      : this.props.navigation.goBack();
  };

  _onServerConfigMenuOptionPress = () => {
    this.props.navigation.navigate("ServerConfigScreen", {
      previousState: this.props.navigation.state
    });
  };

  _onCloseoutMenuOptionPress = () => {
    this.props.navigation.navigate("CloseoutScreen", {
      previousState: this.props.navigation.state
    });
  };

  _onLogoutMenuOptionPress = () => {
    Alert.alert(
      strings.LOGOOUT_ALERT_HEADER,
      strings.LOGOOUT_ALERT_MESSAGE,
      [
        { text: strings.CANCEL, onPress: () => {}, style: "cancel" },
        {
          text: strings.LOGOOUT_ALERT_HEADER,
          onPress: () => this._onAlertConfirmation()
        }
      ],
      { cancelable: false }
    );
  };

  _onAlertConfirmation = () => {
    this.props.logout();
    this.props.sendMessage(strings.LOGGED_OUT);
    this.props.navigation.navigate("AuthNavigator");
  };
}

const mapStateToProps = state => {
  return {
    cashierId: state.CashierReducer.cashierId,
    message: state.MessageReducer.message,
    amount: state.TopupReducer.currentAmount,
    error: state.MessageReducer.error
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      setTopupAmount,
      logout,
      sendMessage,
      syncAll
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(TopupAmountScreen);
