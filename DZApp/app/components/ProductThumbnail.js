import React, { Component } from "react";

//components
import { Image, TouchableOpacity } from "react-native";
import { Text, View, Badge, Icon, Button } from "native-base";

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
  return (
    <TouchableOpacity
      style={styles.productThumbnailHolder}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      <View style={styles.productThumbnailImageHolder}>
        <Image
          source={{ uri: product.imageUrl }}
          style={styles.productThumbnailImage}
          resizeMode="contain"
        />
        {/* show quantity badge when quantity of this product in orderlines > 0 */}
        {quantity > 0 && (
          <Badge style={styles.productThumbnailQuantity}>
            <Text style={styles.white}>{quantity}</Text>
          </Badge>
        )}
      </View>

      <View style={styles.productThumbnailCaption}>
        <Text
          style={[styles.productThumbnailText, styles.secondary, styles.bold]}
        >
          {product.name}
        </Text>
        <Text style={styles.productThumbnailText}>
          {toStringWithDecimals(product.price, 2) + " €"}
        </Text>
        <Text note style={styles.productThumbnailText}>
          {`${product.inStock} ${strings.IN_STOCK}`}
        </Text>
        {/* show trash icon when quantity of this product in orderlines > 0 */}
        {quantity > 0 && (
          <Button
            rounded
            small
            transparent
            style={styles.productThumbnailTrash}
            onPress={onTrashButtonPress}
          >
            <Icon name="trash" style={styles.primary} />
          </Button>
        )}
      </View>
    </TouchableOpacity>
  );
};
