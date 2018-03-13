//@flow

export default class Event {
  _id: number;
  _name: String;
  _fromDate: Date;
  _toDate: Date;
  _subscriptionFee: ?number;

  constructor(
    id: number,
    name: String,
    fromDate: Date,
    toDate: Date,
    subscriptionFee: ?number
  ) {
    this._id = id;
    this._name = name;
    this._fromDate = fromDate;
    this._toDate = toDate;
    this._subscriptionFee = subscriptionFee;
  }

  get id(): number {
    return this._id;
  }
  get name(): String {
    return this._name;
  }
  get fromDate(): Date {
    return this._fromDate;
  }
  get toDate(): Date {
    return this._toDate;
  }
  get subscriptionFee(): ?number {
    return this._subscriptionFee;
  }
}
