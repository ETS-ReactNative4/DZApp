//@flow
import React, { Component } from "react";

//components
import {
  Container,
  Header,
  Left,
  Body,
  Title,
  Content,
  Form,
  Item,
  Input,
  Label,
  H2,
  Button,
  Text,
  Thumbnail
} from "native-base";

//styles
import styles from "../styles/styles";

//resources
import * as strings from "../constants/strings";

//redux
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { login } from "../actions/cashierActions";

type Props = {};

type State = {
  username: String,
  password: String
};

class LoginScreen extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      userName: "",
      password: ""
    };
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
            <Title>{strings.LOGIN}</Title>
          </Body>
        </Header>
        <Content padder>
          <H2 style={[styles.centerText, styles.primary]}>
            {strings.LOGIN_HEADER}
          </H2>
          <Form style={styles.form}>
            <Item floatingLabel last>
              <Label>{strings.USERNAME}</Label>
              <Input
                onChangeText={value => this.setState({ userName: value })}
                value={this.state.userName}
              />
            </Item>
            <Item floatingLabel last>
              <Label>{strings.PASSWORD}</Label>
              <Input
                onChangeText={value => this.setState({ password: value })}
                value={this.state.password}
                secureTextEntry={true}
              />
            </Item>

            <Text style={styles.error}>{this.props.errorMessage}</Text>
          </Form>
          {this.state.userName !== "" &&
            this.state.password !== "" && (
              <Button
                primary
                block
                onPress={() => this._onLoginButtonPress()}
                disabled={
                  this.state.userName === "" || this.state.password === ""
                }
                style={
                  this.state.userName !== "" && this.state.password !== ""
                    ? styles.primaryBackground
                    : null
                }
              >
                <Text>{strings.LOGIN}</Text>
              </Button>
            )}
        </Content>
      </Container>
    );
  }

  _onLoginButtonPress = () => {
    let credentials = {
      userName: this.state.userName,
      password: this.state.password
    };
    this.props.login(credentials, this.props.navigation);
    this.setState({
      userName: "",
      password: ""
    });
  };
}

const mapStateToProps = state => {
  return {
    errorMessage: state.CashierReducer.errorMessage
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ login }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
