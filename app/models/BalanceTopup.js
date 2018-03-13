//@flow

export default class BalanceTopup {
  _id: number;
  _cashierId: number;
  _eventId: number;
  _customerId: number;
  _subscriptionForEventId: ?number;
  _timestamp: Date;
  _amount: number;

  constructor(
    id: number,
    cashierId: number,
    eventId: number,
    customerId: number,
    subscriptionForEventId: ?number,
    timeStamp: Date,
    amount: number
  ) {
    this._id = id;
    this._cashierId = cashierId;
    this._eventId = eventId;
    this._customerId = customerId;
    this._subscriptionForEventId = subscriptionForEventId;
    this._timestamp = timeStamp;
    this._amount = amount;
  }

  get id(): number {
    return this._id;
  }
  get cashierId(): number {
    return this._cashierId;
  }
  get eventId(): number {
    return this._eventId;
  }
  get customerId(): number {
    return this._customerId;
  }
  get subscriptionForEventId(): ?number {
    return this._subscriptionForEventId;
  }
  get timestamp(): Date {
    return this._timestamp;
  }
  get amount(): number {
    return this._amount;
  }

  set id(id: number): void {
    this._id = id;
  }
}
