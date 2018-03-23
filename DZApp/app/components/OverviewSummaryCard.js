import React, { Component } from "react";
import {
  Card,
  CardItem,
  Body,
  Item,
  Label,
  Text,
  View,
  Content,
  Button
} from "native-base";

import { Grid, Row, Col } from "react-native-easy-grid";

//style
import styles from "../styles/styles";
import colors from "../styles/colors";

//resources
import * as strings from "../constants/strings";

//functions
import { toStringWithDecimals } from "../functions/number";

export const OverviewSummaryCard = ({
  cashierName,
  eventName,
  totalAmountString,
  onPress
}) => {
  return (
    <View style={styles.overviewSummary}>
      {/* <Card>
        <CardItem> */}
      <Content>
        <Grid>
          <Col>
            <Row>
              <Label>{strings.TOTAL}</Label>
            </Row>
            <Row>
              <Label>{strings.EVENT}</Label>
            </Row>
            <Row>
              <Label>{strings.CASHIER}</Label>
            </Row>
          </Col>
          <Col>
            <Row>
              <Text style={[styles.rightText, styles.primary]}>
                {totalAmountString}
              </Text>
            </Row>
            <Row>
              <Text>{eventName}</Text>
            </Row>
            <Row>
              <Text>{cashierName}</Text>
            </Row>
          </Col>
        </Grid>
        <Button
          primary
          block
          onPress={onPress}
          style={[styles.primaryBackground, styles.overviewSummaryButton]}
        >
          <Text>{strings.CHOOSE_CUSTOMER}</Text>
        </Button>
      </Content>
      {/* </CardItem>
      </Card> */}
    </View>
  );
};
