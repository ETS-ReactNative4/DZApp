//@flow
import React, { Component } from "react";

//components
import { ProductQuantityModal } from "../components/ProductQuantityModal";
import { ListView } from "react-native";
import {
  Container,
  Header,
  Left,
  Body,
  Title,
  Content,
  Thumbnail,
  Footer,
  FooterTab,
  Button,
  Icon,
  Text,
  List,
  ListItem,
  H3,
  Card,
  CardItem
} from "native-base";
import { OverviewSummaryCard } from "../components/OverviewSummaryCard";

//styles
import styles from "../styles/styles";

//resources
import * as strings from "../constants/strings";

//redux
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { setProductQuantity } from "../actions/orderActions";

//functions
import { toStringWithDecimals } from "../functions/number";

type Props = {};

type State = {};

class OverviewScreen extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {};

    this._onTrashIconPress = this._onTrashIconPress.bind(this);
    this._onModalSlidingComplete = this._onModalSlidingComplete.bind(this);
    this._toggleModalVisible = this._toggleModalVisible.bind(this);
    this._onEditIconPress = this._onEditIconPress.bind(this);
  }

  render() {
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
            <Title>{strings.OVERVIEW}</Title>
          </Body>
        </Header>
        <Content padder>
          <OverviewSummaryCard
            cashierName={`${this.props.cashier.firstName} ${
              this.props.cashier.lastName
            }`}
            eventName={this.props.event.name}
            totalAmountString={this.props.totalAmountString}
          />
          <Card>
            <CardItem header>
              <H3 style={styles.primary}>{strings.DETAILS}</H3>
            </CardItem>
            <CardItem>
              <List
                dataSource={this.ds.cloneWithRows(this.props.orderlines)}
                renderRow={orderline => {
                  return this._renderListViewRow(orderline);
                }}
                renderLeftHiddenRow={orderline => {
                  return this._renderLeftHiddenRow(orderline);
                }}
                renderRightHiddenRow={(orderline, secId, rowId, rowMap) => {
                  return this._renderRightHiddenRow(
                    orderline,
                    secId,
                    rowId,
                    rowMap
                  );
                }}
                leftOpenValue={75}
                rightOpenValue={-75}
              />
            </CardItem>
          </Card>
          <ProductQuantityModal
            ref="modal"
            onSlidingComplete={this._onModalSlidingComplete}
          />
        </Content>
        <Footer>
          <FooterTab style={styles.primaryBackground}>
            <Button
              vertical
              onPress={() => {
                this.props.navigation.navigate("OrderScreen");
              }}
            >
              <Icon name="grid" />
              <Text style={styles.tabbarText}>{strings.ORDER}</Text>
            </Button>
            <Button vertical style={styles.secondaryBackground}>
              <Icon name="list" style={styles.white} />
              <Text style={[styles.tabbarText, styles.white]}>
                {strings.OVERVIEW}
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
            <Button vertical>
              <Icon name="clock" />
              <Text style={styles.tabbarText}>{strings.HISTORY}</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }

  //navigate away from OverviewScreen when no cashierId or eventId is set
  componentDidUpdate() {
    if (!this.props.cashierId) this.props.navigation.navigate("LoginScreen");
    else if (!this.props.eventId) this.props.navigation.navigate("EventScreen");
  }

  _toggleModalVisible = (): void => {
    let modal = this.refs.modal;
    modal.setState({
      isVisible: !modal.state.isVisible
    });
  };

  _onModalSlidingComplete = (value: number) => {
    let modal = this.refs.modal;
    let product = modal.state.product;
    this.props.setProductQuantity(product._id, value);
  };

  _renderListViewRow = (orderline: {}): {} => {
    let product = this.props.products.find(p => p._id === orderline.productId);
    let linePrice = orderline.quantity * product.price;
    let linePriceString = toStringWithDecimals(linePrice, 2) + " €";
    return (
      <ListItem style={styles.row}>
        <Thumbnail
          small
          source={{ uri: product.imageUrl }}
          style={styles.overviewListThumbnail}
        />
        <Text style={styles.overviewListName}>{orderline.name}</Text>
        <Text style={[styles.overviewListQuantity, styles.rightText]}>
          X {orderline.quantity}
        </Text>
        <Text
          style={[styles.overviewListPrice, styles.rightText, styles.primary]}
        >
          = {linePriceString}
        </Text>
      </ListItem>
    );
  };

  _renderLeftHiddenRow = (orderline: {}): {} => {
    return (
      <Button transparent onPress={() => this._onEditIconPress(orderline)}>
        <Icon name="create" style={styles.secondary} />
      </Button>
    );
  };

  _renderRightHiddenRow = (orderline, secId, rowId, rowMap): {} => {
    return (
      <Button
        transparent
        onPress={() =>
          this._onTrashIconPress(orderline.productId, secId, rowId, rowMap)
        }
      >
        <Icon name="trash" style={styles.secondary} />
      </Button>
    );
  };

  _onEditIconPress = (orderline: {}): {} => {
    let product = this.props.products.find(p => p._id === orderline.productId);
    let quantity = orderline.quantity;
    let modal = this.refs.modal;

    modal.setState({
      product: product,
      quantity: quantity
    });
    this._toggleModalVisible();
  };

  _onTrashIconPress = (productId: String, secId, rowId, rowMap) => {
    rowMap[`${secId}${rowId}`].props.closeRow();
    this.props.setProductQuantity(productId, 0);
  };
}

const mapStateToProps = state => {
  let orderlines = Object.keys(state.OrderReducer.orderlines).map(key => {
    return {
      productId: key,
      name: state.ProductReducer.products.find(p => p._id === key).name,
      quantity: state.OrderReducer.orderlines[key]
    };
  });

  orderlines = orderlines.filter(o => o.quantity !== 0);

  let totalAmount = 0.0;
  orderlines.forEach(o => {
    totalAmount +=
      o.quantity *
      state.ProductReducer.products.find(p => p._id === o.productId).price;
  });
  let totalAmountString = toStringWithDecimals(totalAmount, 2) + " €";

  return {
    products: state.ProductReducer.products,
    orderlines: orderlines,
    totalAmountString: totalAmountString,
    cashierId: state.CashierReducer.cashierId,
    eventId: state.EventReducer.eventId,
    cashier: state.CustomerReducer.customers.find(
      c => c._id === state.CashierReducer.cashierId
    ),
    event: state.EventReducer.events.find(
      e => e._id === state.EventReducer.eventId
    )
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ setProductQuantity }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(OverviewScreen);
