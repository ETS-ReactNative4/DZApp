import React, { Component } from "react";
import { View, Button } from "react-native";
import * as texts from "../components/textcomponents";
import * as views from "../components/viewcomponents";

//styles
import styles from "../styles/styles";
import colors from "../styles/colors";

type Props = {
  cashierName: String,
  eventName: String,
  totalAmountString: String
};
type State = {};

export default class OverviewSummary extends Component<Props, State> {
  render() {
    return (
      <View style={styles.overviewSummary}>
        <views.Row style={{ marginBottom: 15 }}>
          <texts.LabelNormal text="TOTAAL: " />
          <texts.TextNormal
            text={this.props.totalAmountString}
            style={{ color: colors.PRIMARY_COLOR }}
          />
        </views.Row>

        <views.Row>
          <texts.LabelNormal text="Evenement:" />
          <texts.TextNormal text={this.props.eventName} />
        </views.Row>
        <views.Row style={{ marginBottom: 20 }}>
          <texts.LabelNormal text="Kassier:" />
          <texts.TextNormal text={this.props.cashierName} />
        </views.Row>

        <Button
          color={colors.PRIMARY_COLOR}
          title="Kies Klant"
          onPress={() => console.log("kies klant")}
        />
      </View>
    );
  }
}
