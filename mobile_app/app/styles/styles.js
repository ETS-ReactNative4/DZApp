import React from "react";
import { StyleSheet } from "react-native";
import colors from "./colors";

const styles = StyleSheet.create({
  header1: {
    fontSize: 27,
    color: colors.PRIMARY_COLOR,
    marginBottom: 5
  },
  header2: {
    fontSize: 20,
    color: colors.PRIMARY_COLOR,
    marginBottom: 30,
    alignSelf: "center"
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
  },
  eventBox: {
    borderColor: colors.SECONDARY_COLOR,
    borderWidth: 2,
    borderRadius: 10,
    padding: 5,
    marginBottom: 10,
    flexDirection: "row"
  },
  bold: {
    fontWeight: "bold"
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  column: {
    flexDirection: "column",
    marginRight: 15
  },
  primary: {
    color: colors.PRIMARY_COLOR
  },
  //loading screen
  loadingContainer: {
    backgroundColor: colors.PRIMARY_COLOR,
    flexDirection: "column",
    alignItems: "center"
  },
  loadingLogo: {
    width: 100,
    height: 100,
    marginBottom: 20
  },
  statusText: {
    color: colors.TITLE_COLOR
  },
  loadingIndicator: {
    marginBottom: 20
  },
  //product thumbnail
  thumbnail: {
    flexDirection: "column",
    width: 130,
    height: 130,
    borderWidth: 2,
    borderColor: colors.PRIMARY_COLOR,
    borderRadius: 10
  },
  thumbImageView: {
    flex: 4
  },
  thumbImage: {
    width: null,
    height: null,
    resizeMode: "contain",
    flex: 1
  },
  thumbQuantityLabel: {
    position: "absolute",
    right: 5,
    top: 5,
    borderRadius: 100,
    width: 30,
    height: 30,
    backgroundColor: colors.PRIMARY_COLOR,
    textAlign: "center",
    textAlignVertical: "center",
    color: colors.TITLE_COLOR
  },
  thumbCaption: {
    flex: 2,
    flexDirection: "column",
    padding: 5
  },
  thumbNameLabel: {
    flex: 1,
    fontWeight: "bold"
  },
  thumbPriceLabel: {
    flex: 1
  },
  thumbIsSelected: {
    borderColor: colors.SECONDARY_COLOR,
    borderWidth: 4
  },
  /*****OrderScreen******/
  productGrid: {
    alignSelf: "center"
  },
  quantityInputTitle: {
    color: colors.PRIMARY_COLOR,
    fontSize: 20,
    marginBottom: 5
  },
  quantityValueLabel: {
    color: colors.SECONDARY_COLOR
  },
  quantitySliderTrackStyle: {
    height: 2,
    borderRadius: 5,
    backgroundColor: colors.PRIMARY_COLOR
  },
  quantitySliderThumbStyle: {
    width: 10,
    height: 10,
    borderRadius: 10 / 2,
    backgroundColor: colors.SECONDARY_COLOR
  },
  quantityModal: {
    flex: 1,
    justifyContent: "flex-end"
  },
  quantityModalContent: {
    backgroundColor: colors.TITLE_COLOR,
    padding: 20,
    flex: 0.4,
    flexDirection: "column",
    borderWidth: 3,
    borderColor: colors.PRIMARY_COLOR,
    borderRadius: 10,
    justifyContent: "center"
  },
  /***** Order Overview ****/
  listItemContainer: {},
  separator: {
    height: 2,
    width: "100%",
    backgroundColor: colors.SECONDARY_COLOR
  }
});

export default styles;
