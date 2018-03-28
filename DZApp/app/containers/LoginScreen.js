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
  Thumbnail,
  View,
  Spinner
} from "native-base";

//styles
import styles from "../styles/styles";
import colors from "../styles/colors";

//resources
import * as strings from "../constants/strings";

//redux
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { login } from "../actions/cashierActions";
import { showInfoToast, showErrorToast } from "../functions/toast";

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
        <Content padder contentContainerStyle={styles.content}>
          {this.props.isAuthenticating
            ? this._renderSpinner()
            : this._renderForm()}
        </Content>
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

  _renderForm = () => {
    return (
      <View>
        <H2 style={styles.title}>{strings.LOGIN_HEADER}</H2>
        <Form>
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
        </Form>
        <Button
          onPress={() => this._onLoginButtonPress()}
          disabled={this.state.userName === "" || this.state.password === ""}
          style={
            this.state.userName !== "" && this.state.password !== ""
              ? styles.primaryActionButton
              : styles.primaryActionButtonDisabled
          }
        >
          <Text style={styles.primaryButtonText}>{strings.LOGIN}</Text>
        </Button>
      </View>
    );
  };

  _renderSpinner = () => {
    return (
      <Spinner
        color={colors.SECONDARY_COLOR}
        style={styles.center}
        large
        animating={this.props.isAuthenticating}
      />
    );
  };

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
    //errorMessage: state.CashierReducer.errorMessage
    message: state.MessageReducer.message,
    error: state.MessageReducer.error,
    isAuthenticating: state.CashierReducer.isAuthenticating,
    message: state.MessageReducer.message,
    error: state.MessageReducer.error,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ login }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
