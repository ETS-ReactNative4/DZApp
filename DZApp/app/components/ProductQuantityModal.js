//@flow
import React, { Component } from "react";

//components
import Slider from "react-native-slider";
import Modal from "react-native-modal";
import {
  Text,
  Card,
  CardItem,
  Body,
  Right,
  Header,
  Button,
  Form,
  View
} from "native-base";

//style
import styles from "../styles/styles";
import colors from "../styles/colors";

//resources
import * as strings from "../constants/strings";

type Props = {
  onModalHide: () => void,
  onSlidingComplete: number => void
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
      product: {}
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
        onModalHide={this.props.onModalHide}
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
          <CardItem header>
            <Body>
              <View style={styles.row}>
                <Text>{product.name || ""} X </Text>
                <Text style={[styles.primary, styles.end]}> {quantity}</Text>
              </View>
              <Slider
                value={quantity}
                onValueChange={value => this._onSliderValueChange(value)}
                onSlidingComplete={value => this.props.onSlidingComplete(value)}
                minimumValue={0}
                maximumValue={product.inStock ? product.inStock : 0}
                step={1}
                style={styles.quantitySliderStyle}
                trackStyle={styles.quantitySliderTrackStyle}
                disabled={product.inStock ? product.inStock === 0 : true}
                thumbStyle={styles.quantitySliderThumbStyle}
                minimumTrackTintColor={colors.SECONDARY_COLOR}
                maximumTrackTintColor={colors.PRIMARY_COLOR}
              />
              <Button
                primary
                block
                onPress={() => this._toggleModalVisible()}
                style={styles.primaryBackground}
              >
                <Text>{strings.OK}</Text>
              </Button>
            </Body>
          </CardItem>
        </Card>
      </View>
    );
  };

  _onSliderValueChange = (value: number) => {
    this.setState({
      quantity: value
    });
  };

  _onSlidingComplete = (value: number) => {
    this.props.onSlidingComplete(value);
  };

  _toggleModalVisible = () => {
    this.setState({ isVisible: !this.state.isVisible });
  };
}
