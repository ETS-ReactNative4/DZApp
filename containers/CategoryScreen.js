import React, { Component } from "react";
import { Text } from "react-native";
import Category from "../models/Category";
import ProductGridView from "../components/ProductGridView";
import ProductDAO from "../dataaccess/ProductDAO";

type Props = {
  category: Category
};

export default class CategoryScreen extends Component<Props> {
  constructor(props) {
    super(props);
  }

  render() {
    const products = ProductDAO.fetchByCategoryId(this.props.category.id);
    console.log(products);
    return <ProductGridView products={products} />;
  }
}
