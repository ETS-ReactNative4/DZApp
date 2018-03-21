//@flow
import React, { Component } from "react";
import { View, Text, FlatList, TouchableHighlight } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import QuantityControlModal from "../components/QuantityControlModal";
import OverviewListItem from "../components/OverviewListItem";
import OverviewSummary from "../components/OverviewSummary";
import * as texts from "../components/textcomponents";
import * as views from "../components/viewcomponents";

//styles
import styles from "../styles/styles";
import colors from "../styles/colors";

//redux
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setProductQuantity } from "../actions/productActions";

type Props = {};

type State = {};

class OverviewScreen extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {};
    this._onEditIconPress = this._onEditIconPress.bind(this);
    this._onModalTrashIconPress = this._onModalTrashIconPress.bind(this);
    this._toggleModalVisible = this._toggleModalVisible.bind(this);
    this._onModalSlidingComplete = this._onModalSlidingComplete.bind(this);
  }

  render() {
    //map the orderlines from global state with quantity > 0
    //to an array of objects for display in flatlist
    let orderlines = Object.keys(this.props.order.orderlines).map(key => {
      return {
        key: key,
        name: this.props.products.find(p => p._id === key).name,
        quantity: this.props.order.orderlines[key]
      };
    });
    orderlines = orderlines.filter(o => o.quantity != 0);
    //total amount for summary
    let totalAmount = 0.0;
    orderlines.forEach(o => {
      totalAmount +=
        o.quantity * this.props.products.find(p => p._id === o.key).price;
    });
    let totalAmountString =
      totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 }) +
      " €";
    //cashier name for summary
    let cashierName = `${this.props.cashier.firstName} ${
      this.props.cashier.lastName
    }`;
    //event name for summary
    let eventName = this.props.event.name;

    return (
      <views.Container>
        <View style={styles.overviewListHolder}>
          <FlatList
            data={orderlines}
            renderItem={({ item }) => (
              <OverviewListItem
                item={item}
                onEditIconPress={() => this._onEditIconPress(item.key)}
                products={this.props.products}
                order={this.props.order}
              />
            )}
            ItemSeparatorComponent={this._renderSeparator}
          />
        </View>
        {this._renderSeparator()}
        <OverviewSummary
          cashierName={`${this.props.cashier.firstName} ${
            this.props.cashier.lastName
          }`}
          eventName={this.props.event.name}
          totalAmountString={totalAmountString}
        />
        <QuantityControlModal
          ref="modal"
          backdropColor={colors.PRIMARY_COLOR}
          onTrashIconPress={this._onModalTrashIconPress}
          onSliderValueChanged={this._onModalSliderValueChanged}
          onSlidingComplete={this._onModalSlidingComplete}
        />
      </views.Container>
    );
  }

  _renderSeparator() {
    return <View style={styles.separator} />;
  }

  _onEditIconPress(productId: String) {
    let product = this.props.products.find(p => p._id === productId);
    let modal = this.refs.modal;
    modal.setState({
      product: product,
      quantity: this.props.order.orderlines[productId]
        ? this.props.order.orderlines[productId]
        : 0
    });
    this._toggleModalVisible();
  }

  _onModalTrashIconPress() {
    this._onModalSlidingComplete(0);
    this._toggleModalVisible();
  }

  _toggleModalVisible() {
    let modal = this.refs.modal;
    modal.setState({ isVisible: !modal.state.isVisible });
  }

  _onModalSlidingComplete(value: number) {
    let modal = this.refs.modal;
    let product = modal.state.product;
    this.props.setProductQuantity(product._id, value);
  }
}

const mapStateToProps = state => {
  return {
    order: state.productReducer.order,
    products: state.productReducer.products,
    cashier: state.customerReducer.customers.find(
      c => c._id === state.cashierReducer.cashierId
    ),
    event: state.eventReducer.events.find(
      e => e._id === state.eventReducer.eventId
    )
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ setProductQuantity }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(OverviewScreen);
