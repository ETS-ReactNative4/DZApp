//@flow

import React, { Component } from "react";
import { ScrollView, Text, TextInput, View, Button } from "react-native";
import { Authenticate } from "../authentication/authentication";

type Props = {};

type State = {
  username: string,
  password: string
};

export default class LoginScreen extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      errormessage: ""
    };
    this.login = this.login.bind(this);
  }

  render() {
    return (
      <ScrollView style={{ padding: 20 }}>
        <Text style={{ fontSize: 27 }}>Login</Text>
        <TextInput
          placeholder="Username"
          onChangeText={value => this.setState({ username: value })}
          value={this.state.username}
        />
        <TextInput
          placeholder="Password"
          onChangeText={value => this.setState({ password: value })}
          value={this.state.password}
        />
        <Text style={{ color: "red" }}>{this.state.errormessage}</Text>
        <View style={{ margin: 7 }} />
        <Button onPress={this.login} title="Submit" />
      </ScrollView>
    );
  }

  login() {
    this.setState({
      errormessage: ""
    });
    let username = this.state.username;
    let password = this.state.password;

    if (Authenticate(username, password)) {
      this.props.navigation.navigate("ChooseEvent");
    } else {
      this.setState({
        username: "",
        password: "",
        errormessage: "Invalid username or password"
      });
    }
  }
}
