import React, { Component } from "react";
import { TouchableHighlight } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

//styles
import styles from "../styles/styles";
import colors from "../styles/colors";

const headerButtonSize = 40;

export const OverviewButton = props => {
  return (
    <TouchableHighlight
      onPress={props.onPress}
      underlayColor={colors.PRIMARY_COLOR}
      activeOpacity={0.5}
    >
      <Icon name="list" size={headerButtonSize} color={colors.TITLE_COLOR} />
    </TouchableHighlight>
  );
};
