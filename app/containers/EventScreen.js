//@ flow
//react-native
import React, { Component } from "react";
import { View, Text, Button, ActivityIndicator, Picker } from "react-native";

//redux
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { setEvent } from "../actions/eventActions";

import styles from "../styles/styles";
import colors from "../styles/colors";

type Props = {};
type State = {
  eventId: String
};

class EventScreen extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      eventId: null
    };
    this.onPress = this.onPress.bind(this);    
  }

  componentDidUpdate(){
    if(!this.props.cashierId){
      this.props.navigation.navigate("LoginScreen");
    }    
  }

  render() {
    if (this.props.isFetching) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" color={colors.SECONDARY_COLOR} />
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <Text style={styles.header1}>Kies een evenement:</Text>
          <Picker
            selectedValue={this.state.eventId}
            onValueChange={(itemValue, itemIndex) =>
              this.setState({ eventId: itemValue })
            }
          >
            <Picker.Item label="Kies evenement..." />
            {this.props.events.map((event, key) => (
              <Picker.Item label={event.name} value={event._id} key={key} />
            ))}
          </Picker>
          {this.state.eventId ? (
            <View style={styles.eventBox}>
              <View style={styles.column}>
                <Text style={styles.bold}>Van:</Text>
                <Text style={styles.bold}>Tot:</Text>
                <Text style={styles.bold}>Inschrijvingsgeld:</Text>
              </View>
              <View style={styles.column}>
                <Text style={styles.primary}>
                  {this._getEventProps(this.state.eventId).fromDate}
                </Text>
                <Text style={styles.primary}>
                  {this._getEventProps(this.state.eventId).toDate}
                </Text>
                <Text style={styles.primary}>
                  {this._getEventProps(this.state.eventId).subscriptionFee}
                </Text>
              </View>
            </View>
          ) : null}
          <Button
            onPress={this.onPress}
            title="Kies evenement"
            color={colors.PRIMARY_COLOR}
          />
        </View>
      );
    }
  }

  onPress() {
    console.log(this.state.eventId);
    this.props.setEvent(this.state.eventId);
    this.props.navigation.navigate("MainFlow");
  }

  _getEventProps(eventId: number) {
    let event = this.props.events.filter(e => e._id === eventId)[0];
    let fromDate = new Date(event.fromDate);
    let toDate = new Date(event.toDate);
    let subscriptionFee = event.subscriptionFee
      ? event.subscriptionFee + " €"
      : "geen";
    let fromDateString = `${fromDate.getDate()}/${fromDate.getMonth()}/${fromDate.getFullYear()}`;
    let toDateString = `${toDate.getDate()}/${toDate.getMonth()}/${toDate.getFullYear()}`;

    return {
      fromDate: fromDateString,
      toDate: toDateString,
      subscriptionFee: subscriptionFee
    };
  }
}

const mapStateToProps = state => {
  return {
    //sort events chronologically
    events: state.eventReducer.events.sort((a, b) => {
      return new Date(a.fromDate) - new Date(b.fromDate);
    }),
    isFetching: state.eventReducer.isFetching,
    cashierId: state.cashierReducer.cashierId
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ setEvent }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(EventScreen);
