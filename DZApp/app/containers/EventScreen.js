//@flow
import React, { Component } from "react";
import { Platform } from "react-native";

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
  Picker
} from "native-base";
const Item = Picker.Item;
import { EventCard } from "../components/EventCard";

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
    this._onEventButtonPress = this._onEventButtonPress.bind(this);
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
            <Title>{strings.PICK_EVENT}</Title>
          </Body>
        </Header>
        <Content contentContainerStyle={styles.content}>
          <H2 style={styles.centerText}>{strings.EVENT_HEADER}</H2>
          <Form style={styles.form}>
            <Picker
              iosHeader={strings.PICK_EVENT_IOS_HEADER}
              selectedValue={this.state.eventId}
              onValueChange={this._onPickerValueChange.bind(this)}
            >
              {Platform.OS === "android" ? (
                <Item label={strings.PICK_EVENT_IOS_HEADER} value="" key="" />
              ) : null}
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
          </Form>
          {this.state.eventId !== "" && (
            <EventCard
              event={this.props.events.find(e => this.state.eventId === e._id)}
            />
          )}
          <Button
            primary
            block
            onPress={() => this._onEventButtonPress()}
            disabled={this.state.eventId === ""}
            style={this.state.eventId !== "" ? styles.primaryBackground : null}
          >
            <Text>{strings.PICK_EVENT}</Text>
          </Button>
        </Content>
      </Container>
    );
  }

  componentDidMount() {
    if (!this.props.cashierId) {
      this.props.navigation.navigate("LoginScreen");
    }
  }

  _onEventButtonPress() {
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
    cashierId: state.CashierReducer.cashierId
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ setEvent }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(EventScreen);
