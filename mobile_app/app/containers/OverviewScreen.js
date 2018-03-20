//@flow
import React, { Component } from "react";
import { View, Text, FlatList } from "react-native";

//styles
import styles from "../styles/styles";
import colors from "../styles/colors";

//redux
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { FETCH_PRODUCTS_FAILED } from "../actions/constants";

type Props = {};

type State = {};

class OverviewScreen extends Component<Props, State> {
  render() {
    let orderlines = Object.keys(this.props.order.orderlines).map(key => {
      return {
        key: key,
        name: this.props.products.find(p => p._id === key).name,
        quantity: this.props.order.orderlines[key]
      };
    });

    return (
      <View style={styles.container}>
        <FlatList
          data={orderlines}
          renderItem={({ item }) => {
            return this.renderItem(item);
          }}
          ItemSeparatorComponent={this.renderSeparator}
        />
      </View>
    );
  }

  renderItem(item) {
    return (
      <View>
        <Text>{item.name}</Text>
        <Text>{item.quantity}</Text>
      </View>
    );
  }

  renderSeparator() {
    return <View style={styles.separator} />;
  }
}

const mapStateToProps = state => {
  return {
    order: state.productReducer.order,
    products: state.productReducer.products
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({}, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(OverviewScreen);
