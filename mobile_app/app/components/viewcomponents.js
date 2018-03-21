import React, { Component } from "react";
import { View } from "react-native";

//styles
import styles from "../styles/styles";
import colors from "../styles/colors";

export const Container = ({ children, style }) => {
  return <View style={[styles.container, style]}>{children}</View>;
};

export const RowAlignStart = ({ children, style }) => {
  return <View style={[styles.rowAlignStart, style]}>{children}</View>;
};

export const Row = ({ children, style }) => {
  return <View style={[styles.row, style]}>{children}</View>;
};
