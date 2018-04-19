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
import { validateTopupAmount, reduceDecimals } from "../functions/validation";
import { showInfoToast, showErrorToast } from "../functions/toast";

//redux
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import {
  setTopupAmount,
  setTopupCustomer,
  resetPreviousBalance,
  resetTopupProcessed
} from "../actions/topupActions";

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
    let reset = params ? params.reset : false;

    if (reset) {
      this.props.setTopupAmount(null),
        this.props.setTopupCustomer(null),
        this.props.resetPreviousBalance(null),
        this.props.resetTopupProcessed(null);
    }

    this.state = {
      quantity: reset ? "" : this.props.amount || "",
      error: null
    };

    this._checkLoginState();
  }

  render() {
    return (
      <Container>
        <Header style={styles.primaryBackground}>
          <Left>
            {this.previousRouteName === null ? (
              <Thumbnail square source={require("../assets/images/logo.gif")} />
            ) : (
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
                    source={require("../assets/images/logo.gif")}
                  />
                </Row>
              </Grid>
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
        </Header>
        <Content padder contentContainerStyle={styles.scrollviewCenter}>
          {this._renderForm()}
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

  _navigateToPreviousRoute = () => {};
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
      setTopupCustomer,
      resetPreviousBalance,
      resetTopupProcessed
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(TopupAmountScreen);
