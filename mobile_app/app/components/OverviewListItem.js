//@flow
import React, { Component } from "react";
import { View, Text, TouchableHighlight } from "react-native";

import * as texts from "../components/textcomponents";
import * as views from "../components/viewcomponents";
import Icon from "react-native-vector-icons/MaterialIcons";

//styles
import styles from "../styles/styles";
import colors from "../styles/colors";

type Props = {
  item: {},
  onEditIconPress: String => any,
  products: [],
  order: {}
};

type State = {};

export default class OverviewListItem extends Component<Props, State> {
  render() {
    let item = this.props.item;
    let price =
      item.quantity * this.props.products.find(p => p._id === item.key).price;
    let priceString =
      price.toLocaleString(undefined, { minimumFractionDigits: 2 }) + " €";

    return (
      <View style={styles.listItemContainer}>
        <views.Row>
          <TouchableHighlight
            style={[styles.iconContainerSmall, { flex: 2, marginRight: 5 }]}
            onPress={this.props.onEditIconPress}
            underlayColor={colors.TITLE_COLOR}
          >
            <View style={styles.iconContainerSmall}>
              <Icon name="mode-edit" size={25} color={colors.SECONDARY_COLOR} />
            </View>
          </TouchableHighlight>
          <texts.TextListItem style={{ flex: 8 }} text={item.name} />
          <texts.TextListItem
            style={{ flex: 2, textAlign: "right" }}
            text=" X "
          />
          <texts.TextListItem style={{ flex: 2 }} text={item.quantity} />
          <texts.TextListItem style={{ flex: 1 }} text=" = " />
          <texts.TextListItem
            style={{ flex: 4, textAlign: "right" }}
            text={priceString}
          />
        </views.Row>
      </View>
    );
  }
}
