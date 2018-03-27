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
  H3,
  Form,
  Item,
  Label,
  Input
} from "native-base";
import Camera from "react-native-camera";
import Toast from "react-native-root-toast";

//styles
import styles from "../styles/styles";
import colors from "../styles/colors";

//resources
import * as strings from "../constants/strings";

//functions
import { toStringWithDecimals } from "../functions/number";

//redux
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { topupBalance } from "../actions/topupActions";
import {
  removeMessage,
  removeError,
  sendMessage,
  sendError
} from "../actions/messageActions";

//import Permissions from "react-native-permissions";

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
            {/* amount */}
            {this._renderAmountEntry()}
            {/* member */}
            {this.state.customer !== null
              ? this._renderCustomerInfo()
              : this._renderCam()}
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

  componentDidUpdate() {
    if (this.props.message !== null) {
      Toast.show(this.props.message, {
        duration: Toast.durations.LONG,
        position: Toast.positions.BOTTOM,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
        backGroundColor: colors.PRIMARY_COLOR,
        shadowColor: colors.SECONDARY_COLOR,
        textColor: colors.TITLE_COLOR,
        onHidden: () => {
          this.props.removeMessage();
        }
      });
    } else if (this.props.error !== null) {
      Toast.show(this.props.error, {
        duration: Toast.durations.LONG,
        position: Toast.positions.BOTTOM,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
        backgroundColor: "red",
        textColor: colors.TITLE_COLOR,
        onHidden: () => {
          this.props.removeError();
        }
      });
    }
  }
  _renderAmountEntry = () => {
    return (
      <View>
        <Text style={[styles.primary, { marginBottom: 10 }]}>
          {strings.ENTER_TOPUP_AMT}
        </Text>
        <View style={[styles.row, { marginBottom: 10 }]}>
          <H3>{strings.AMOUNT}</H3>
          <H3 style={styles.secondary}>
            {toStringWithDecimals(this.state.sliderValue, 2)} €
          </H3>
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
        <Text style={[styles.primary, { marginBottom: 10 }]}>
          {strings.SCAN_CUSTOMER_CARD}
        </Text>
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

    return (
      <View>
        <Text style={[styles.primary, { marginBottom: 10 }]}>
          {strings.TOPUP_FOR_CUSTOMER}
        </Text>
        <View style={[styles.row, { marginBottom: 20 }]}>
          <H3>{strings.CUSTOMER}</H3>
          <H3 style={styles.secondary}>{fullName}</H3>
        </View>
        <Button
          block
          bordered
          style={[{ marginBottom: 50, borderColor: colors.PRIMARY_COLOR }]}
          onPress={() => this.setState({ customer: null })}
        >
          <Text style={styles.primary}>{strings.PICK_OTHER_CUSTOMER}</Text>
        </Button>
        <Button
          block
          style={styles.primaryBackground}
          onPress={this._onTopupButtonPressed}
        >
          <Text style={styles.white}>{strings.TOPUP_BALANCE}</Text>
        </Button>
      </View>
    );
  };

  _renderMessageToast = () => {
    return (
      <Toast
        visible={this.props.message !== null}
        position={50}
        shadow={true}
        animation={true}
        hideOnPress={true}
      >
        {this.props.message}
      </Toast>
    );
  };

  _renderErrorToast = () => {
    return (
      <Toast
        visible={this.props.error !== null}
        position={50}
        shadow={true}
        animation={true}
        hideOnPress={true}
      >
        {this.props.error}
      </Toast>
    );
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

    if (this.state.sliderValue > 0) {
      Alert.alert(
        strings.TOPUP_ALERT_TITLE,
        `${customer.firstName} ${customer.lastName} - ${toStringWithDecimals(
          this.state.sliderValue
        )} €`,
        [
          { text: strings.CANCEL, onPress: () => {}, style: "cancel" },
          {
            text: strings.OK,
            onPress: () => {
              this.props.topupBalance({
                cashierId: this.props.cashierId,
                customerId: this.state.customer._id,
                timestamp: new Date().toJSON(),
                amount: this.state.sliderValue
              });
              this.setState({ customer: null, sliderValue: 0 });
            }
          }
        ]
      );
    } else this.props.sendError(strings.INVALID_AMOUNT);
  };
}

const mapStateToProps = state => {
  return {
    customers: state.CustomerReducer.customers,
    cashierId: state.CashierReducer.cashierId,
    message: state.MessageReducer.message,
    error: state.MessageReducer.error
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    { topupBalance, removeMessage, removeError, sendMessage, sendError },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(TopupScreen);
