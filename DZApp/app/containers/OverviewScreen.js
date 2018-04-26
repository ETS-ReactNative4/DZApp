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
  Right,
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
  H2,
  H3,
  Card,
  CardItem,
  View,
  Subtitle
} from "native-base";
import { Grid, Row, Col } from "react-native-easy-grid";

//styles
import styles from "../styles/styles";

//resources
import * as strings from "../constants/strings";

//redux
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

//actions
import { setProductQuantity } from "../actions/orderActions";

//functions
import { calculateSubTotal, calculateTotal } from "../functions/order";
import { showInfoToast, showErrorToast } from "../functions/toast";
import { getFullName } from "../functions/customer";

type Props = {};

type State = {
  showList: boolean
};

class OverviewScreen extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      showList: false
    };

    this._onTrashIconPress = this._onTrashIconPress.bind(this);
    this._toggleModalVisible = this._toggleModalVisible.bind(this);
    this._onEditIconPress = this._onEditIconPress.bind(this);

    this._checkLoginState();
    this._checkEventState();
  }

  render() {
    return (
      <Container>
        {/* HEADER */}
        <Header style={styles.primaryBackground}>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>{strings.ORDER}</Title>
            <Subtitle>{strings.OVERVIEW}</Subtitle>
          </Body>
          <Right>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name="grid" />
            </Button>
          </Right>
        </Header>
        {/* HEADER END */}
        {/* CONTENT */}
        <Content padder contentContainerStyle={styles.scrollviewCenter}>
          <Card>
            {this._renderSummary()}
            {this.state.showList &&
              this.props.orderlines.length > 0 &&
              this._renderList()}
            <ProductQuantityModal
              ref="modal"
              onConfirmButtonPress={this._onModalConfirmButtonPress}
            />
          </Card>
        </Content>
        {/* CONTENT END */}
      </Container>
    );
  }

  _renderSummary = () => {
    let amount = this.props.totalAmountString;
    let cashierfullname = getFullName(this.props.cashier);
    let eventName = this.props.event.name;

    return (
      <View>
        <CardItem header>
          <Text>{strings.OVERVIEW}</Text>
        </CardItem>
        <CardItem>
          <Body>
            <Grid>
              <Row>
                <Text style={styles.label}>{strings.EVENT}</Text>
              </Row>
              <Row style={styles.valueRow}>
                <Text style={styles.value}>{eventName}</Text>
              </Row>
              <Row>
                <Text style={styles.label}>{strings.CASHIER}</Text>
              </Row>
              <Row style={styles.valueRow}>
                <Text style={styles.value}>{cashierfullname}</Text>
              </Row>
              <Row>
                <Text style={styles.label}>{strings.TOTAL}</Text>
              </Row>
              <Row style={styles.valueRow}>
                <Text style={styles.value}>{amount}</Text>
              </Row>
            </Grid>
          </Body>
        </CardItem>
        {this.props.orderlines.length > 0 && (
          <CardItem>
            <Body>
              <Button
                full
                style={styles.primaryActionButton}
                onPress={() => this._onChooseCustomerButtonPress()}
              >
                <Text style={styles.primaryButtonText}>
                  {strings.CHOOSE_CUSTOMER}
                </Text>
              </Button>
            </Body>
          </CardItem>
        )}
        <CardItem footer bordered>
          <Grid>
            <Col>
              <Button
                transparent
                full
                small
                onPress={() => {
                  this._onChangeEventButtonPress();
                }}
              >
                <Text style={styles.smallButtonText}>
                  {strings.CHANGE_EVENT}
                </Text>
              </Button>
            </Col>
            <Col>
              {this.props.orderlines.length > 0 && this._renderListButton()}
            </Col>
          </Grid>
        </CardItem>
      </View>
    );
  };

  _renderList = () => {
    return (
      <View>
        <CardItem header>
          <Text>{strings.DETAILS}</Text>
        </CardItem>
        <CardItem bordered>
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
      </View>
    );
  };

  _renderListViewRow = (orderline: {}): {} => {
    let product = this.props.products.find(p => p._id === orderline.productId);
    let linePrice = calculateSubTotal(orderline, product);
    let linePriceString = linePrice.toFixed(2) + " €";
    return (
      <ListItem>
        <Grid>
          <Row>
            <Col style={styles.justifyCenter} size={20}>
              <Thumbnail small source={{ uri: product.imageUrl }} />
            </Col>
            <Col style={styles.justifyCenter} size={30}>
              <Text style={styles.left} numberOfLines={1} ellipsizeMode="tail">
                {orderline.name}
              </Text>
            </Col>
            <Col style={styles.justifyCenter} size={15}>
              <Text style={styles.right} numberOfLines={1} ellipsizeMode="tail">
                {orderline.quantity}
              </Text>
            </Col>
            <Col style={styles.justifyCenter} size={35}>
              <Text style={[styles.secondary, styles.right]}>
                {linePriceString}
              </Text>
            </Col>
          </Row>
        </Grid>
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

  _renderListButton = () => {
    let text = this.state.showList ? strings.HIDE_LIST : strings.SHOW_LIST;

    return (
      <Button transparent small full onPress={() => this._toggleListVisible()}>
        <Text style={styles.smallButtonText}>{text}</Text>
      </Button>
    );
  };

  componentDidUpdate() {
    if (this.props.message !== null) {
      showInfoToast(this.props.message);
    }
    if (this.props.error !== null) {
      showErrorToast(this.props.error);
    }
  }

  _checkLoginState = () => {
    if (!this.props.cashier._id)
      this.props.navigation.navigate("AuthNavigator");
  };

  _checkEventState = () => {
    if (!this.props.event._id) this.props.navigation.navigate("EventScreen");
  };

  _toggleModalVisible = (): void => {
    let modal = this.refs.modal;
    modal.setState({
      isVisible: !modal.state.isVisible
    });
  };

  _toggleListVisible = (): void => {
    this.setState({ showList: !this.state.showList });
  };

  _onChangeEventButtonPress = (): void => {
    this.props.navigation.navigate("EventScreen", {
      previousState: this.props.navigation.state
    });
  };

  _onModalConfirmButtonPress = (value: number) => {
    let modal = this.refs.modal;
    let product = modal.state.product;
    this.props.setProductQuantity(product._id, value);
    this._toggleModalVisible();
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

  _onChooseCustomerButtonPress = () => {
    this.props.navigation.navigate("OrderCustomerScreen");
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
  let products = state.ProductReducer.products;

  orderlines = orderlines.filter(o => o.quantity !== 0);
  let totalAmount = calculateTotal(orderlines, products);
  let totalAmountString = totalAmount.toFixed(2) + " €";

  return {
    products: products,
    orderlines: orderlines,
    totalAmountString: totalAmountString,
    cashier: state.CustomerReducer.customers.find(
      c => c._id === state.CashierReducer.cashierId
    ),
    event: state.EventReducer.events.find(
      e => e._id === state.EventReducer.eventId
    ),
    message: state.MessageReducer.message,
    error: state.MessageReducer.error
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ setProductQuantity }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(OverviewScreen);
