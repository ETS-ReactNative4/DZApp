//@flow
import React, { Component } from "react";

//components
import Modal from "react-native-modal";
import {
  Text,
  Card,
  CardItem,
  Body,
  Right,
  Header,
  Button,
  View,
  Item,
  Input,
  Label,
  Form
} from "native-base";

//style
import styles from "../styles/styles";
import colors from "../styles/colors";

//resources
import * as strings from "../constants/strings";

//functions
import { validateIntegerGreaterThan } from "../functions/validation";

type Props = {
  onConfirmButtonPress: number => void
};

type State = {
  isVisible: boolean,
  quantity: number
};

export class ProductQuantityModal extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
      quantity: 0,
      product: {},
      error: null
    };
  }

  render() {
    return (
      <Modal
        isVisible={this.state.isVisible}
        backdropColor={colors.PRIMARY_COLOR}
        animationIn={"slideInUp"}
        animationInTiming={200}
        animationOut={"slideOutDown"}
        animationOutTiming={200}
        onBackButtonPress={this._toggleModalVisible}
        onBackdropPress={this._toggleModalVisible}
        style={styles.quantityModal}
      >
        {this._renderModalContent()}
      </Modal>
    );
  }

  _renderModalContent = () => {
    let product = this.state.product;
    let quantity = this.state.quantity;
    return (
      <View style={styles.quantityModalContent}>
        <Card style={styles.content}>
          <CardItem>
            <Text style={{ fontWeight: "bold" }}>
              {strings.ENTER_QUANTITY} {product.name} ({strings.IN_STOCK}{" "}
              {product.inStock})
            </Text>
          </CardItem>
          <Form style={styles.cardForm}>
            {this.state.error ? (
              <Item floatingLabel error last>
                <Label>{strings.QUANTITY}</Label>
                <Input
                  onChangeText={value => this._onChangeText(value)}
                  value={quantity.toString()}
                />
              </Item>
            ) : (
              <Item floatingLabel last>
                <Label>{strings.QUANTITY}</Label>
                <Input
                  onChangeText={value => this._onChangeText(value)}
                  value={quantity.toString()}
                />
              </Item>
            )}
          </Form>
          {this.state.error && (
            <CardItem>
              <Text style={styles.error}>{this.state.error}</Text>
            </CardItem>
          )}
          <CardItem>
            <Body>
              <Button
                full
                style={
                  this.state.error === null
                    ? styles.primaryActionButton
                    : styles.primaryActionButtonDisabled
                }
                onPress={() =>
                  this.props.onConfirmButtonPress(this.state.quantity)
                }
                disabled={this.state.error !== null}
              >
                <Text style={styles.primaryButtonText}>{strings.OK}</Text>
              </Button>
            </Body>
          </CardItem>
          <CardItem footer>
            <Button
              transparent
              full
              small
              onPress={() => {
                this._toggleModalVisible();
              }}
            >
              <Text style={styles.smallButtonText}>{strings.CANCEL}</Text>
            </Button>
          </CardItem>
        </Card>
      </View>
    );
  };

  _onChangeText = value => {
    value = value.replace(/\s+/g, "");
    let product = this.state.product;
    let valid = validateIntegerGreaterThan(value, 0);
    if (valid) {
      this.setState({ error: null, quantity: value });
    } else {
      this.setState({
        error: `${strings.INVALID_QUANTITY} (>= 0)`,
        quantity: value
      });
    }
  };

  _toggleModalVisible = () => {
    this.setState({ isVisible: !this.state.isVisible });
  };
}
