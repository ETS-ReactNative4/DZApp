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
  View
} from "native-base";
import { OverviewSummaryCard } from "../components/OverviewSummaryCard";
import { Grid, Row, Col } from "react-native-easy-grid";

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
import { showInfoToast, showErrorToast } from "../functions/toast";

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
    this._onModalSlidingComplete = this._onModalSlidingComplete.bind(this);
    this._toggleModalVisible = this._toggleModalVisible.bind(this);
    this._onEditIconPress = this._onEditIconPress.bind(this);

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
              source={require("../assets/images/site_dz.jpg")}
            />
          </Left>
          <Body>
            <Title>{strings.OVERVIEW}</Title>
          </Body>
        </Header>
        <Content padder>
          {this._renderSummary()}
          {this.state.showList &&
            this.props.orderlines.length > 0 &&
            this._renderList()}
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

  _renderSummary = () => {
    let amount = this.props.totalAmountString;
    let cashierfullname =
      this.props.cashier.firstName + " " + this.props.cashier.lastName;
    let eventName = this.props.event.name;

    return (
      <Card>
        <CardItem header>
          <Text>{strings.OVERVIEW}</Text>
        </CardItem>
        <CardItem>
          <Body>
            <Grid>
              <Col style={{ width: 125, marginRight: 10 }}>
                <Row>
                  <Text style={styles.label}>{strings.TOTAL}</Text>
                </Row>
                <Row>
                  <Text style={styles.label}>{strings.EVENT}</Text>
                </Row>
                <Row>
                  <Text style={styles.label}>{strings.CASHIER}</Text>
                </Row>
              </Col>
              <Col>
                <Row>
                  <Text style={styles.value}>{amount}</Text>
                </Row>
                <Row>
                  <Text style={styles.value}>{eventName}</Text>
                </Row>
                <Row>
                  <Text style={styles.value}>{cashierfullname}</Text>
                </Row>
              </Col>
            </Grid>
          </Body>
        </CardItem>
        {this.props.orderlines.length > 0 && (
          <CardItem>
            <Body>
              <Button full style={styles.primaryActionButton}>
                <Text style={styles.primaryButtonText}>
                  {strings.CHOOSE_CUSTOMER}
                </Text>
              </Button>
            </Body>
          </CardItem>
        )}
        <CardItem footer>
          <Grid>
            <Col>
              <Button
                transparent
                full
                small
                onPress={() => {
                  this._onEventChangePress();
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
      </Card>
    );
  };

  _renderList = () => {
    return (
      <Card>
        <CardItem header>
          <Text>{strings.DETAILS}</Text>
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
    );
  };

  _renderListViewRow = (orderline: {}): {} => {
    let product = this.props.products.find(p => p._id === orderline.productId);
    let linePrice = orderline.quantity * product.price;
    let linePriceString = toStringWithDecimals(linePrice, 2) + " €";
    return (
      <ListItem>
        <Grid>
          <Row>
            <Col style={styles.justifyCenter} size={15}>
              <Thumbnail small source={{ uri: product.imageUrl }} />
            </Col>
            <Col style={styles.justifyCenter} size={45}>
              <Text style={styles.left}>{orderline.name}</Text>
            </Col>
            <Col style={styles.justifyCenter} size={15}>
              <Text>X {orderline.quantity}</Text>
            </Col>
            <Col style={styles.justifyCenter} size={25}>
              <Text style={[styles.secondary, styles.right]}>
                = {linePriceString}
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
    if (!this.props.cashierId) this.props.navigation.navigate("AuthNavigator");
  };

  _checkEventState = () => {
    if (!this.props.eventId) this.props.navigation.navigate("EventScreen");
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

  _onEventChangePress = (): void => {
    this.props.navigation.navigate("EventScreen", {
      previousState: this.props.navigation.state
    });
  };

  _onModalSlidingComplete = (value: number) => {
    let modal = this.refs.modal;
    let product = modal.state.product;
    this.props.setProductQuantity(product._id, value);
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
    ),
    message: state.MessageReducer.message,
    error: state.MessageReducer.error
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ setProductQuantity }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(OverviewScreen);
