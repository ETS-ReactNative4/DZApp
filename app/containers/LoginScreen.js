//@flow
//react-native
import React, { Component } from "react";
import { Text, TextInput, View, Button } from "react-native";

//redux
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as Actions from "../actions/creators";

//Styles
import styles from "../styles/styles";
import colors from "../styles/colors";

type Props = {};

type State = {
  userName: string,
  password: string,
  errorMessage: string
};

class LoginScreen extends Component<Props, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      userName: "",
      password: "",
      errorMessage: ""
    };
    this.onLoginButtonPress = this.onLoginButtonPress.bind(this);
  }

  onLoginButtonPress() {
    let credentials = {
      userName: this.state.userName,
      password: this.state.password
    };
    this.props.login(credentials, this.props.navigation);
    this.setState({
      userName: "",
      password: ""
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.header1}>Gelieve eerst aan te melden:</Text>
        <TextInput
          placeholder="Gebruikersnaam"
          onChangeText={value => this.setState({ userName: value })}
          value={this.state.userName}
          placeholderTextColor={colors.SECONDARY_COLOR}
        />
        <TextInput
          placeholder="Wachtwoord"
          onChangeText={value => this.setState({ password: value })}
          value={this.state.password}
          placeholderTextColor={colors.SECONDARY_COLOR}
          secureTextEntry={true}
        />
        <Text style={{ color: "red" }}>{this.props.errorMessage}</Text>
        <View style={{ margin: 7 }} />
        <Button
          onPress={this.onLoginButtonPress}
          title="Aanmelden"
          color={colors.PRIMARY_COLOR}
          disabled={this.state.userName === "" || this.state.password === ""}
        />
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    customers: state.customerReducer.customers,
    cashierId: state.cashierReducer.cashierId,
    errorMessage: state.cashierReducer.errorMessage
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(Actions, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
