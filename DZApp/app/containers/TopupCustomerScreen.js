//@flow
import React, { Component } from "react";
import { Platform } from "react-native";

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

//styles
import styles from "../styles/styles";
import colors from "../styles/colors";

//resources
import * as strings from "../constants/strings";

//functions
import { showInfoToast, showErrorToast } from "../functions/toast";

//redux
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { sendError } from "../actions/messageActions";
import { setTopupCustomer } from "../actions/topupActions";

type Props = {};

type State = {
  customerId: string,
  error: string,
  showCam: boolean,
  camActive: boolean
};

class TopupCustomerScreen extends Component<Props, State> {
  constructor(props) {
    super(props);

    let customerId = this.props.customer ? this.props.customer._id : "";

    this.state = {
      customerId: customerId,
      error: null,
      showCam: false,
      camActive: true
    };

    const { params } = this.props.navigation.state;
    this.previousRouteName = params ? params.previousState.routeName : null;

    this._checkLoginState();
  }

  render() {
    let customer = this.props.customers.find(
      c => c._id === this.state.customerId
    );
    return (
      <Container>
        {/* HEADER */}
        <Header style={styles.primaryBackground}>
          <Left>
            {/* <Grid>
              <Row> */}
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrow-back" style={styles.white} />
            </Button>
            {/* <Thumbnail
                  square
                  source={require("../assets/images/logo.gif")}
                />
              </Row>
            </Grid> */}
          </Left>
          <Body>
            <Title>{strings.TOPUP}</Title>
            <Subtitle>
              {this.previousRouteName
                ? strings.CHANGE_CUSTOMER
                : strings.CHOOSE_CUSTOMER}
            </Subtitle>
          </Body>
        </Header>
        {/* HEADER END */}
        {/* CONTENT */}
        <Content padder contentContainerStyle={styles.scrollviewCenter}>
          {this.state.customerId !== ""
            ? this._renderCustomerInfo()
            : this._renderInput()}
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

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
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
    let customer = this.props.customers.find(
      c => c._id === this.state.customerId
    );
    let fullName = `${customer.firstName} ${customer.lastName}`;
    let currentBalance = customer.creditBalance.toFixed(2) + " €";

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
              {this.previousRouteName && (
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
              )}
            </Col>
          </Grid>
        </CardItem>
      </Card>
    );
  };

  _checkLoginState = () => {
    if (!this.props.cashierId) this.props.navigation.navigate("AuthNavigator");
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
      } else this.props.sendError(strings.INVALID_QR);
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
    let customer = this.props.customers.find(
      c => c._id === this.state.customerId
    );
    this.props.setTopupCustomer(customer);
    this.props.navigation.navigate("TopupConfirmScreen");
  };

  _toggleCam = () => {
    this.setState({ showCam: !this.state.showCam });
  };
}

const mapStateToProps = state => {
  let customers = state.CustomerReducer.customers.sort((a, b) => {
    if (a.lastName > b.lastName) return 1;
    else if (a.lastName < b.lastName) return -1;
    return 0;
  });

  return {
    cashierId: state.CashierReducer.cashierId,
    customers: customers,
    message: state.MessageReducer.message,
    error: state.MessageReducer.error,
    customer: state.TopupReducer.currentCustomer
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ sendError, setTopupCustomer }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(
  TopupCustomerScreen
);
