import React from "react";
import { StyleSheet, Platform } from "react-native";

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
    ...Platform.select({
      ios: {
        fontSize: 18
      },
      android: {
        fontSize: 20
      }
    }),

    color: colors.SECONDARY_COLOR
  },
  productThumbnailTrashButton: {
    position: "absolute",
    ...Platform.select({
      ios: {
        right: -5,
        bottom: 5
      },
      android: {
        borderRadius: 100,
        right: -10,
        bottom: 0
      }
    }),
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
    borderColor: colors.LABEL_COLOR,
    borderWidth: 1,
    backgroundColor: colors.PRIMARY_COLOR
  },
  segmentButton: {
    borderColor: colors.LABEL_COLOR,
    borderRadius: 5,
    backgroundColor: colors.SECONDARY_COLOR
  },
  segmentButtonActive: {
    borderColor: colors.TITLE_COLOR,
    borderRadius: 5,
    backgroundColor: colors.SECONDARY_COLOR
  },
  segmentButtonText: {
    color: colors.LABEL_COLOR
  },
  segmentButtonTextActive: {
    color: colors.TITLE_COLOR
  },
  //POPUP MENU
  popupMenuIcon: {
    //fontSize: 30,
    color: colors.TITLE_COLOR
  },
  popupMenuText: {
    fontSize: 16,
    color: colors.SECONDARY_COLOR,
    marginBottom: 5
  },
  divider: {
    marginVertical: 5,
    marginHorizontal: 2,
    borderBottomWidth: 1,
    borderColor: "#ccc"
  }
});

export default styles;
