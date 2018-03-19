import React, { Component } from "react";
import {
  View,
  Text,
  TouchableHighlight,
  StyleSheet
} from "react-native";

import GridView from "react-native-super-grid";
// import Product from "../models/Product";
// import Order from "../models/Order";
import ProductThumbnail from "./ProductThumbnail";
// import {
//   newOrder,
//   addItemToOrder,
//   removeItemFromOrder
// } from "../actions/creators";

import { connect } from "react-redux";

type Props = {
  products: [],
  // order: Order
};
type State = {  
};

export default class ProductGridView extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {      
    };
  }

  // _addItemToOrder = productId => {
  //   this.props.addItemToOrder(productId, 1);
  // };

  // _addItemsToOrder = (product: Product) => {
  //   this.setState({ modalVisible: true });
  // };

  render() {
    return (
      <View>
        <GridView
          itemDimension={130}
          items={this.props.products}
          renderItem={product => {
            return (
              <ProductThumbnail
                product={product}
                //quantity={this.props.orders.order.getQuantity(product.id)}
                quantity={0}
                //onPress={() => this._addItemToOrder(product.id)}
                //onLongPress={() => this._addItemsToOrder(product)}
              />
            );
          }}
        />        
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});
