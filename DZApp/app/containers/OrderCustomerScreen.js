//@flow
import React, { Component } from "react";
import { Platform, BackHandler } from "react-native";

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
  Footer,
  FooterTab,
  Icon,
  Title,
  Label,
  Input,
  Card,
  CardItem,
  Subtitle,
  Picker
} from "native-base";
const Item = Picker.Item;
import Camera from "react-native-camera";
import { Vibration } from "react-native";
import { Col, Row, Grid } from "react-native-easy-grid";
import { OrderTopupModal } from "../components/OrderTopupModal";

//styles
import styles from "../styles/styles";
import colors from "../styles/colors";

//resources
import * as strings from "../constants/strings";

//functions
import { showInfoToast, showErrorToast } from "../functions/toast";
import { calculateTotal } from "../functions/order";
import { getCustomerById, getFullName } from "../functions/customer";

//redux
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

//actions
import { sendError } from "../actions/messageActions";
import {
  setOrderCustomer,
  setMinimumOrderTopupAmount,
  setOrderTopupAmount
} from "../actions/orderActions";

//libs
import { NavigationActions } from "react-navigation";

type Props = {};

type State = {
  customerId: string,
  error: string,
  showCam: boolean,
  camActive: boolean
};

class OrderCustomerScreen extends Component<Props, State> {
  constructor(props) {
    super(props);

    let customerId = this.props.customer ? this.props.customer._id : "";

    this.state = {
      customerId: customerId,
      error: null,
      showCam: false,
      camActive: true
    };

    this._checkLoginState();
    this._checkEventState();
  }

  render() {
    let customer = getCustomerById(this.state.customerId, this.props.customers);
    return (
      <Container>
        {/* HEADER */}
        <Header style={styles.primaryBackground}>
          <Left>
            <Button transparent onPress={() => this._onBackButtonPress()}>
              <Icon name="arrow-back" style={styles.white} />
            </Button>
          </Left>
          <Body>
            <Title>{strings.ORDER}</Title>
            <Subtitle>{strings.CHOOSE_CUSTOMER}</Subtitle>
          </Body>
          <Right>
            <Button transparent onPress={() => this._onBackToTopButtonPress()}>
              <Icon name="grid" />
            </Button>
          </Right>
        </Header>
        {/* HEADER END */}
        {/* CONTENT */}
        <Content padder contentContainerStyle={styles.scrollviewCenter}>
          {this.state.customerId !== ""
            ? this._renderCustomerInfo()
            : this._renderInput()}
          <OrderTopupModal
            ref="modal"
            onConfirmButtonPress={() => this._onModalConfirmButtonPress()}
            onCancelButtonPress={() => this._onModalCancelButtonPress()}
            fullName={customer ? getFullName(customer) : ""}
          />
        </Content>
        {/* CONTENT END */}
      </Container>
    );
  }

  _renderInput = () => {
    let error = this.state.error;

    return (
      <Card>
        <CardItem header>
          <Text>
            {this.state.showCam
              ? strings.SCAN_CUSTOMER_CARD
              : strings.CHOOSE_CUSTOMER_FROM_LIST}
          </Text>
        </CardItem>

        {this.state.showCam ? this._renderCam() : this._renderPicker()}

        {error && (
          <CardItem>
            <Text style={styles.error}>{error}</Text>
          </CardItem>
        )}
        <CardItem footer>
          <Button transparent full small onPress={() => this._toggleCam()}>
            <Text style={styles.smallButtonText}>
              {this.state.showCam ? strings.COMBO_OPTION : strings.CAM_OPTION}
            </Text>
          </Button>
        </CardItem>
      </Card>
    );
  };

  _renderCam = () => {
    return (
      <CardItem>
        <View style={styles.cameraHolder}>
          <Camera
            style={styles.camera}
            aspect={Camera.constants.Aspect.fill}
            type={Camera.constants.Type.back}
            flashMode={Camera.constants.FlashMode.auto}
            defaultTouchToFocus
            // barCodeTypes={["qr"]}
            onBarCodeRead={this.state.camActive ? this._onBarCodeRead : null}
            permissionDialogTitle={strings.CAM_PERMISSION_TITLE}
            permissionDialogMessage={strings.CAM_PERMISSION_MESSAGE}
          />
        </View>
      </CardItem>
    );
  };

  _renderPicker = Platform.select({
    android: () => {
      return (
        <View style={styles.cardPicker}>
          <Picker
            selectedValue={this.state.customerId}
            onValueChange={value => this._onPickerValueChange(value)}
          >
            <Item label={strings.PICK_CUSTOMER_IOS_HEADER} value="" key="" />
            {this.props.customers.map((customer, key) => {
              let role =
                customer.role === "cashier"
                  ? strings.PICKER_CASHIER
                  : customer.role === "external"
                    ? strings.PICKER_EXTERNAL
                    : strings.PICKER_MEMBER;

              return (
                <Item
                  label={`${customer.lastName} ${customer.firstName} (${role})`}
                  value={customer._id}
                  key={customer._id}
                />
              );
            })}
          </Picker>
        </View>
      );
    },
    ios: () => {
      return (
        <View style={styles.cardPicker}>
          <Picker
            placeholder={strings.PICK_CUSTOMER_IOS_HEADER}
            selectedValue={this.state.customerId}
            onValueChange={value => this._onPickerValueChange(value)}
          >
            {this.props.customers.map((customer, key) => {
              let role =
                customer.role === "cashier"
                  ? strings.PICKER_CASHIER
                  : customer.role === "external"
                    ? strings.PICKER_EXTERNAL
                    : strings.PICKER_MEMBER;

              return (
                <Item
                  label={`${customer.lastName} ${customer.firstname} (${role})`}
                  value={customer._id}
                  key={customer._id}
                />
              );
            })}
          </Picker>
        </View>
      );
    }
  });

  _renderCustomerInfo = () => {
    //customer info displayed for all types of events
    let customer = getCustomerById(this.state.customerId, this.props.customers);
    let fullName = getFullName(customer);
    let currentBalance = customer.creditBalance.toFixed(2) + " €";
    //balance for 'event'
    let eventBalance;
    if (this.props.event.type === "event") {
      eventBalance =
        this.props.subscriptions
          .find(s => s.customerId === customer._id)
          .remainingCredit.toFixed(2) + " €";
    }
    let total =
      calculateTotal(this.props.orderlines, this.props.products).toFixed(2) +
      " €";
    let red = this._getBalanceTotalDifference(customer) < 0;

    return (
      <Card>
        <CardItem header>
          <Text>
            {this.previousRouteName
              ? strings.CHANGE_CUSTOMER
              : strings.CHOOSE_CUSTOMER}
          </Text>
        </CardItem>
        <CardItem>
          <Grid>
            <Row>
              <Text style={styles.label}>{strings.CUSTOMER}</Text>
            </Row>
            <Row style={styles.valueRow}>
              <Text style={styles.value}>{fullName}</Text>
            </Row>
            <Row>
              <Text style={styles.label}>{strings.CURRENT_BALANCE}</Text>
            </Row>
            <Row style={styles.valueRow}>
              <Text style={styles.value}>{currentBalance}</Text>
            </Row>
            {this.props.event.type === "event" && (
              <View>
                <Row>
                  <Text style={styles.label}>{strings.EVENT_BALANCE}</Text>
                </Row>
                <Row style={styles.valueRow}>
                  <Text style={styles.value}>{eventBalance}</Text>
                </Row>
              </View>
            )}
            <Row>
              <Text style={styles.label}>{strings.TO_PAY}</Text>
            </Row>
            <Row style={styles.valueRow}>
              <Text style={[styles.value, red && { color: "red" }]}>
                {total}
              </Text>
            </Row>
          </Grid>
        </CardItem>
        <CardItem>
          <Body>
            <Button
              full
              style={styles.primaryActionButton}
              onPress={this._onConfirmButtonPress}
            >
              <Text style={styles.primaryButtonText}>
                {this.previousRouteName
                  ? strings.CHANGE_CUSTOMER
                  : strings.CONFIRM_CUSTOMER}
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
                  this.setState({ customerId: "" });
                }}
              >
                <Text style={styles.smallButtonText}>
                  {strings.PICK_OTHER_CUSTOMER}
                </Text>
              </Button>
            </Col>
            <Col>
              <Button
                transparent
                full
                small
                onPress={() => this._onBackToTopButtonPress()}
              >
                <Text style={styles.smallButtonText}>{strings.CANCEL}</Text>
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
    this.mounted = true;
    BackHandler.addEventListener(
      "hardwareBackPress",
      this._onBackButtonPressAndroid
    );
  }

  componentWillUnmount() {
    this.mounted = false;
    BackHandler.removeEventListener(
      "hardwareBackPress",
      this._onBackButtonPressAndroid
    );
  }

  _onBackButtonPressAndroid = () => {
    this._onBackButtonPress();
    return true;
  };

  _checkLoginState = () => {
    if (!this.props.cashierId) this.props.navigation.navigate("AuthNavigator");
  };

  _checkEventState = () => {
    if (!this.props.event._id) this.props.navigation.navigate("EventScreen");
  };

  _toggleCam = () => {
    this.setState({ showCam: !this.state.showCam });
  };

  _onBarCodeRead = e => {
    if (this.state.camActive && e.type === "QR_CODE") {
      Vibration.vibrate(500);
      //barcode only contains customerId in plain text format
      let customer = this.props.customers.find(c => c._id === e.data);
      if (customer) {
        this.setState({
          customerId: customer._id
        });
      } else
        this.props.sendError(
          strings.INVALID_QR + " " + strings.IS_CUSTOMER_SUBSCRIBED
        );
    }

    //disable camera for 5 seconds
    this.setState({ camActive: false });
    setTimeout(() => {
      if (this && this.mounted) this.setState({ camActive: true });
    }, 5000);
  };

  _onPickerValueChange(value: string) {
    this.setState({
      customerId: value
    });
  }

  _onConfirmButtonPress = () => {
    let customer = getCustomerById(this.state.customerId, this.props.customers);
    this.props.setOrderCustomer(customer);
    //show an alert with option to topup customer's balance when insufficient
    if (this._getBalanceTotalDifference(customer) < 0) {
      this._toggleModalVisible();
    } else {
      this.props.navigation.navigate("OrderConfirmScreen");
    }
  };

  _getBalanceTotalDifference = (customer: {}): number => {
    let total = calculateTotal(this.props.orderlines, this.props.products);

    let balance;
    if (this.props.event.type !== "event") {
      balance = customer.creditBalance;
    } else {
      let subscription = this.props.subscriptions.find(
        s => s.customerId === customer._id
      );
      balance = customer.creditBalance + subscription.remainingCredit;
    }
    return balance - total;
  };

  _onBackButtonPress = () => {
    this.props.setOrderCustomer(null);
    this.props.setMinimumOrderTopupAmount(null);
    this.props.setOrderTopupAmount(null);

    this.props.navigation.goBack();
  };

  _onBackToTopButtonPress = () => {
    this.props.setOrderCustomer(null);
    this.props.setMinimumOrderTopupAmount(null);
    this.props.setOrderTopupAmount(null);

    const backToTopAction = NavigationActions.popToTop();
    this.props.navigation.dispatch(backToTopAction);
  };

  //MODAL
  _toggleModalVisible = () => {
    let modal = this.refs.modal;
    modal.setState({ isVisible: !modal.state.isVisible });
  };

  _onModalConfirmButtonPress = () => {
    this._toggleModalVisible();
    let customer = getCustomerById(this.state.customerId, this.props.customers);
    this.props.setMinimumOrderTopupAmount(
      -this._getBalanceTotalDifference(customer)
    );

    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: "OrderAmountScreen" })]
    });
    this.props.navigation.dispatch(resetAction);
  };

  _onModalCancelButtonPress = () => {
    this._toggleModalVisible();
    this.props.setOrderCustomer(null);
    this.setState({ customerId: "" });
  };
}

const mapStateToProps = state => {
  let eventId = state.EventReducer.eventId;
  let event = state.EventReducer.events.find(e => e._id === eventId);
  //the subscriptions for the chosen event
  let subscriptions = null;

  //only show members and cashiers when the chosen event is a 'production'
  //only show subscribed customers when the chosen event is an 'event'
  let customers;
  if (event.type === "production") {
    customers = state.CustomerReducer.customers.filter(
      c => c.role !== "external"
    );
  } else {
    subscriptions = state.SubscriptionReducer.subscriptions.filter(
      s => s.eventId === eventId
    );
    customers = state.CustomerReducer.customers.filter(c => {
      let subscribed = false;
      subscriptions.forEach(s => {
        if (s.customerId == c._id) subscribed = true;
      });
      return subscribed;
    });
  }
  //sort customers by last name
  customers.sort((a, b) => {
    if (a.lastName > b.lastName) return 1;
    else if (a.lastName < b.lastName) return -1;
    return 0;
  });

  //map orderlines to an array of objects
  let orderlines = Object.keys(state.OrderReducer.orderlines)
    .map(key => {
      return {
        productId: key,
        quantity: state.OrderReducer.orderlines[key]
      };
    })
    .filter(o => o.quantity !== 0);

  return {
    cashierId: state.CashierReducer.cashierId,
    event: event,
    customers: customers,
    message: state.MessageReducer.message,
    error: state.MessageReducer.error,
    customer: state.OrderReducer.currentCustomer,
    subscriptions: subscriptions,
    orderlines: orderlines,
    products: state.ProductReducer.products
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      sendError,
      setOrderCustomer,
      setMinimumOrderTopupAmount,
      setOrderTopupAmount
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(
  OrderCustomerScreen
);
