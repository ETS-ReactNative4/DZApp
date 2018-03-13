//@flow

import React, { Component } from "react";
import { Image, Text, View } from "react-native";
import styles from "../styles/styles";

type Props = {};

export default class Logotitle extends Component<Props> {
  render() {
    return (
      <View style={styles.actionBar}>
        <Image
          source={require("../assets/images/site_dz.jpg")}
          style={styles.logo}
        />
        <Text style={styles.actionBarTitle}>{this.props.title}</Text>
      </View>
    );
  }
}
