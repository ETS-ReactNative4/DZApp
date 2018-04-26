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
  Icon,
  Right
} from "native-base";
import {
  Menu,
  MenuProvider,
  MenuOptions,
  MenuOption,
  MenuTrigger
} from "react-native-popup-menu";
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
import { showInfoToast, showErrorToast } from "../functions/toast";
import moment from "moment-timezone";

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

    this._onPickEventButtonPress = this._onPickEventButtonPress.bind(this);
    this._onPickerValueChange = this._onPickerValueChange.bind(this);
    this._checkLoginState();
  }

  render() {
    return (
      <Container>
        {/* HEADER */}
        <Header style={styles.primaryBackground}>
          <Left>
            {this.previousRouteName === null ? (
              <Thumbnail
                square
                small
                source={require("../assets/images/logo.gif")}
              />
            ) : (
              <Button
                transparent
                onPress={() =>
                  this.props.navigation.navigate(this.previousRouteName)
                }
              >
                <Icon name="arrow-back" style={styles.white} />
              </Button>
            )}
          </Left>
          <Body>
            <Title>
              {this.previousRouteName
                ? strings.CHANGE_EVENT
                : strings.PICK_EVENT}
            </Title>
          </Body>
          <Right>{this._renderPopupMenu()}</Right>
        </Header>
        {/* HEADER END */}
        {/* CONTENT */}
        <Content padder contentContainerStyle={styles.scrollviewCenter}>
          <Card>
            {this._renderInputForm()}
            {this.state.eventId !== "" && this._renderEventInfo()}
          </Card>
        </Content>
        {/* CONTENT END */}
      </Container>
    );
  }

  _renderPopupMenu() {
    return (
      <Button transparent>
        <Menu>
          <MenuTrigger>
            <Icon name="menu" style={styles.popupMenuIcon} />
          </MenuTrigger>
          <MenuOptions>
            <MenuOption onSelect={() => this._onServerConfigMenuOptionPress()}>
              <Text style={styles.popupMenuText}>{strings.SERVER_CONFIG}</Text>
            </MenuOption>
          </MenuOptions>
        </Menu>
      </Button>
    );
  }

  _renderInputForm = () => {
    return (
      <View>
        <CardItem header>
          <Text>
            {this.previousRouteName ? strings.CHANGE_EVENT : strings.PICK_EVENT}
          </Text>
        </CardItem>
        <View style={styles.cardPicker}>{this._renderPicker()}</View>
        <CardItem footer bordered>
          {this.previousRouteName && (
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
          )}
        </CardItem>
      </View>
    );
  };

  _renderPicker = Platform.select({
    android: () => {
      return (
        <Picker
          selectedValue={this.state.eventId}
          onValueChange={this._onPickerValueChange}
        >
          <Item label={strings.PICK_EVENT_IOS_HEADER} value="" key="" />
          {this.props.listEvents.map((event, key) => {
            let type =
              event.type === "production"
                ? strings.PICKER_PRODUCTION
                : strings.PICKER_EVENT;

            return (
              <Item
                label={`${event.name} (${type})`}
                value={event._id}
                key={event._id}
              />
            );
          })}
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
          {this.props.listEvents.map((event, key) => {
            let type =
              event.type === "production"
                ? strings.PICKER_PRODUCTION
                : strings.PICKER_EVENT;

            return (
              <Item
                label={`${event.name} (${type})`}
                value={event._id}
                key={event._id}
              />
            );
          })}
        </Picker>
      );
    }
  });

  _renderEventInfo = () => {
    let event = this.props.events.find(e => e._id === this.state.eventId);

    let renderFeeInfo = event.type === "event";
    let typeString =
      event.type === "production"
        ? strings.PICKER_PRODUCTION
        : strings.PICKER_EVENT;
    let fromDateString = moment
      .tz(event.fromDate, "Europe/Berlin")
      .format("DD/MM/YYYY");
    let toDateString = moment
      .tz(event.toDate, "Europe/Berlin")
      .format("DD/MM/YYYY");
    let eventType =
      event.type === "event" ? strings.PICKER_EVENT : strings.PICKER_PRODUCTION;
    let buttonText = `${strings.CONFIRM} ${eventType}`;

    return (
      <View>
        <CardItem header>
          <Text>{event.name}</Text>
        </CardItem>
        <CardItem>
          <Grid>
            <Row>
              <Text style={styles.label}>{strings.TYPE_LABEL}</Text>
            </Row>
            <Row style={styles.valueRow}>
              <Text style={styles.value}>{typeString}</Text>
            </Row>
            <Row>
              <Text style={styles.label}>{strings.FROM_LABEL}</Text>
            </Row>
            <Row style={styles.valueRow}>
              <Text style={styles.value}>{fromDateString}</Text>
            </Row>
            <Row>
              <Text style={styles.label}>{strings.TO_LABEL}</Text>
            </Row>
            <Row style={styles.valueRow}>
              <Text style={styles.value}>{toDateString}</Text>
            </Row>
            {renderFeeInfo && (
              <View>
                <Row>
                  <Text style={styles.label}>
                    {strings.SUBSCRIPTIONFEE_LABEL}
                  </Text>
                </Row>
                <Row style={styles.valueRow}>
                  <Text style={styles.value}>
                    {event.subscriptionFee.toFixed(2)} €
                  </Text>
                </Row>
              </View>
            )}
          </Grid>
        </CardItem>
        <CardItem>
          <Body>
            <Button
              full
              style={styles.primaryActionButton}
              onPress={this._onPickEventButtonPress}
            >
              <Text style={styles.primaryButtonText}>{buttonText}</Text>
            </Button>
          </Body>
        </CardItem>
      </View>
    );
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.eventId) {
      this.setState({
        eventId: nextProps.eventId
      });
    }
  }

  componentWillMount() {
    if (this.props.eventId) {
      this.setState({
        eventId: this.props.eventId
      });
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

  componentDidUpdate() {
    if (this.props.message !== null) {
      showInfoToast(this.props.message);
    }
    if (this.props.error !== null) {
      showErrorToast(this.props.error);
    }
  }

  _onBackButtonPressAndroid = () => {
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

  _onPickEventButtonPress() {
    this.props.setEvent(
      this.state.eventId,
      this.props.navigation,
      this.previousRouteName
    );
  }

  _onPickerValueChange(value: string) {
    this.setState({
      eventId: value
    });
  }

  _onServerConfigMenuOptionPress = () => {
    this.props.navigation.navigate("ServerConfigScreen", {
      previousState: this.props.navigation.state
    });
  };
}

const mapStateToProps = state => {
  // show events/productions (sorted by date)
  // that are current, i.e.:
  // today > start of fromDate
  // && today < end of toDate + 1 day => party till midnight the day after for events!
  let events = state.EventReducer.events;

  let listEvents = events
    .filter(e => {
      return (
        moment().isSameOrAfter(moment(e.fromDate)) &&
        moment().isSameOrBefore(
          moment(e.toDate)
            .add(1, "d")
            .endOf("day")
        )
      );
    })
    .sort((a, b) => {
      return new Date(a.fromDate) - new Date(b.fromDate);
    });

  return {
    events: events,
    listEvents: listEvents,
    cashierId: state.CashierReducer.cashierId,
    eventId: state.EventReducer.eventId,
    message: state.MessageReducer.message,
    error: state.MessageReducer.error
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ setEvent }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(EventScreen);
