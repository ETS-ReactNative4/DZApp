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
import { setServerConfig } from "../actions/settingsActions";
import { sendMessage } from "../actions/messageActions";

//functions
import { showErrorToast, showInfoToast } from "../functions/toast";

type Props = {};

type State = {
  address: String,
  port: String,
  isTesting: boolean
};

class ServerConfigScreen extends Component<Props, State> {
  constructor(props) {
    super(props);

    const { params } = this.props.navigation.state;
    this.previousRouteName = params ? params.previousState.routeName : null;

    this.state = {
      address: this.props.address,
      port: this.props.port,
      scheme: this.props.scheme,
      isTesting: false
    };
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
            <Title>{strings.SERVER_CONFIG}</Title>
          </Body>
          <Right />
        </Header>
        <Content padder contentContainerStyle={styles.scrollViewCenter}>
          <Card>{this._renderForm()}</Card>
        </Content>
      </Container>
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

  _renderForm() {
    let disabled =
      this.state.address === "" ||
      this.state.port === "" ||
      this.state.scheme === "";
    let isTesting = this.state.isTesting;
    let scheme = this.state.scheme;

    return (
      <View>
        <CardItem header>
          <Text style={styles.header1}>{strings.SERVER_CONFIG}</Text>
        </CardItem>
        <View>
          <View style={styles.cardForm}>
            <Item floatingLabel last>
              <Label>{strings.SCHEME}</Label>
              <Input
                onChangeText={value => this.setState({ scheme: value })}
                value={this.state.scheme}
              />
            </Item>
            <Item floatingLabel last>
              <Label>{strings.ADDRESS}</Label>
              <Input
                onChangeText={value => this.setState({ address: value })}
                value={this.state.address}
              />
            </Item>
            <Item floatingLabel last>
              <Label>{strings.PORT}</Label>
              <Input
                onChangeText={value => this.setState({ port: value })}
                value={this.state.port}
              />
            </Item>
          </View>
          <CardItem>
            <Body>
              <Button
                full
                onPress={() => this._showConfigAlert()}
                disabled={disabled}
                style={
                  disabled
                    ? styles.primaryActionButtonDisabled
                    : styles.primaryActionButton
                }
              >
                <Text style={styles.primaryButtonText}>{strings.CONFIRM}</Text>
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
      </View>
    );
  }

  _renderSpinner() {
    return <Spinner color={colors.PRIMARY_COLOR} />;
  }

  _showConfigAlert() {
    let message = `${this.state.scheme}://${this.state.address}:${
      this.state.port
    }`;

    Alert.alert(
      strings.SERVER_CONFIG_ALERT_TITLE,
      message,
      [
        { text: strings.CANCEL, onPress: () => {}, style: "cancel" },
        { text: strings.OK, onPress: () => this._onAlertConfirmation() }
      ],
      { cancelable: false }
    );
  }

  _onAlertConfirmation() {
    this.props.setServerConfig(
      this.state.port,
      this.state.address,
      this.state.scheme
    );

    //this.setState({ address: "", port: "" });
    this.props.navigation.navigate(this.previousRouteName);
  }
}

const mapStateToProps = state => {
  return {
    error: state.MessageReducer.error,
    message: state.MessageReducer.message,
    address: state.SettingsReducer.serverConfig.address,
    port: state.SettingsReducer.serverConfig.port.toString(),
    scheme: state.SettingsReducer.serverConfig.scheme
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ setServerConfig, sendMessage }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(ServerConfigScreen);
