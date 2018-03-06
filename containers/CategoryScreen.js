import React, { Component } from "react";
import { Text } from "react-native";
import Category from "../models/Category";

type Props = {
  category: Category
};

export default class CategoryScreen extends Component<Props> {
  constructor(props) {
    super(props);
  }

  render() {
    return <Text>{this.props.category.name}</Text>;
  }
}
