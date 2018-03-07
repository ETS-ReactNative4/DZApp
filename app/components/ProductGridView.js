import React, { Component } from "react";
import GridView from "react-native-super-grid";
import Product from "../models/Product";
import Order from "../models/Order";
import ProductThumbnail from "./ProductThumbnail";
import {
  newOrder,
  addItemToOrder,
  removeItemFromOrder
} from "../actions/creators";

import { connect } from "react-redux";

type Props = {
  products: Product[],
  order: Order
};
type State = {};

class ProductGridView extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  _addItemToOrder = (productId, quantity) => {
    this.props.addItemToOrder(productId, quantity);
  };

  _removeItemFromOrder = productId => {
    this.props.removeItemFromOrder(productId);
  };

  render() {
    console.log(this.props);
    return (
      <GridView
        itemDimension={130}
        items={this.props.products}
        renderItem={product => {
          return (
            <ProductThumbnail
              product={product}
              quantity={this.props.orders.order.getQuantity(product.id)}
              onPress={() => this._addItemToOrder(product.id, 1)}
              onLongPress={() => this._removeItemFromOrder(product.id, 1)}
            />
          );
        }}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    orders: state.orders
  };
};

const mapDispatchToProps = dispatch => {
  return {
    newOrder: () => {
      dispatch(newOrder());
    },
    addItemToOrder: (productId, quantity) => {
      dispatch(addItemToOrder(productId, quantity));
    },
    removeItemFromOrder: productId => {
      dispatch(removeItemFromOrder(productId));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductGridView);
