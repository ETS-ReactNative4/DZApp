export default class Rollback {
  _orderId: number;
  _cashierId: number;
  _timestamp: Date;

  constructor(orderId: number, cashierId: number, timestamp: Date) {
    this._orderId = orderId;
    this._cashierId = cashierId;
    this._timestamp = timestamp;
  }

  get orderId(): number {
    return this._orderId;
  }
  get cashierId(): number {
    return this._cashierId;
  }
  get timestamp(): Date {
    return this._timestamp;
  }
}
