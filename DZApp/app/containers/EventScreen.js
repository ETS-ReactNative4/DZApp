//@flow
import React, { Component } from "react";
import { Platform, BackHandler } from "react-native";

//components
import {
  Container,
  Header,
  Left,
  Body,
  Title,
  Content,
  H2,
  Button,
  Text,
  Form,
  Thumbnail,
  Picker,
  Card,
  CardItem,
  View,
  Icon
} from "native-base";
import { Col, Row, Grid } from "react-native-easy-grid";
const Item = Picker.Item;

//styles
import styles from "../styles/styles";

//resources
import * as strings from "../constants/strings";

//redux
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { setEvent } from "../actions/eventActions";

//functions
import { to_NL_be_DateString } from "../functions/date";
import { toStringWithDecimals } from "../functions/number";
import { showInfoToast, showErrorToast } from "../functions/toast";

type Props = {};

type State = {
  eventId: String
};

class EventScreen extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      eventId: ""
    };

    const { params } = this.props.navigation.state;
    this.previousRouteName = params ? params.previousState.routeName : null;

    this._onPress = this._onPress.bind(this);
    this._onPickerValueChange = this._onPickerValueChange.bind(this);
    this._checkLoginState();
  }

  render() {
    return (
      <Container>
        <Header style={styles.primaryBackground}>
          <Left>
            {this.previousRouteName === null ? (
              <Thumbnail
                square
                source={require("../assets/images/site_dz.jpg")}
              />
            ) : (
              <Grid>
                <Row>
                  <Button
                    transparent
                    onPress={() =>
                      this.props.navigation.navigate(this.previousRouteName)
                    }
                  >
                    <Icon name="arrow-back" style={styles.white} />
                  </Button>
                  <Thumbnail
                    square
                    source={require("../assets/images/site_dz.jpg")}
                  />
                </Row>
              </Grid>
            )}
          </Left>
          <Body>
            <Title>{strings.PICK_EVENT}</Title>
          </Body>
        </Header>
        <Content padder>
          <H2 style={styles.title}>{strings.EVENT_HEADER}</H2>
          <Form style={styles.form}>{this._renderPicker()}</Form>
          {this.state.eventId !== "" && this._renderEventInfo()}
          {this._renderPickEventButton()}
        </Content>
      </Container>
    );
  }

  componentDidMount() {
    BackHandler.addEventListener(
      "hardwareBackPress",
      this.onBackButtonPressAndroid
    );
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      "hardwareBackPress",
      this.onBackButtonPressAndroid
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

  onBackButtonPressAndroid = () => {
    if (this.previousRouteName) {
      this.props.navigation.navigate(this.previousRouteName);
      return true;
    } else {
      return false;
    }
  };

  _checkLoginState = () => {
    if (!this.props.cashierId) this.props.navigation.navigate("AuthNavigator");
  };

  _renderPicker = Platform.select({
    android: () => {
      return (
        <Picker
          selectedValue={this.state.eventId}
          onValueChange={this._onPickerValueChange}
        >
          <Item label={strings.PICK_EVENT_IOS_HEADER} value="" key="" />
          {this.props.events.map((event, key) => (
            <Item
              label={`${event.name} (${to_NL_be_DateString(
                new Date(event.fromDate)
              )})`}
              value={event._id}
              key={event._id}
            />
          ))}
        </Picker>
      );
    },
    ios: () => {
      return (
        <Picker
          placeholder={strings.PICK_EVENT_IOS_HEADER}
          selectedValue={this.state.eventId}
          onValueChange={this._onPickerValueChange}
        >
          {this.props.events.map((event, key) => (
            <Item
              label={`${event.name} (${to_NL_be_DateString(
                new Date(event.fromDate)
              )})`}
              value={event._id}
              key={event._id}
            />
          ))}
        </Picker>
      );
    }
  });

  _renderEventInfo = () => {
    let event = this.props.events.find(e => e._id === this.state.eventId);

    return (
      <Grid>
        <Col style={{ width: 150, marginRight: 10 }}>
          <Row>
            <Text style={styles.label}>{strings.FROM}</Text>
          </Row>
          <Row>
            <Text style={styles.label}>{strings.TO}</Text>
          </Row>
          <Row>
            <Text style={styles.label}>{strings.SUBSCRIPTIONFEE}</Text>
          </Row>
        </Col>
        <Col>
          <Row>
            <Text style={styles.value}>
              {to_NL_be_DateString(new Date(event.fromDate))}
            </Text>
          </Row>
          <Row>
            <Text style={styles.value}>
              {to_NL_be_DateString(new Date(event.toDate))}
            </Text>
          </Row>
          <Row>
            <Text style={styles.value}>
              {event.subscriptionFee
                ? toStringWithDecimals(event.subscriptionFee, 2) + " €"
                : "0.00 €"}
            </Text>
          </Row>
        </Col>
      </Grid>
    );
  };

  _renderPickEventButton = () => {
    return (
      <View>
        <Button
          style={
            this.state.eventId !== ""
              ? styles.primaryActionButton
              : styles.primaryActionButtonDisabled
          }
          onPress={this._onPress}
          disabled={this.state.eventId === ""}
        >
          <Text style={styles.primaryButtonText}>{strings.PICK_EVENT}</Text>
        </Button>
      </View>
    );
  };

  _onPress() {
    this.props.setEvent(this.state.eventId, this.props.navigation);
  }

  _onPickerValueChange(value: string) {
    this.setState({
      eventId: value
    });
  }
}

const mapStateToProps = state => {
  return {
    //events sorted chronologically
    events: state.EventReducer.events.sort((a, b) => {
      return new Date(a.fromDate) - new Date(b.fromDate);
    }),
    cashierId: state.CashierReducer.cashierId,
    message: state.MessageReducer.message,
    error: state.MessageReducer.error
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ setEvent }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(EventScreen);
