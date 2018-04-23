//@flow
import React, { Component } from "react";

//components
import { Container, Content, Text, Thumbnail, Spinner } from "native-base";

//styles
import styles from "../styles/styles";
import colors from "../styles/colors";

//resources
import * as strings from "../constants/strings";

//redux
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { login } from "../actions/cashierActions";

type Props = {};

type State = {};

class LoadingScreen extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      userName: "",
      password: ""
    };
  }

  render() {
    return (
      <Container style={styles.loadingContainer}>
        <Content
          style={styles.loadingContainer}
          contentContainerStyle={[styles.content, styles.loadingContainer]}
        >
          <Thumbnail
            square
            large
            source={require("../assets/images/site_dz.jpg")}
            style={[styles.center, styles.loadingThumb]}
          />
          <Spinner
            color={colors.TITLE_COLOR}
            style={styles.center}
            large
            animating={!this.props.loaded}
          />
          <Text style={[styles.white, styles.center]}>
            {this.props.message}
          </Text>
        </Content>
      </Container>
    );
  }

  //navigate away from LoadingScreen when loaded
  //depending on set cashierId or eventId
  componentDidUpdate() {
    if (this.props.loaded && this.props.navigation)
      setTimeout(() => {
        this.props.navigation.navigate(
          !this.props.cashierId
            ? "AuthNavigator"
            : !this.props.eventId ? "EventScreen" : "MainFlowNavigator"
        );
      }, 2000);
  }
}

const mapStateToProps = state => {
  //message shown depending on local persistence rehydratation state and server
  //sync state
  let message;
  let loaded;

  let rehydrated = state._persist.rehydrated;

  let customersFetched = !state.CustomerReducer.isFetching;
  let eventsFetched = !state.EventReducer.isFetching;
  let productsFetched = !state.ProductReducer.isFetching;
  let subscriptionsFetched = !state.SubscriptionReducer.isFetching;

  let allFetched = customersFetched && eventsFetched && productsFetched && subscriptionsFetched;

  let synchronizedSuccessfully =
    state.CustomerReducer.errorMessage === null &&
    state.ProductReducer.errorMessage === null &&
    state.EventReducer.errorMessage === null
    state.SubscriptionReducer.errorMessage === null;

  if (!state._persist.rehydrated) {
    message = strings.LOCAL_LOADING;
    loaded = false;
  } else if (!allFetched) {
    message = strings.SERVER_SYNCING;
    loaded = false;
  } else if (!synchronizedSuccessfully) {
    message = strings.SERVER_SYNC_FAILURE;
    loaded = true;
  } else {
    message = strings.SERVER_SYNC_SUCCESS;
    loaded = true;
  }

  return {
    message: message,
    loaded: loaded,
    cashierId: state.CashierReducer.cashierId,
    eventId: state.EventReducer.eventId
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(LoadingScreen);
