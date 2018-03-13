import React, { Component } from "react";
import {
  Alert,
  Modal,
  View,
  Text,
  TouchableHighlight,
  StyleSheet
} from "react-native";

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
type State = {
  modalVisible: boolean
};

class ProductGridView extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false
    };
  }

  _addItemToOrder = productId => {
    this.props.addItemToOrder(productId, 1);
  };

  _addItemsToOrder = (product: Product) => {
    this.setState({ modalVisible: true });
  };

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
                quantity={this.props.orders.order.getQuantity(product.id)}
                onPress={() => this._addItemToOrder(product.id)}
                onLongPress={() => this._addItemsToOrder(product)}
              />
            );
          }}
        />
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {}}
        >
          <View style={styles.container}>
            <Text>Voer aantal eenheden in</Text>
            <TouchableHighlight
              onPress={() => {
                this.setState({
                  modalVisible: !this.state.modalVisible
                });
              }}
            >
              <Text>Ok</Text>
            </TouchableHighlight>
          </View>
        </Modal>
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
