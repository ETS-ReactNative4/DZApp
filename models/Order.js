//@flow
import OrderLine from "./OrderLine";
import IllegalAmountError from "./errors/IllegalAmountError";

export default class Order {
  _orderId: number;
  _orderLines: Map<number, OrderLine>;
  _memberId: number;

  constructor() {
    this._orderLines = new Map();
  }

  get orderId(): number {
    return this._orderId;
  }
  get orderLines(): Map<number, OrderLine> {
    return this._orderLines;
  }
  get memberId(): number {
    return this._memberId;
  }
  set orderId(orderId: number) {
    this._orderId = orderId;
  }
  set memberId(memberId: number) {
    this._memberId = memberId;
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
      if (this.quantity < 0)
        throw new IllegalAmountError(
          "No orderline for this productid present in order"
        );
      else {
        this._addNewOrderline(productId);
        this.orderLines.get(productId).quantity = quantity;
      }
    }
  }
  _addNewOrderline(productId: number) {
    this.orderLines.set(productId, new OrderLine(productId));
  }
}
