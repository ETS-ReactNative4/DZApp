import React, { Component } from "react";

import { View, Text, Button, TouchableHighlight } from "react-native";
import Slider from "react-native-slider";
import Modal from "react-native-modal";
import Icon from "react-native-vector-icons/MaterialIcons";

//styles
import styles from "../styles/styles";
import colors from "../styles/colors";

type Props = {
  backdropColor: color,
  onBackButtonPress: () => void,
  onBackdropPress: () => void,
  toggleVisible: () => void,
  onModalHide: () => void,
  onTrashIconPress: () => void,
  onSliderValueChanged: number => void,
  onSlidingComplete: number => void
};
type State = {
  isVisible: boolean,
  product: {},
  quantity: number
};

export default class QuantityControlModal extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
      product: {},
      quantity: 0
    };
  }
  render() {
    return (
      <Modal
        isVisible={this.state.isVisible}
        animationIn={"slideInUp"}
        animationInTiming={200}
        animationOut={"slideOutDown"}
        animationOutTiming={200}
        backdropColor={this.props.backdropColor}
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
              style={[styles.iconContainerSmall, { alignSelf: "flex-end" }]}
              onPress={this._onTrashIconPress}
              underlayColor={colors.TITLE_COLOR}
            >
              <View style={styles.iconContainerSmall}>
                <Icon name="delete" size={30} color={colors.SECONDARY_COLOR} />
              </View>
            </TouchableHighlight>
          )}
        </View>
        <Slider
          value={this.state.quantity}
          onValueChange={value => this._onSliderValueChange(value)}
          onSlidingComplete={value => this.props.onSlidingComplete(value)}
          minimumValue={0}
          maximumValue={this.state.product ? this.state.product.inStock : 0}
          step={1}
          disabled={
            this.state.product ? this.state.product.inStock === 0 : true
          }
          trackStyle={styles.quantitySliderTrackStyle}
          thumbStyle={styles.quantitySliderThumbStyle}
          minimumTrackTintColor={colors.SECONDARY_COLOR}
          maximumTrackTintColor={colors.PRIMARY_COLOR}
        />
        <Button
          title="OK"
          color={colors.PRIMARY_COLOR}
          onPress={this._toggleModalVisible}
        />
      </View>
    );
  };

  _toggleModalVisible = () => {
    this.setState({ isVisible: !this.state.isVisible });
  };

  _onSliderValueChange = value => {
    this.setState({ quantity: value });
  };

  _onSlidingComplete = value => {
    this.props.onSlidingComplete(value);
  };

  _onTrashIconPress = () => {
    this.props.onTrashIconPress();
  };

  _onModalHide = () => {
    this.setState({
      product: 0,
      quantity: 0
    });
  };
}
