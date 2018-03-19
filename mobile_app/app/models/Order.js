//@flow
import OrderLine from "./OrderLine";
import IllegalAmountError from "./errors/IllegalAmountError";

export default class Order {
  _id: ?number;
  _cashierId: number;
  _eventId: number;
  _memberId: ?number;
  _timestamp: ?Date;
  _amountPayedFromCredit: ?number;
  _amountPayedFromSubscriptionFee: ?number;
  _orderLines: Map<number, OrderLine>;

  constructor(id: number, cashierId: number, eventId: number) {
    this._id = null;
    this._cashierId = cashierId;
    this._eventId = eventId;
    this._memberId = null;
    this._timestamp = null;
    this._amountPayedFromCredit = 0.0;
    this._amountPayedFromSubscriptionFee = 0.0;
    this._orderLines = new Map();
  }

  get id(): ?number {
    return this._id;
  }
  get cashierId(): number {
    return this._cashierId;
  }
  get eventId(): number {
    return this._eventId;
  }
  get memberId(): ?number {
    return this._memberId;
  }
  get timestamp(): ?Date {
    return this._timestamp;
  }
  get amountPayedFromCredit(): ?number {
    return this._amountPayedFromCredit;
  }
  get amountPayedFromSubscriptionFee(): ?number {
    return this._amountPayedFromSubscriptionFee;
  }

  set id(id: number): void {
    this._id = id;
  }
  set cashierId(cashierId: number): void {
    this._cashierId = cashierId;
  }
  set eventId(eventId: number): void {
    this._eventId = eventId;
  }
  set memberId(memberId: number): void {
    this._memberId = memberId;
  }
  set(timestamp: Date): void {
    this._timestamp = timestamp;
  }
  set(amountPayedFromCredit: number): void {
    this._amountPayedFromCredit = amountPayedFromCredit;
  }
  set(amountPayedFromSubscriptionFee: number): void {
    this._amountPayedFromSubscriptionFee = amountPayedFromSubscriptionFee;
  }

  addUnit(productId: number) {
    if (!this._orderLines.get(productId)) this._addNewOrderline(productId);
    this._orderLines.get(productId).addUnit();
  }
  addUnits(productId: number, quantity: number) {
    if (!this._orderLines.get(productId)) this._addNewOrderline(productId);
    this._orderLines.get(productId).addUnits(quantity);
  }
  removeUnit(productId: number) {
    if (this._orderLines.get(productId))
      this._orderLines.get(productId).removeUnit();
    else
      throw new IllegalAmountError(
        "No orderline for this productid present in order"
      );
  }
  setQuantity(productId: number, quantity: number) {
    if (this.orderLines.get(productId))
      this.orderLines.get(productId).quantity = quantity;
    else {
      this._addNewOrderline(productId);
      this.orderLines.get(productId).quantity = quantity;
    }
  }
  getQuantity(productId: number): number {
    if (!this.orderLines.get(productId)) this._addNewOrderline(productId);
    return this.orderLines.get(productId).quantity;
  }
  _addNewOrderline(productId: number) {
    this.orderLines.set(productId, new OrderLine(productId));
  }
}
