//@flow

import React, { Component } from "react";
import { Text } from "react-native";
import Category from "../models/Category";
import ProductGridView from "../components/ProductGridView";
import ProductDAO from "../lib/data/ProductDAO";

type Props = {
  category: Category
};

export default class CategoryScreen extends Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    const products = ProductDAO.fetchByCategoryId(this.props.category.id);
    return <ProductGridView products={products} />;
  }
}
