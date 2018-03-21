import React, { Component } from "react";
import { View } from "react-native";
import * as texts from "../components/textcomponents";
import * as views from "../components/viewcomponents";

//styles
import styles from "../styles/styles";
import colors from "../styles/colors";

type Props = {
  totalAmountString: String
};
type State = {};

export default class TotalLine extends Component<Props, State> {
  render() {
    return (
      <views.RowAlignStart>
        <texts.LabelNormal text="TOTAAL: " style={{}} />
        <texts.TextBig
          text={this.props.totalAmountString}
          style={{ color: colors.PRIMARY_COLOR }}
        />
      </views.RowAlignStart>
    );
  }
}
