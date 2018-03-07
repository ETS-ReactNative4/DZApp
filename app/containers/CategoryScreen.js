//@flow

import React, { Component } from "react";
import { Text } from "react-native";
import Category from "../models/Category";
import ProductGridView from "../components/ProductGridView";
import Product from "../models/Product";

import { connect } from "react-redux";

type Props = {
  category: Category,
  products: Product[]
};

class CategoryScreen extends Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    const products = this.props.products.filter(
      product => product.categoryId === this.props.category.id
    );
    return <ProductGridView products={products} />;
  }
}

const mapStateToProps = state => {
  return {
    products: state.products
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(CategoryScreen);
