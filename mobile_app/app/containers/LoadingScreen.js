//@flow
import React, { Component } from "react";
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  View,
  Text,
  Image
} from "react-native";

//redux
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { fetchCustomers } from "../actions/customerActions";
import { fetchEvents } from "../actions/eventActions";

import { store, persistor } from "../Store";

import styles from "../styles/styles";
import colors from "../styles/colors";

type Props = {};
type State = {};

class LoadingScreen extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // Render any loading content that you like here
  render() {
    return (
      <View style={[styles.loadingContainer, styles.container]}>
        <Image
          style={styles.loadingLogo}
          source={require("../assets/images/site_dz.jpg")}
          resizemode="contain"
        />
        <ActivityIndicator
          style={styles.loadingIndicator}
          size="large"
          color={colors.TITLE_COLOR}
          animating={this.props.loading}
        />
        <Text style={styles.statusText}>{this.props.statusText}</Text>
      </View>
    );
  }

  componentDidMount() {
    if (
      this.props.navigation &&
      !this.props.isFetchingCustomers &&
      !this.props.isFetchingEvents
    ) {
      setTimeout(() => {
        this.props.navigation.navigate(
          !this.props.cashierId
            ? "LoginScreen"
            : !this.props.eventId ? "EventScreen" : ""
        );
      }, 3000);
    }
  }
}

const mapStateToProps = state => {
  return {
    cashierId: state.cashierReducer.cashierId,
    eventId: state.eventReducer.eventId,
    loading:
      state.customerReducer.isFetching ||
      state.eventReducer.isFetching ||
      !state._persist.rehydrated,
    statusText: !state._persist.rehydrated
      ? "Lokale data laden"
      : state.customerReducer.isFetching || state.eventReducer.isFetching
        ? "Data van server laden"
        : state.customerReducer.error || state.eventReducer.error
          ? "probleem met server: offline modus"
          : "Gesynchroniseerd met server"
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ fetchCustomers, fetchEvents }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(LoadingScreen);
