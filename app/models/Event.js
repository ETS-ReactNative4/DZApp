//@flow

export default class Event {
  _id: number;
  name: String;
  fromDate: Date;
  toDate: Date;
  subscriptionFee: ?number;

  constructor(
    id: number,
    name: String,
    fromDate: Date,
    toDate: Date,
    subscriptionFee: ?number
  ) {
    this.id = id;
    this.name = name;
    this.fromDate = fromDate;
    this.toDate = toDate;
    this.subscriptionFee = subscriptionFee;
  }
}
