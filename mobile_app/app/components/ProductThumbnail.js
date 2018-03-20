//@flow
import React, { Component } from "react";
import { StyleSheet, View, Image, Text, TouchableOpacity } from "react-native";
import styles from "../styles/styles";

type Props = {
  product: {},
  quantity: number,
  onPress: () => any,
  onLongPress: () => any,
  isSelected: boolean
};

export default class ProductThumbnail extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};    
  }

  render() {
    return (
      <TouchableOpacity
        style={[styles.thumbnail,this.props.isSelected? styles.thumbIsSelected : null]}
        onPress={this.props.onPress}
        onLongPress={this.props.onLongPress}
      >
        <View style={styles.thumbImageView}>
          <Image
            style={styles.thumbImage}
            source={{ uri: this.props.product.imageUrl }}
          />
          {
            this.props.quantity > 0 &&
            <Text style={styles.thumbQuantityLabel}>{this.props.quantity}</Text>
          }
        </View>
        <View style={styles.thumbCaption}>
          <Text style={styles.thumbNameLabel}>{this.props.product.name}</Text>
          <Text style={styles.thumbPriceLabel}>
            {this.props.product.price.toLocaleString(undefined, {
              minimumFractionDigits: 2
            })}{" "}
            €
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}
