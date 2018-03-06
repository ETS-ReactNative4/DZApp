import React, { Component } from "react";
import GridView from "react-native-super-grid";
import Product from "../models/Product";
import ProductThumbnail from "./ProductThumbnail";

type Props = {
  products: Product[]
};
type State = {};

export default class ProductGridView extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <GridView
        itemDimension={130}
        items={this.props.products}
        renderItem={product => <ProductThumbnail product={product} />}
      />
    );
  }
}
