//@flow
import React, { Component } from "react";

//components
import { ProductThumbnail } from "../components/ProductThumbnail";
import { ProductQuantityModal } from "../components/ProductQuantityModal";
import {
  Container,
  Header,
  Left,
  Body,
  Title,
  Content,
  Thumbnail,
  Toast,
  Footer,
  FooterTab,
  Button,
  Icon,
  Text
} from "native-base";
import GridView from "react-native-super-grid";

//styles
import styles from "../styles/styles";

//resources
import * as strings from "../constants/strings";

//redux
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { setProductQuantity } from "../actions/orderActions";

type Props = {};

type State = {};

class OrderScreen extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {};
    this._onProductThumbnailPress = this._onProductThumbnailPress.bind(this);
    this._onProductThumbnailLongPress = this._onProductThumbnailLongPress.bind(
      this
    );
    this._onProductThumbnailTrashButtonPress = this._onProductThumbnailTrashButtonPress.bind(
      this
    );
    this._onModalSlidingComplete = this._onModalSlidingComplete.bind(this);
  }

  render() {
    let orderlines = this.props.orderlines;

    return (
      <Container>
        <Header style={styles.primaryBackground}>
          <Left>
            <Thumbnail
              square
              source={require("../assets/images/site_dz.jpg")}
            />
          </Left>
          <Body>
            <Title>{strings.ORDER}</Title>
          </Body>
        </Header>
        <Content contentContainerStyle={styles.content} padder>
          <GridView
            // style={styles.productGrid}
            itemDimension={130}
            items={this.props.products}
            renderItem={p => {
              let quantity = orderlines[p._id] || 0;
              return (
                <ProductThumbnail
                  product={p}
                  quantity={quantity}
                  onPress={() => this._onProductThumbnailPress(p._id)}
                  onLongPress={() => this._onProductThumbnailLongPress(p._id)}
                  onTrashButtonPress={() =>
                    this._onProductThumbnailTrashButtonPress(p._id)
                  }
                />
              );
            }}
            horizontal={true}
            spacing={10}
          />
          <ProductQuantityModal
            ref="modal"
            onSlidingComplete={this._onModalSlidingComplete}
          />
        </Content>
        <Footer>
          <FooterTab style={styles.primaryBackground}>
            <Button vertical style={styles.secondaryBackground}>
              <Icon name="grid" style={styles.white} />
              <Text style={[styles.tabbarText, styles.white]}>
                {strings.ORDER}
              </Text>
            </Button>
            <Button
              vertical
              onPress={() => {
                this.props.navigation.navigate("OverviewScreen");
              }}
            >
              <Icon name="list" />
              <Text style={styles.tabbarText}>{strings.OVERVIEW}</Text>
            </Button>
            <Button
              vertical
              onPress={() => {
                this.props.navigation.navigate("TopupNavigator");
              }}
            >
              <Icon name="cash" />
              <Text style={styles.tabbarText}>{strings.TOPUP}</Text>
            </Button>
            <Button vertical>
              <Icon name="clock" />
              <Text style={styles.tabbarText}>{strings.HISTORY}</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }

  //navigate away from OrderScreen when no cashierId or eventId is set
  componentDidUpdate() {
    if (!this.props.cashierId) this.props.navigation.navigate("LoginScreen");
    else if (!this.props.eventId) this.props.navigation.navigate("EventScreen");
  }

  //increment the product's quantity in orderlines by 1
  //if stock allows it
  _onProductThumbnailPress = (productId: String) => {
    let inStock = this.props.products.find(p => p._id === productId).inStock;
    let inOrderline = this.props.orderlines[productId] || 0;

    if (inStock > inOrderline)
      this.props.setProductQuantity(productId, ++inOrderline);
    else
      Toast.show({
        text: strings.INSUFFICIENT_STOCK,
        type: "danger",
        duration: 2000
      });
  };

  _onProductThumbnailLongPress = (productId: String) => {
    let product = this.props.products.find(p => p._id === productId);
    let modal = this.refs.modal;
    modal.setState({
      product: product,
      quantity: this.props.orderlines[productId]
        ? this.props.orderlines[productId]
        : 0
    });
    this._toggleModalVisible();
  };

  _onProductThumbnailTrashButtonPress = (productId: String) => {
    this.props.setProductQuantity(productId, 0);
  };

  _toggleModalVisible = () => {
    let modal = this.refs.modal;
    modal.setState({ isVisible: !modal.state.isVisible });
  };

  _onModalSlidingComplete = (value: number) => {
    let modal = this.refs.modal;
    let product = modal.state.product;
    this.props.setProductQuantity(product._id, value);
  };
}

const mapStateToProps = state => {
  return {
    products: state.ProductReducer.products,
    orderlines: state.OrderReducer.orderlines,
    cashierId: state.CashierReducer.cashierId,
    eventId: state.EventReducer.eventId
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ setProductQuantity }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderScreen);
