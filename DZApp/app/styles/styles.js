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
  value: {},
  error: {
    color: "red",
    fontSize: 12
  },
  primaryActionButton: {
    backgroundColor: colors.PRIMARY_COLOR
  },

  primaryActionButtonDisabled: {},
  borderedButton: {
    marginBottom: 20,
    marginTop: 20,
    alignSelf: "center",
    width: 250,
    alignItems: "center",
    justifyContent: "center",
    borderColor: colors.PRIMARY_COLOR
  },
  smallButtonText: {
    fontSize: 12,
    color: colors.SECONDARY_COLOR
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
  /***POSITION */
  content: {
    flex: 1,
    justifyContent: "center"
  },
  justifyCenter: {
    justifyContent: "center"
  },
  alignCenter: {
    alignItems: "center"
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
  right: {
    alignSelf: "flex-end"
  },
  left: {
    alignSelf: "flex-start"
  },
  //for centering inside scrollview
  scrollviewCenter: {
    flexGrow: 1,
    justifyContent: "center"
  },
  /***COLORS */
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
    flex: 1,
    marginBottom: 10
  },
  /*** Components */

  /*** Cards */
  cardForm: {
    paddingLeft: 15,
    paddingRight: 15,
    marginBottom: 20
  },
  cardPicker: {
    paddingLeft: 10,
    paddingRight: 10
  },
  //LoadingScreen
  loadingContainer: {
    backgroundColor: colors.PRIMARY_COLOR
  },
  loadingThumb: {
    marginBottom: 20
  },
  //ProductThumbnail
  productThumbnailHolder: {
    width: 130,
    height: 130
  },
  productThumbnailGrid: {
    borderColor: colors.SECONDARY_COLOR,
    borderWidth: 2,
    borderRadius: 10,
    padding: 5
  },
  productThumbnailName: {
    fontSize: 15,
    color: colors.PRIMARY_COLOR,
    marginTop: 5
  },
  productThumbnailInfo: {
    fontSize: 12,
    color: colors.LABEL_COLOR
  },
  productThumbnailRow: {
    paddingLeft: 5,
    paddingRight: 5
  },
  productThumbnailQuantity: {
    backgroundColor: colors.PRIMARY_COLOR,
    position: "absolute",
    left: 5,
    top: 5,
    justifyContent: "center"
  },
  productThumbnailTrashIcon: {
    fontSize: 20,
    color: colors.SECONDARY_COLOR
  },
  productThumbnailTrashButton: {
    borderRadius: 100,
    position: "absolute",
    right: -10,
    bottom: 0,
    alignItems: "flex-end",
    justifyContent: "flex-end",
    height: 30,
    width: 45,
    padding: 0
  },
  //ProductQuantityModal
  quantityModal: {
    flex: 1
  },
  quantityModalContent: {
    height: 350
  },
  topupConfirmModalContent: {
    height: 200
  },
  orderTopupModalContent: {
    height: 300
  },
  // quantitySliderTrackStyle: {
  //   height: 2,
  //   borderRadius: 5,
  //   backgroundColor: colors.PRIMARY_COLOR
  // },
  // quantitySliderThumbStyle: {
  //   width: 20,
  //   height: 20,
  //   borderRadius: 20 / 2,
  //   backgroundColor: colors.SECONDARY_COLOR
  // },
  // quantitySliderStyle: {
  //   width: "100%",
  //   marginBottom: 20
  // },

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
  },
  //HistoryScreen
  segment: {
    borderColor: colors.PRIMARY_COLOR,
    borderWidth: 2,
    backgroundColor: colors.PRIMARY_COLOR
  },
  segmentButton: {
    borderColor: colors.TITLE_COLOR
  },
  segmentButtonActive: {
    borderColor: colors.TILE_COLOR
  },
  segmentButtonText: {},
  segmentButtonTextActive: {
    color: colors.SECONDARY_COLOR
  }
});

export default styles;
