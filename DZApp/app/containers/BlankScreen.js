//Template screen with basic imports and redux integration

//@flow
import React, { Component } from "react";

//components
import { Container } from "native-base";

//styles
import styles from "../styles/styles";

//resources
import * as strings from "../constants/strings";

//redux
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

type Props = {};

type State = {};

class BlankScreen extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return <Container />;
  }
}

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({}, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(BlankScreen);
