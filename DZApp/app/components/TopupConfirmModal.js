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
  Item
} from "native-base";

//style
import styles from "../styles/styles";
import colors from "../styles/colors";

//resources
import * as strings from "../constants/strings";

type Props = {
  onConfirmButtonPress: () => void,
  amountString: number,
  fullname: String
};

type State = {
  isVisible: boolean
};

export class TopupConfirmModal extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
      amountString: null,
      fullName: null
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
    return (
      <View style={styles.topupConfirmModalContent}>
        <Card style={styles.content}>
          <CardItem header>
            <Text>
              {this.props.amountString +
                strings.TOPUP_FOR +
                this.props.fullname +
                "?"}
            </Text>
          </CardItem>

          <CardItem>
            <Body>
              <Button
                full
                style={styles.primaryActionButton}
                onPress={() => this.props.onConfirmButtonPress()}
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

  _toggleModalVisible = () => {
    this.setState({ isVisible: !this.state.isVisible });
  };
}
