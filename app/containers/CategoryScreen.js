//@flow

import React, { Component } from "react";
import { Button } from "react-native";

//components
import Category from "../models/Category";
import ProductGridView from "../components/ProductGridView";

//models
import Product from "../models/Product";

//redux
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

  componentWillMount() {
    this.props.navigation.setParams({ increaseCount: this._increaseCount });
  }

  state = {
    count: 0
  };

  _increaseCount = () => {
    this.setState({ count: this.state.count + 1 });
    console.warn(this.state.count);
  };
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
