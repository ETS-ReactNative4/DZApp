import React from "react";
import { StyleSheet } from "react-native";
import colors from "./colors";

const styles = StyleSheet.create({
  header1: {
    fontSize: 27,
    color: colors.PRIMARY_COLOR,
    marginBottom: 5
  },
  button: {},
  actionBarTitle: {
    color: colors.TITLE_COLOR,
    fontSize: 24
  },
  actionBar: {
    flex: 1,
    alignContent: "center",
    alignItems: "center",
    flexDirection: "row"
  },
  logo: {
    width: 45,
    height: 45,
    marginRight: 10
  },

  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center"
  }
});

export default styles;
