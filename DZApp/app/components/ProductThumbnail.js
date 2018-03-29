import React, { Component } from "react";

//components
import { Image, TouchableOpacity } from "react-native";
import { Text, View, Badge, Icon, Button, Thumbnail, Body } from "native-base";
import { Col, Row, Grid } from "react-native-easy-grid";

//style
import styles from "../styles/styles";
import colors from "../styles/colors";

//resources
import * as strings from "../constants/strings";

//functions
import { toStringWithDecimals } from "../functions/number";

export const ProductThumbnail = ({
  product,
  quantity,
  onPress,
  onLongPress,
  onTrashButtonPress
}) => {
  let priceString = toStringWithDecimals(product.price, 2) + " €";
  let inStockString = `${strings.IN_STOCK} ${product.inStock} `;

  return (
    <TouchableOpacity
      style={styles.productThumbnailHolder}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      <Grid style={styles.productThumbnailGrid}>
        <Row size={40} style={styles.justifyCenter}>
          <Thumbnail square source={{ uri: product.imageUrl }} />
        </Row>
        <Row size={30} style={[styles.productThumbnailRow, { marginTop: 10 }]}>
          <Text style={styles.productThumbnailName}>{product.name}</Text>
        </Row>
        <Row size={15} style={styles.productThumbnailRow}>
          <Text style={styles.productThumbnailInfo}>{priceString}</Text>
        </Row>
        <Row size={15} style={styles.productThumbnailRow}>
          <Text style={styles.productThumbnailInfo}>{inStockString}</Text>
        </Row>
      </Grid>
      {quantity > 0 && (
        <Button
          small
          rounded
          transparent
          style={styles.productThumbnailTrashButton}
          onPress={onTrashButtonPress}
        >
          <Icon name="trash" style={styles.productThumbnailTrashIcon} />
        </Button>
      )}
      {quantity > 0 && (
        <Badge small style={styles.productThumbnailQuantity}>
          <Text style={[styles.productThumbnailInfo, styles.white]}>
            {quantity}
          </Text>
        </Badge>
      )}
    </TouchableOpacity>
  );
};
