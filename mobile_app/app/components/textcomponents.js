import React, { Component } from "react";
import { Text } from "react-native";

//styles
import styles from "../styles/styles";
import colors from "../styles/colors";

export const TextNormal = ({ text, style }) => {
  return <Text style={[styles.textNormal, style]}>{text}</Text>;
};

export const TextBig = ({ text, style }) => {
  return <Text style={[styles.textBig, style]}>{text}</Text>;
};

export const LabelNormal = ({ text, style }) => {
  return <Text style={[styles.labelNormal, style]}>{text}</Text>;
};

export const LabelBig = ({ text, style }) => {
  return <Text style={[styles.labelBig, style]}>{text}</Text>;
};

export const TextListItem = ({ text, style }) => {
  return <Text style={[styles.listItemText, style]}>{text}</Text>;
};
