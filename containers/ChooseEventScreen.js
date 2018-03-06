//@ flow

import React, { Component } from "react";
import { ScrollView, Text, Picker, Button } from "react-native";

type Props = {};
type State = {
  test: string
};

export default class LoginScreen extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      event: ""
    };
    this.onPress = this.onPress.bind(this);
  }

  render() {
    return (
      <ScrollView style={{ padding: 20 }}>
        <Text style={{ fontSize: 27 }}>Choose Event</Text>
        <Picker
          selectedValue={this.state.test}
          onValueChange={(itemValue, itemIndex) =>
            this.setState({ event: itemValue })
          }
        >
          <Picker.Item label="Event1" value="event1" />
          <Picker.Item label="Event2" value="event2" />
        </Picker>
        <Button onPress={this.onPress} title="Submit" />
      </ScrollView>
    );
  }

  onPress() {
    this.props.navigation.navigate("OrderScreen");
  }
}
