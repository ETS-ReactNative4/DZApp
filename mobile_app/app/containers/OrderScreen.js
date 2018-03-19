//@flow

import React, { Component } from "react";
import { View } from "react-native";
import styles from '../styles/styles';

//components
//import Category from "../models/Category";
//import ProductGridView from "../components/ProductGridView";
import GridView from "react-native-super-grid";
import ProductThumbnail from "../components/ProductThumbnail";

//models
//import Product from "../models/Product";

//redux
import { connect } from "react-redux";

type Props = {  
  
};

type State = {
  
}

class OrderScreen extends Component<Props,State> {
  constructor(props: Props) {
    super(props);
    this.state = {
  
    }
  }

  render() {    
    console.log(this.props.products);
    return (
    <View style={styles.container}>
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
      </View>);
  }

  componentWillMount() {
    this.props.navigation.setParams({ increaseCount: this._increaseCount });
  }

  state = {
    count: 0
  };

  
}

const mapStateToProps = state => {
  return {
    products: state.productReducer.products
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderScreen);
