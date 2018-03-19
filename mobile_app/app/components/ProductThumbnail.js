//@flow
import React, { Component } from "react";
import { StyleSheet, View, Image, Text, TouchableOpacity } from "react-native";
//import Product from "../models/Product";
//import Order from "../models/Order";

type Props = {
  product: {},
  quantity: number,
  //onPress: () => void,
  //onLongPress: () => void
};

export default class ProductThumbnail extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};    
  }

  render() {
    return (
      <TouchableOpacity
        style={styles.button}
        //onPress={this.props.onPress}
        //onLongPress={this.props.onLongPress}
      >
        <View style={styles.imageView}>
          <Image
            style={styles.image}
            source={{ uri: this.props.product.imageUrl }}
          />
          <Text style={styles.quantityLabel}>{this.props.quantity}</Text>
        </View>
        <View style={styles.caption}>
          <Text style={styles.nameLabel}>{this.props.product.name}</Text>
          <Text style={styles.priceLabel}>
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

const styles = StyleSheet.create({
  button: {
    flexDirection: "column",
    width: 150,
    height: 150,
    borderWidth: 3,
    borderColor: "#398a59",
    borderRadius: 10
  },
  imageView: {
    flex: 4
  },
  image: {
    width: null,
    height: null,
    resizeMode: "contain",
    padding: 10,
    flex: 1
  },
  quantityLabel: {
    position: "absolute",
    right: 5,
    top: 5,
    borderRadius: 100,
    width: 30,
    height: 30,
    backgroundColor: "#398958",
    textAlign: "center",
    textAlignVertical: "center",
    color: "#ffffff"
  },

  caption: {
    flex: 2,
    flexDirection: "column",
    padding: 5
  },
  nameLabel: {
    flex: 1,
    fontWeight: "bold"
  },
  priceLabel: {
    flex: 1
  }
});
