//Template screen with basic imports and redux integration

//@flow
import React, { Component } from "react";
import { Alert, Vibration } from "react-native";

//components
import Slider from "react-native-slider";
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
  H2,
  Form,
  Item,
  Label,
  Input
} from "native-base";
import Camera from "react-native-camera";
import Toast from "react-native-root-toast";
import { Col, Row, Grid } from "react-native-easy-grid";

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
import { sendError } from "../actions/messageActions";

type Props = {};

type State = {
  sliderValue: number,
  customer: {}
};

class TopupScreen extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      sliderValue: 0.0,
      customer: null
      //cameraPermission: null
    };
    this._onBarCodeRead = this._onBarCodeRead.bind(this);
    this._onTopupButtonPressed = this._onTopupButtonPressed.bind(this);
    this._checkLoginState();
  }

  render() {
    return (
      <Container>
        <Header style={styles.primaryBackground}>
          <Left>
            <Thumbnail
              square
              source={require("../assets/images/site_dz.jpg")}
            />
          </Left>
          <Body>
            <Title>{strings.TOPUP}</Title>
          </Body>
        </Header>
        <Content padder>
          <View style={styles.content}>
            {this._renderAmountEntry()}
            {this.state.customer !== null
              ? this._renderCustomerInfo()
              : this._renderCam()}
            {this.state.sliderValue > 0 &&
              this.state.customer !== null &&
              this._renderTopupButton()}
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

  // shouldComponentUpdate() {
  //   if (this.props.isProcessed && this.props.navigation) {
  //     this.props.navigation.navigate("TopupSuccessScreen");
  //   }
  //   return true;
  // }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isProcessed && nextProps.navigation) {
      this.setState({ customer: null, sliderValue: 0 });
      nextProps.navigation.navigate("TopupSuccessScreen");
    }
  }

  componentDidUpdate() {
    if (this.props.message !== null) {
      showInfoToast(this.props.message);
    }
    if (this.props.error !== null) {
      showErrorToast(this.props.error);
    }
    // if (this.props.isProcessed && this.props.navigation) {
    //   this.props.navigation.navigate("TopupSuccessScreen");
    // }
  }
  _renderAmountEntry = () => {
    let amount = toStringWithDecimals(this.state.sliderValue, 2) + " €";

    return (
      <View>
        <H2 style={styles.title}>{strings.ENTER_TOPUP_AMT}</H2>
        <View>
          <Grid>
            <Col style={{ width: 125, marginRight: 10 }}>
              <Row>
                <Text style={styles.label}>{strings.AMOUNT}</Text>
              </Row>
            </Col>
            <Col>
              <Row>
                <Text style={styles.value}>{amount}</Text>
              </Row>
            </Col>
          </Grid>
        </View>
        <Slider
          value={this.state.sliderValue}
          onValueChange={value => this._onSliderValueChange(value)}
          minimumValue={0}
          maximumValue={100}
          step={0.5}
          style={styles.quantitySliderStyle}
          trackStyle={styles.quantitySliderTrackStyle}
          thumbStyle={styles.quantitySliderThumbStyle}
          minimumTrackTintColor={colors.SECONDARY_COLOR}
          maximumTrackTintColor={colors.PRIMARY_COLOR}
        />
      </View>
    );
  };

  _renderCam = () => {
    return (
      <View>
        <H2 style={styles.title}>{strings.SCAN_CUSTOMER_CARD}</H2>
        <View style={styles.cameraHolder}>
          <Camera
            style={styles.camera}
            aspect={Camera.constants.Aspect.fill}
            type={Camera.constants.Type.back}
            flashMode={Camera.constants.FlashMode.auto}
            defaultTouchToFocus
            // barCodeTypes={["qr"]}
            onBarCodeRead={this._onBarCodeRead}
            permissionDialogTitle={strings.CAM_PERMISSION_TITLE}
            permissionDialogMessage={strings.CAM_PERMISSION_MESSAGE}
          />
        </View>
      </View>
    );
  };

  _renderCustomerInfo = () => {
    let fullName =
      this.state.customer.firstName + " " + this.state.customer.lastName;
    let currentBalance =
      toStringWithDecimals(this.state.customer.creditBalance, 2) + " €";

    return (
      <View>
        <H2 style={styles.title}>{strings.TOPUP_FOR_CUSTOMER}</H2>
        <View>
          <Grid>
            <Col style={{ width: 125, marginRight: 10 }}>
              <Row>
                <Text style={styles.label}>{strings.CUSTOMER}</Text>
              </Row>
              <Row>
                <Text style={styles.label}>{strings.CURRENT_BALANCE}</Text>
              </Row>
            </Col>
            <Col>
              <Row>
                <Text style={styles.value}>{fullName}</Text>
              </Row>
              <Row>
                <Text style={styles.value}>{currentBalance}</Text>
              </Row>
            </Col>
          </Grid>
        </View>
        <Button
          bordered
          style={styles.borderedButton}
          onPress={() => this.setState({ customer: null })}
        >
          <Text style={styles.borderedButtonText}>
            {strings.PICK_OTHER_CUSTOMER}
          </Text>
        </Button>
      </View>
    );
  };

  _renderTopupButton = () => {
    return (
      <View>
        <Button
          style={styles.primaryActionButton}
          onPress={this._onTopupButtonPressed}
        >
          <Text style={styles.primaryButtonText}>{strings.TOPUP_BALANCE}</Text>
        </Button>
      </View>
    );
  };

  _checkLoginState = () => {
    if (!this.props.cashierId) this.props.navigation.navigate("AuthNavigator");
  };

  _onSliderValueChange = value => this.setState({ sliderValue: value });

  _onBarCodeRead = e => {
    if (e.type === "QR_CODE") {
      Vibration.vibrate(500);
      //barcode only contains customerId in plain text format
      let customer = this.props.customers.find(c => c._id === e.data);
      if (customer) {
        this.setState({
          customer: customer
        });
      } else this.props.sendError(strings.INVALID_QR);
    }
  };

  _onTopupButtonPressed = () => {
    let customer = this.state.customer;
    let fullName = customer.firstName + " " + customer.lastName;
    let amountString = toStringWithDecimals(this.state.sliderValue) + " €";

    if (this.state.sliderValue > 0) {
      Alert.alert(
        strings.TOPUP_ALERT_TITLE,
        amountString + strings.TOPUP_FOR + fullName + "?",
        [
          { text: strings.CANCEL, onPress: () => {}, style: "cancel" },
          { text: strings.OK, onPress: () => this._onAlertConfirmation() }
        ]
      );
    } else this.props.sendError(strings.INVALID_AMOUNT);
  };

  _onAlertConfirmation = () => {
    this.props.topupBalance({
      cashierId: this.props.cashierId,
      customerId: this.state.customer._id,
      timestamp: new Date().toJSON(),
      amount: this.state.sliderValue
    });
    //this.setState({ customer: null, sliderValue: 0 });
  };
}

const mapStateToProps = state => {
  return {
    customers: state.CustomerReducer.customers,
    cashierId: state.CashierReducer.cashierId,
    isProcessed: state.TopupReducer.isProcessed,
    message: state.MessageReducer.message,
    error: state.MessageReducer.error,
    cashierId: state.CashierReducer.cashierId
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ topupBalance, sendError }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(TopupScreen);
