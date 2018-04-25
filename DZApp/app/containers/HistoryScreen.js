//@flow
import React, { Component } from "react";
import { ListView } from "react-native";

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
  Subtitle,
  Segment,
  List,
  ListItem,
  Card,
  CardItem
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
import { sendError } from "../actions/messageActions";
import { processRollback } from "../actions/rollbackActions";

//functions
import { showInfoToast, showErrorToast } from "../functions/toast";
import { getFullName, getCustomerById } from "../functions/customer";
import { calculateTotal } from "../functions/order";

//libs
import moment from "moment-timezone";
import { v4 as uuidv4 } from "uuid";

type Props = {};

type State = {
  ordersActive: boolean,
  orderData: {},
  topupDate: {}
};

class HistoryScreen extends Component<Props, State> {
  constructor(props) {
    super(props);

    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

    this.state = {
      ordersActive: true,
      orderData: this.ds.cloneWithRows(props.orderHistory),
      topupData: this.ds.cloneWithRows(props.topupHistory)
    };

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
            <Title>{strings.HISTORY}</Title>
            <Subtitle>{strings.OVERVIEW}</Subtitle>
          </Body>
          <Right>
            <Button transparent>
              <Icon name="settings" />
            </Button>
            <Button transparent>
              <Icon name="menu" />
            </Button>
          </Right>
        </Header>
        {this._renderSegment()}
        <Content padder contentContainerStyle={styles.scrollviewCenter}>
          <Card>{this._renderList()}</Card>
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
              <Text style={[styles.tabbarText]}>{strings.ORDER}</Text>
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
            <Button vertical style={styles.secondaryBackground}>
              <Icon name="clock" style={styles.white} />
              <Text style={[styles.tabbarText, styles.white]}>
                {strings.HISTORY}
              </Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }

  _renderSegment = () => {
    let ordersActive = this.state.ordersActive;

    return (
      <Segment style={styles.segment}>
        <Button
          first
          active={ordersActive}
          style={
            ordersActive ? styles.segmentButtonActive : styles.segmentButton
          }
          onPress={() => this._onSegmentButtonPress(true)}
        >
          <Text
            style={
              ordersActive
                ? styles.segmentButtonTextActive
                : styles.segmentButtonText
            }
          >
            {strings.ORDERS}
          </Text>
        </Button>
        <Button
          first
          active={!ordersActive}
          style={
            !ordersActive ? styles.segmentButtonActive : styles.segmentButton
          }
          onPress={() => this._onSegmentButtonPress(false)}
        >
          <Text
            style={
              !ordersActive
                ? styles.segmentButtonTextActive
                : styles.segmentButtonText
            }
          >
            {strings.TOPUPS}
          </Text>
        </Button>
      </Segment>
    );
  };

  _renderList = () => {
    let ordersActive = this.state.ordersActive;
    let list = ordersActive ? this.props.orderHistory : this.props.topupHistory;

    return (
      <View>
        <CardItem header>
          <Text>{ordersActive ? strings.ORDERS : strings.TOPUPS}</Text>
        </CardItem>
        <CardItem>
          <List
            // dataSource={
            //   ordersActive ? this.state.orderData : this.state.topupData
            // }
            //dataArray={list}
            dataSource={this.ds.cloneWithRows(list)}
            renderRow={item => this._renderRow(item)}
            renderRightHiddenRow={(item, secId, rowId, rowMap) => {
              return this._renderRightHiddenRow(item, secId, rowId, rowMap);
            }}
            rightOpenValue={-75}
          />
        </CardItem>
      </View>
    );
  };

  _renderRow(item) {
    let ordersActive = this.state.ordersActive;
    let timeString = moment(item.timestamp)
      .tz("Europe/Berlin")
      .format("DD/MM/YYYY\t\tHH:mm:ss");
    let customerName = getFullName(
      getCustomerById(item.customerId, this.props.customers)
    );
    //only for orders
    let eventName = "";
    if (ordersActive) {
      eventName = this.props.events.find(e => e._id === item.eventId).name;
    }
    //amount
    let amountString;
    if (ordersActive) {
      amountString =
        calculateTotal(item.orderlines, this.props.products).toFixed(2) + " €";
    } else {
      amountString = item.amount.toFixed(2) + " €";
    }

    return (
      <ListItem>
        <Grid>
          <Row>
            <Text
              style={[styles.left, { fontWeight: "bold" }]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {timeString}
            </Text>
          </Row>
          {ordersActive && (
            <Row>
              <Text style={styles.left} numberOfLines={1} ellipsizeMode="tail">
                {eventName}
              </Text>
            </Row>
          )}
          <Row>
            <Col style={styles.justifyCenter} size={50}>
              <Text style={styles.left} numberOfLines={1} ellipsizeMode="tail">
                {customerName}
              </Text>
            </Col>
            <Col style={styles.justifyCenter} size={50}>
              <Text style={[styles.secondary, styles.right]}>
                {amountString}
              </Text>
            </Col>
          </Row>
        </Grid>
      </ListItem>
    );
  }

  _renderRightHiddenRow = (item, secId, rowId, rowMap): {} => {
    return (
      <Button
        transparent
        onPress={() =>
          this._onRollBackIconPress(item.localId, secId, rowId, rowMap)
        }
      >
        <Icon name="undo" style={styles.secondary} />
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

  //navigate away from OrderScreen when no cashierId or eventId is set
  _checkLoginState = () => {
    if (!this.props.cashierId) this.props.navigation.navigate("AuthNavigator");
  };

  _checkEventState = () => {
    if (!this.props.eventId) this.props.navigation.navigate("EventScreen");
  };

  _onSegmentButtonPress = ordersActive => {
    this.setState({ ordersActive: ordersActive });
  };

  _onRollBackIconPress(itemId, secId, rowId, rowMap) {
    rowMap[`${secId}${rowId}`].props.closeRow();

    let rollback = {
      localId: uuidv4(),
      orderId: this.state.ordersActive ? itemId : null,
      topupId: !this.state.ordersActive ? itemId : null,
      cashierId: this.props.cashierId,
      timestamp: moment().valueOf()
    };

    this.props.processRollback(rollback);
  }
}

const mapStateToProps = state => {
  return {
    orderHistory: state.OrderReducer.history,
    topupHistory: state.TopupReducer.history,
    customers: state.CustomerReducer.customers,
    events: state.EventReducer.events,
    products: state.ProductReducer.products,
    cashierId: state.CashierReducer.cashierId,
    eventId: state.EventReducer.eventId,
    message: state.MessageReducer.message,
    error: state.MessageReducer.error
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ processRollback }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(HistoryScreen);
