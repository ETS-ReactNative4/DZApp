//@flow
import React, { Component } from "react";

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
  Item,
  Label,
  Input,
  Card,
  CardItem
} from "native-base";
import Camera from "react-native-camera";
import { Vibration } from "react-native";
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
import { sendError } from "../actions/messageActions";
import { setTopupCustomer } from "../actions/topupActions";

type Props = {};

type State = {
  customer: {},
  error: string
};

class TopupCustomerScreen extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      customer: null,
      error: null
    };

    const { params } = this.props.navigation.state;
    this.previousRouteName = params ? params.previousState.routeName : null;

    this._checkLoginState();
  }

  render() {
    let customer = this.state.customer;
    return (
      <Container>
        <Header style={styles.primaryBackground}>
          <Left>
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
                  source={require("../assets/images/site_dz.jpg")}
                />
              </Row>
            </Grid>
          </Left>
          <Body>
            <Title>{strings.TOPUP}</Title>
          </Body>
        </Header>
        <Content padder >
          {customer === null ? this._renderCam() : this._renderCustomerInfo()}
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

  _renderCam = () => {
    let error = this.state.error;

    return (
      <Card>
        <CardItem header>
          <Text>{strings.SCAN_CUSTOMER_CARD}</Text>
        </CardItem>
        <CardItem>
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
        </CardItem>
        {error && (
          <CardItem>
            <Text style={styles.error}>{error}</Text>
          </CardItem>
        )}
      </Card>
    );
  };

  _renderCustomerInfo = () => {
    let fullName =
      this.state.customer.firstName + " " + this.state.customer.lastName;
    let currentBalance =
      toStringWithDecimals(this.state.customer.creditBalance, 2) + " €";

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
            <Col style={{ width: 150, marginRight: 10 }}>
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
                  : strings.CHOOSE_CUSTOMER}
              </Text>
            </Button>
          </Body>
        </CardItem>
        <CardItem footer>
          <Button
            transparent
            full
            small
            onPress={() => {
              this.setState({ customer: null });
            }}
          >
            <Text style={styles.smallButtonText}>
              {strings.PICK_OTHER_CUSTOMER}
            </Text>
          </Button>
        </CardItem>
      </Card>
    );
  };

  _checkLoginState = () => {
    if (!this.props.cashierId) this.props.navigation.navigate("AuthNavigator");
  };

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

  _onConfirmButtonPress = () => {
    this.props.setTopupCustomer(this.state.customer);
    this.props.navigation.navigate("TopupConfirmScreen");
  };
}

const mapStateToProps = state => {
  return {
    cashierId: state.CashierReducer.cashierId,
    customers: state.CustomerReducer.customers,
    message: state.MessageReducer.message,
    error: state.MessageReducer.error
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ sendError, setTopupCustomer }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(
  TopupCustomerScreen
);
