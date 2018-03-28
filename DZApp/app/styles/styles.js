import React from "react";
import { StyleSheet } from "react-native";

//style
import colors from "./colors";

const styles = StyleSheet.create({
  /*** */
  title: {
    color: colors.PRIMARY_COLOR,
    marginBottom: 20
  },
  label: {
    color: colors.LABEL_COLOR
  },
  value: {
    color: colors.SECONDARY_COLOR
  },
  primaryActionButton: {
    backgroundColor: colors.PRIMARY_COLOR,
    marginBottom: 20,
    marginTop: 20,
    alignSelf: "center",
    width: 250,
    alignItems: "center",
    justifyContent: "center"
  },
  primaryActionButtonDisabled: {
    marginBottom: 20,
    marginTop: 20,
    alignSelf: "center",
    width: 250,
    alignItems: "center",
    justifyContent: "center"
  },
  borderedButton: {
    marginBottom: 20,
    marginTop: 20,
    alignSelf: "center",
    width: 250,
    alignItems: "center",
    justifyContent: "center",
    borderColor: colors.PRIMARY_COLOR
  },
  titleButton: {
    
  },

  primaryButtonText: {
    textAlign: "center",
    color: colors.TITLE_COLOR
  },
  borderedButtonText: {
    textAlign: "center",
    color: colors.PRIMARY_COLOR
  },
  pickerText: {
    fontWeight: "bold",
    color: colors.PRIMARY_COLOR
  },
  /*** */
  content: {
    flex: 1,
    justifyContent: "center"
  },
  centerText: {
    textAlign: "center"
  },
  rightText: {
    textAlign: "right"
  },
  center: {
    alignSelf: "center"
  },
  end: {
    alignSelf: "flex-end"
  },
  white: {
    color: colors.TITLE_COLOR
  },
  primary: {
    color: colors.PRIMARY_COLOR
  },
  secondary: {
    color: colors.SECONDARY_COLOR
  },
  primaryBackground: {
    backgroundColor: colors.PRIMARY_COLOR
  },
  secondaryBackground: {
    backgroundColor: colors.SECONDARY_COLOR
  },
  bold: {
    fontWeight: "bold"
  },
  row: {
    flexDirection: "row"
    //justifyContent: "space-between"
  },
  valueRow: {
    flexDirection: "row",
    flex: 1
  },
  //LoginScreen,
  error: {
    color: "red",
    margin: 10
  },
  //LoadingScreen
  loadingContainer: {
    backgroundColor: colors.PRIMARY_COLOR
  },
  loadingThumb: {
    marginBottom: 20
  },
  //EventScreen
  eventCardHolder: {
    height: 230,
    marginBottom: 10
  },
  //ProductThumbnail
  productThumbnailHolder: {
    width: 130,
    height: 130,
    borderColor: colors.SECONDARY_COLOR,
    borderWidth: 2,
    borderRadius: 10
  },
  productThumbnailCaption: {
    flex: 0.4,
    padding: 5
  },
  productThumbnailText: {
    fontSize: 12
  },
  productThumbnailImageHolder: {
    flex: 0.6
  },
  productThumbnailImage: {
    flex: 1,
    width: undefined,
    height: undefined
  },
  productThumbnailQuantity: {
    backgroundColor: colors.PRIMARY_COLOR,
    position: "absolute",
    left: 5,
    top: 5,
    justifyContent: "center"
  },
  productThumbnailTrash: {
    position: "absolute",
    right: -10,
    bottom: -2,
    justifyContent: "center",
    borderRadius: 100
  },
  //ProductQuantityModal
  quantityModal: {
    flex: 1
  },
  quantityModalContent: {
    height: 200
  },
  quantitySliderTrackStyle: {
    height: 2,
    borderRadius: 5,
    backgroundColor: colors.PRIMARY_COLOR
  },
  quantitySliderThumbStyle: {
    width: 20,
    height: 20,
    borderRadius: 20 / 2,
    backgroundColor: colors.SECONDARY_COLOR
  },
  quantitySliderStyle: {
    width: "100%",
    marginBottom: 20
  },
  //OverviewScreen
  overviewListitem: {},
  overviewListThumbnail: {
    marginRight: 10
  },
  overviewListName: {
    flex: 0.3
  },
  overviewListQuantity: {
    flex: 0.3
  },
  overviewListPrice: {
    flex: 0.3
  },
  overviewSummary: {
    height: 230,

    marginTop: 20
  },
  overviewSummaryButton: {
    marginTop: 20
  },
  //TopupScreen:
  cameraHolder: {
    height: 300,
    width: "100%",
    alignSelf: "center",
    flexDirection: "row"
  },
  camera: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  //tabbar
  tabbarText: {
    fontSize: 9
  }
});

export default styles;
