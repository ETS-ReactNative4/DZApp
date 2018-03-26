//Template screen with basic imports and redux integration

//@flow
import React, { Component } from "react";
import { Platform, Alert } from "react-native";

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
  Input,
  Toast
} from "native-base";
import Camera from "react-native-camera";

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

import Permissions from "react-native-permissions";

type Props = {};

type State = {
  sliderValue: number,
  customer: {},
  cameraPermission: String
};

class TopupScreen extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      sliderValue: 0.0,
      customer: null,
      cameraPermission: null
    };
    this._onBarCodeRead = this._onBarCodeRead.bind(this);
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
            <Text style={[styles.primary, { marginBottom: 10 }]}>
              {strings.ENTER_TOPUP_AMT}
            </Text>
            <View style={[styles.row, { marginBottom: 10 }]}>
              <Text>{strings.AMOUNT}</Text>
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

  componentDidMount() {
    //this._resolveCameraPermissions();
  }

  _onSliderValueChange = value => this.setState({ sliderValue: value });

  _onBarCodeRead = e => {
    //barcode only contains customerId in plain text format
    let customer = this.props.customers.find(c => c._id === e.data);
    if (customer) {
      this.setState({
        customer: customer
      });
    } else {
      Toast.show({
        text: strings.INVALID_QR,
        position: "bottom",
        buttonText: strings.OK,
        type: "danger"
      });
    }
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
          {strings.SCAN_CUSTOMER_CARD}
        </Text>
        <View style={[styles.row, { marginBottom: 20 }]}>
          <Text>{strings.CUSTOMER}</Text>
          <H3 style={styles.secondary}>{fullName}</H3>
        </View>
        <Button
          block
          style={[styles.primaryBackground, { marginBottom: 20 }]}
          onPress={() => this.setState({ customer: null })}
        >
          <Text style={styles.white}>{strings.PICK_OTHER_CUSTOMER}</Text>
        </Button>
        <Button
          block
          style={styles.primaryBackground}
          onPress={() => console.log("topup!")}
        >
          <Text style={styles.white}>{strings.TOPUP_BALANCE}</Text>
        </Button>
      </View>
    );
  };

  // _resolveCameraPermissions = () => {
  //   Permissions.check("camera").then(response => {
  //     this.setState({ cameraPermission: response });
  //     switch (response) {
  //       case "authorized":
  //         break;
  //       case "denied":
  //       case "restricted":
  //       case "undetermined":
  //         Platform.select({ ios: this._alertForCameraPermission() });
  //         break;
  //       default:
  //         break;
  //     }
  //   });
  // };

  // _alertForCameraPermission = () => {
  //   Alert.alert(strings.CAM_PERMISSION_TITLE, strings.CAM_PERMISSION_MESSAGE, [
  //     {
  //       text: strings.DENY,
  //       onPress: () => {
  //         this.setState({ cameraPermission: "denied" });
  //       },
  //       style: "cancel"
  //     },
  //     this.state.cameraPermission === "undetermined"
  //       ? { text: strings.OK, onPress: this._requestCameraPermission }
  //       : Platform.select({
  //           ios: {
  //             text: strings.OPEN_SETTINGS,
  //             onPress: Permissions.openSettings
  //           },
  //           android: {
  //             text: strings.OK,
  //             onPress: this._requestCameraPermission
  //           }
  //         })
  //   ]);
  // };

  _requestCameraPermission = () => {
    Permissions.request("camera").then(response => {
      this.setState({ cameraPermission: response });
    });
  };
}

const mapStateToProps = state => {
  return {
    customers: state.CustomerReducer.customers
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({}, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(TopupScreen);
