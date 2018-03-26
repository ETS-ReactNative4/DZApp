import React, { Component } from "react";
import {
  Card,
  CardItem,
  Body,
  Form,
  Item,
  Input,
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
import { to_NL_be_DateString } from "../functions/date";
import { toStringWithDecimals } from "../functions/number";

export const EventCard = ({ event, onPress }) => {
  return (
    <View style={styles.eventCardHolder}>
      <Card>
        <CardItem header>
          <Text>{event.name}</Text>
        </CardItem>
        <CardItem>
          <Content>
            <Grid>
              <Col>
                <Row>
                  <Label>{strings.FROM}</Label>
                </Row>
                <Row>
                  <Label>{strings.TO}</Label>
                </Row>
                <Row>
                  <Label>{strings.SUBSCRIPTIONFEE}</Label>
                </Row>
              </Col>
              <Col>
                <Row>
                  <Text>{to_NL_be_DateString(new Date(event.fromDate))}</Text>
                </Row>
                <Row>
                  <Text>{to_NL_be_DateString(new Date(event.toDate))}</Text>
                </Row>
                <Row>
                  <Text>
                    {event.subscriptionFee
                      ? toStringWithDecimals(event.subscriptionFee, 2) + " €"
                      : "0.00 €"}
                  </Text>
                </Row>
              </Col>
            </Grid>
          </Content>
        </CardItem>
        <CardItem>
          <Button
            primary
            block
            onPress={() => onPress()}
            style={[styles.primaryBackground, styles.center, { width: "100%" }]}
          >
            <Text>{strings.PICK_EVENT}</Text>
          </Button>
        </CardItem>
      </Card>
    </View>
  );
};
