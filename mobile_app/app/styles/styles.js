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
    justifyContent: "center",    
  },
  eventBox: {
    borderColor: colors.SECONDARY_COLOR,
    borderWidth: 2,
    borderRadius: 10,
    padding: 5,
    marginBottom:10,
    flexDirection: 'row'
  },
  bold: {
    fontWeight: 'bold'
  },
  row:{
    flexDirection: 'row'
  },
  column:{
    flexDirection: 'column',
    marginRight: 15
  },
  primary:{
    color:colors.PRIMARY_COLOR
  },
  //loading screen
  loadingContainer:{
    backgroundColor:colors.PRIMARY_COLOR,
    flexDirection:'column',
    alignItems: "center"
  },
  loadingLogo:{
    width: 100,
    height: 100,
    marginBottom:20
  },
  statusText:{
    color: colors.TITLE_COLOR,    
  },
  loadingIndicator:{
    marginBottom:20
  }
});

export default styles;
