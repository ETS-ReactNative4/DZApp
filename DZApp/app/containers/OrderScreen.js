//@flow
import React, { Component } from "react";
import { Alert } from "react-native";

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
  Text,
  View,
  Right,
  Subtitle
} from "native-base";
import {
  Menu,
  MenuProvider,
  MenuOptions,
  MenuOption,
  MenuTrigger
} from "react-native-popup-menu";
import GridView from "react-native-super-grid";

//styles
import styles from "../styles/styles";

//resources
import * as strings from "../constants/strings";

//redux
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

//actions
import { setProductQuantity, resetOrder } from "../actions/orderActions";
import { sendError, sendMessage } from "../actions/messageActions";
import { logout } from "../actions/cashierActions";

//functions
import { showInfoToast, showErrorToast } from "../functions/toast";

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

    this._checkLoginState();
    this._checkEventState();
  }

  render() {
    return (
      <Container>
        <Header style={styles.primaryBackground}>
          <Left>
            <Thumbnail
              square
              small
              source={require("../assets/images/logo.gif")}
            />
          </Left>
          <Body>
            <Title>{strings.ORDER}</Title>
            <Subtitle>{strings.PRODUCT_INPUT}</Subtitle>
          </Body>
          <Right>
            <Button
              transparent
              onPress={() => {
                this.props.navigation.navigate("OverviewScreen");
              }}
            >
              <Icon name="cart" />
            </Button>
            <Button
              transparent
              onPress={() => {
                this.props.resetOrder();
              }}
            >
              <Icon name="trash" />
            </Button>
            {this._renderPopupMenu()}
          </Right>
        </Header>
        <Content
          contentContainerStyle={[styles.content, styles.alignCenter]}
          padder
        >
          {this._renderGrid()}
          <ProductQuantityModal
            ref="modal"
            onConfirmButtonPress={value =>
              this._onModalConfirmButtonPress(value)
            }
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
                this.props.navigation.navigate("TopupNavigator");
              }}
            >
              <Icon name="cash" />
              <Text style={styles.tabbarText}>{strings.TOPUP}</Text>
            </Button>
            <Button
              vertical
              onPress={() => {
                this.props.navigation.navigate("HistoryNavigator");
              }}
            >
              <Icon name="clock" />
              <Text style={styles.tabbarText}>{strings.HISTORY}</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }

  _renderGrid = () => {
    let orderlines = this.props.orderlines;
    let products = this.props.products;
    return (
      <GridView
        // style={styles.productGrid}
        itemDimension={150}
        items={products}
        renderItem={product => {
          let quantity = orderlines[product._id] || 0;
          return this._renderGridItem(product, quantity);
        }}
        horizontal={true}
        spacing={10}
      />
    );
  };

  _renderGridItem = (product, quantity) => {
    return (
      <ProductThumbnail
        product={product}
        quantity={quantity}
        onPress={() => this._onProductThumbnailPress(product._id)}
        onLongPress={() => this._onProductThumbnailLongPress(product._id)}
        onTrashButtonPress={() =>
          this._onProductThumbnailTrashButtonPress(product._id)
        }
      />
    );
  };

  _renderPopupMenu() {
    return (
      <Button transparent>
        <Menu>
          <MenuTrigger>
            <Icon name="menu" style={styles.popupMenuIcon} />
          </MenuTrigger>
          <MenuOptions>
            <MenuOption onSelect={() => this._onCloseoutMenuOptionPress()}>
              <Text style={styles.popupMenuText}>
                {strings.CLOSEOUT_SCREEN_TITLE}
              </Text>
            </MenuOption>
            <MenuOption onSelect={() => this._onServerConfigMenuOptionPress()}>
              <Text style={styles.popupMenuText}>{strings.SERVER_CONFIG}</Text>
            </MenuOption>
            <View style={styles.divider} />
            <MenuOption onSelect={() => this._onLogoutMenuOptionPress()}>
              <Text style={styles.popupMenuText}>
                {strings.LOGOOUT_ALERT_HEADER}
              </Text>
            </MenuOption>
          </MenuOptions>
        </Menu>
      </Button>
    );
  }

  componentDidUpdate() {
    if (this.props.message !== null) {
      showInfoToast(this.props.message);
    }
    if (this.props.error !== null) {
      showErrorToast(this.props.error);
    }
  }

  //navigate away from OrderScreen when no cashierId or eventId is set
  _checkLoginState = () => {
    if (!this.props.cashierId) this.props.navigation.navigate("AuthNavigator");
  };

  _checkEventState = () => {
    if (!this.props.eventId) this.props.navigation.navigate("EventScreen");
  };

  //increment the product's quantity in orderlines by 1
  _onProductThumbnailPress = (productId: String) => {
    //let inStock = this.props.products.find(p => p._id === productId).inStock;
    let inOrderline = this.props.orderlines[productId] || 0;

    //if (inStock > inOrderline)
    this.props.setProductQuantity(productId, ++inOrderline);
    //else this.props.sendError(strings.INSUFFICIENT_STOCK);
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

  _onModalConfirmButtonPress = (value: number) => {
    let modal = this.refs.modal;
    let product = modal.state.product;
    this.props.setProductQuantity(product._id, value);
    this._toggleModalVisible();
  };

  _onServerConfigMenuOptionPress = () => {
    this.props.navigation.navigate("ServerConfigScreen", {
      previousState: this.props.navigation.state
    });
  };

  _onCloseoutMenuOptionPress = () => {
    this.props.navigation.navigate("CloseoutScreen", {
      previousState: this.props.navigation.state
    });
  };

  _onLogoutMenuOptionPress = () => {
    Alert.alert(
      strings.LOGOOUT_ALERT_HEADER,
      strings.LOGOOUT_ALERT_MESSAGE,
      [
        { text: strings.CANCEL, onPress: () => {}, style: "cancel" },
        {
          text: strings.LOGOOUT_ALERT_HEADER,
          onPress: () => this._onAlertConfirmation()
        }
      ],
      { cancelable: false }
    );
  };

  _onAlertConfirmation = () => {
    this.props.logout();
    this.props.sendMessage(strings.LOGGED_OUT);
    this.props.navigation.navigate("AuthNavigator");
  };
}

const mapStateToProps = state => {
  return {
    products: state.ProductReducer.products,
    orderlines: state.OrderReducer.orderlines,
    cashierId: state.CashierReducer.cashierId,
    eventId: state.EventReducer.eventId,
    message: state.MessageReducer.message,
    error: state.MessageReducer.error
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      setProductQuantity,
      resetOrder,
      sendError,
      logout,
      sendMessage
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderScreen);
