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
  Button,
  Text,
  Thumbnail,
  View,
  Spinner,
  Card,
  CardItem,
  Right,
  Icon
} from "native-base";
import {
  Menu,
  MenuProvider,
  MenuOptions,
  MenuOption,
  MenuTrigger
} from "react-native-popup-menu";

//styles
import styles from "../styles/styles";
import colors from "../styles/colors";

//resources
import * as strings from "../constants/strings";

//redux
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

//actions
import { login } from "../actions/cashierActions";
import { syncAll } from "../actions/syncActions";

//functions
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
        {/* HEADER */}
        <Header style={styles.primaryBackground}>
          <Left>
            <Thumbnail
              square
              small
              source={require("../assets/images/logo.gif")}
            />
          </Left>
          <Body>
            <Title>{strings.LOGIN}</Title>
          </Body>
          <Right>{this._renderPopupMenu()}</Right>
        </Header>
        {/* HEADER END */}
        {/* CONTENT */}
        <Content padder contentContainerStyle={styles.scrollviewCenter}>
          {this._renderForm()}
        </Content>
        {/* CONTENT END */}
      </Container>
    );
  }

  _renderForm = () => {
    let renderSpinner = this.props.isAuthenticating;

    return (
      <Card>
        <CardItem header>
          <Text>{strings.LOGIN_HEADER}</Text>
        </CardItem>
        <View>
          {renderSpinner ? (
            this._renderSpinner()
          ) : (
            <View style={styles.cardForm}>
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
            </View>
          )}
          <CardItem>
            <Body>
              <Button
                full
                onPress={() => this._onLoginButtonPress()}
                disabled={
                  this.state.userName === "" || this.state.password === ""
                }
                style={
                  this.state.userName !== "" && this.state.password !== ""
                    ? styles.primaryActionButton
                    : styles.primaryActionButtonDisabled
                }
              >
                <Text style={styles.primaryButtonText}>{strings.LOGIN}</Text>
              </Button>
            </Body>
          </CardItem>
          <CardItem footer>
            {/* <Button transparent full small onPress={() => {}}>
              <Text style={styles.smallButtonText}>{strings.FORGOT_PASS}</Text>
            </Button> */}
          </CardItem>
        </View>
      </Card>
    );
  };

  _renderPopupMenu() {
    return (
      <Button transparent>
        <Menu>
          <MenuTrigger>
            <Icon name="menu" style={styles.popupMenuIcon} />
          </MenuTrigger>
          <MenuOptions>
            <MenuOption onSelect={() => this.props.syncAll()}>
              <Text style={styles.popupMenuText}>{strings.FORCE_SYNC}</Text>
            </MenuOption>
            <MenuOption onSelect={() => this._onServerConfigMenuOptionPress()}>
              <Text style={styles.popupMenuText}>{strings.SERVER_CONFIG}</Text>
            </MenuOption>
          </MenuOptions>
        </Menu>
      </Button>
    );
  }

  _renderSpinner = () => {
    return (
      <Spinner
        color={colors.SECONDARY_COLOR}
        //style={styles.center}
        large
        animating={this.props.isAuthenticating}
      />
    );
  };

  componentDidUpdate() {
    if (this.props.message !== null) {
      showInfoToast(this.props.message);
    }
    if (this.props.error !== null) {
      showErrorToast(this.props.error);
    }
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

  _onServerConfigMenuOptionPress = () => {
    this.props.navigation.navigate("ServerConfigScreen", {
      previousState: this.props.navigation.state
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
    error: state.MessageReducer.error
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ login, syncAll }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
