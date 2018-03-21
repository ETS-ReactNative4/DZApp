//@flow

import React, { Component } from "react";
import {
  View,
  Text,
  Button,
  Image,
  TouchableHighlight,
  Alert
} from "react-native";
import Slider from "react-native-slider";
import Modal from "react-native-modal";
import Icon from "react-native-vector-icons/MaterialIcons";
import QuantityControlModal from "../components/QuantityControlModal";

//styles
import styles from "../styles/styles";
import colors from "../styles/colors";

//components
import GridView from "react-native-super-grid";
import ProductThumbnail from "../components/ProductThumbnail";
import { OverviewButton } from "../components/HeaderButtons";

//redux
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  incrementProductQuantity,
  setProductQuantity
} from "../actions/productActions";

type Props = {};

type State = {};

class OrderScreen extends Component<Props, State> {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};

    return {
      title: "Bestellen",
      headerRight: <OverviewButton onPress={params.navToOverview} />
    };
  };

  constructor(props: Props) {
    super(props);
    this._onProductThumbnailPress = this._onProductThumbnailPress.bind(this);
    this._onProductThumbnailLongPress = this._onProductThumbnailLongPress.bind(
      this
    );
    this._toggleModalVisible = this._toggleModalVisible.bind(this);
    this._navToOverview = this._navToOverview.bind(this);
    this._onModalSlidingComplete = this._onModalSlidingComplete.bind(this);
    this._onModalTrashIconPress = this._onModalTrashIconPress.bind(this);
  }

  componentWillMount() {
    this.props.navigation.setParams({ navToOverview: this._navToOverview });
  }

  render() {
    return (
      <View style={styles.container}>
        <GridView
          style={styles.productGrid}
          itemDimension={130}
          items={this.props.products}
          renderItem={p => {
            return (
              <ProductThumbnail
                product={p}
                quantity={this.props.order.orderlines[p._id]}
                onPress={() => this._onProductThumbnailPress(p._id)}
                onLongPress={() => this._onProductThumbnailLongPress(p._id)}
              />
            );
          }}
          horizontal={true}
          spacing={10}
        />
        <QuantityControlModal
          ref="modal"
          backdropColor={colors.PRIMARY_COLOR}
          onTrashIconPress={this._onModalTrashIconPress}
          onSliderValueChanged={this._onModalSliderValueChanged}
          onSlidingComplete={this._onModalSlidingComplete}
        />
      </View>
    );
  }

  _navToOverview() {
    this.props.navigation.navigate("OverviewScreen");
  }

  //checks the product's stock and increments
  //product's orderline quantity by 1
  _onProductThumbnailPress(productId: number) {
    let unitsInOrderline = this.props.order.orderlines[productId] || 0;
    let unitsInStock = this.props.products.find(p => p._id === productId)
      .inStock;
    if (unitsInOrderline < unitsInStock)
      this.props.incrementProductQuantity(productId);
    else
      Alert.alert(
        "Onvoldoende voorraad",
        "Te weinig eenheden van dit product in stock, gelieve een andere keuze te maken."
      );
  }

  //sets the local state to the product that's been long pressed
  //and the quantity to the amount of units in that product's orderline
  _onProductThumbnailLongPress(productId: number) {
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
    products: state.productReducer.products,
    order: state.productReducer.order
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    { incrementProductQuantity, setProductQuantity },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderScreen);
