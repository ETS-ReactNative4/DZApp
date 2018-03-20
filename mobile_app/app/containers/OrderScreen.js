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

type State = {
  product: {},
  quantity: number,
  modalIsVisible: boolean
};

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
    this.state = {
      product: null,
      quantity: 0,
      modalIsVisible: false
    };
    this.onProductThumbnailPress = this.onProductThumbnailPress.bind(this);
    this.onProductThumbnailLongPress = this.onProductThumbnailLongPress.bind(
      this
    );
    this.removeSelectedProduct = this.removeSelectedProduct.bind(this);
    this.toggleModalVisible = this.toggleModalVisible.bind(this);
    this.navToOverview = this.navToOverview.bind(this);
  }

  componentWillMount() {
    this.props.navigation.setParams({ navToOverview: this.navToOverview });
  }

  render() {
    return (
      <View style={styles.container}>
        <GridView
          style={styles.productGrid}
          itemDimension={130}
          items={this.props.products}
          renderItem={product => {
            return (
              <ProductThumbnail
                product={product}
                quantity={this.props.order.orderlines[product._id]}
                onPress={() => this.onProductThumbnailPress(product._id)}
                onLongPress={() =>
                  this.onProductThumbnailLongPress(product._id)
                }
                isSelected={this.state.product === product}
              />
            );
          }}
          horizontal={true}
          spacing={10}
        />
        <Modal
          isVisible={this.state.modalIsVisible}
          animationIn={"slideInUp"}
          animationInTiming={200}
          animationOut={"slideOutDown"}
          animationOutTiming={200}
          backdropColor={colors.PRIMARY_COLOR}
          onBackButtonPress={() => this.toggleModalVisible()}
          onBackdropPress={() => this.toggleModalVisible()}
          onModalHide={() => this.removeSelectedProduct()}
          style={styles.quantityModal}
        >
          {this.renderModalContent()}
        </Modal>
      </View>
    );
  }

  navToOverview() {
    this.props.navigation.navigate("OverviewScreen");
  }

  //checks the product's stock and increments
  //product's orderline quantity by 1
  onProductThumbnailPress(productId: number) {
    let unitsInOrderline = this.props.order.orderlines[productId] || 0;
    let unitsInStock = this.props.products.find(p => p._id === productId)
      .inStock;
    if (unitsInOrderline < unitsInStock)
      this.props.incrementProductQuantity(productId);
    else Alert.alert("Onvoldoende stock");
  }

  //sets the local state to the product that's been long pressed
  //and the quantity to the amount of units in that product's orderline
  onProductThumbnailLongPress(productId: number) {
    let product = this.props.products.filter(p => p._id === productId)[0];
    this.setState({
      product: product,
      quantity: this.props.order.orderlines[productId]
        ? this.props.order.orderlines[productId]
        : 0
    });
    this.toggleModalVisible();
  }

  onModalTrashIconPress() {
    this.props.setProductQuantity(this.state.product._id, 0);
    this.toggleModalVisible();
  }

  removeSelectedProduct() {
    this.setState({
      product: null,
      quantity: 0
    });
  }

  toggleModalVisible() {
    this.setState({
      modalIsVisible: !this.state.modalIsVisible
    });
  }

  renderModalContent() {
    return (
      <View style={styles.quantityModalContent}>
        <View style={styles.row}>
          <Text style={styles.quantityInputTitle}>
            {this.state.product ? this.state.product.name : ""}:{" "}
            <Text style={styles.quantityValueLabel}>{this.state.quantity}</Text>
          </Text>
          {/* only show trash icon when product units added to order */}
          {this.state.quantity != 0 && (
            <TouchableHighlight
              onPress={() => this.onModalTrashIconPress()}
              underlayColor={colors.TITLE_COLOR}
            >
              <Icon name="delete" size={30} color={colors.SECONDARY_COLOR} />
            </TouchableHighlight>
          )}
        </View>
        <Slider
          value={this.state.quantity}
          onValueChange={value => this.setState({ quantity: value })}
          onSlidingComplete={value =>
            this.props.setProductQuantity(this.state.product._id, value)
          }
          minimumValue={0}
          maximumValue={this.state.product ? this.state.product.inStock : 0}
          step={1}
          trackStyle={styles.quantitySliderTrackStyle}
          thumbStyle={styles.quantitySliderThumbStyle}
          minimumTrackTintColor={colors.SECONDARY_COLOR}
          maximumTrackTintColor={colors.PRIMARY_COLOR}
        />
        <Button
          title="OK"
          color={colors.PRIMARY_COLOR}
          onPress={this.toggleModalVisible}
        />
      </View>
    );
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
