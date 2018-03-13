//@flow

export default class EventSubscription {
  _customerId: number;
  _eventId: number;
  _remainingCredit: number;

  constructor(customerId: number, eventId: number, remainingCredit: number) {
    this._customerId = customerId;
    this._eventId = eventId;
    this._remainingCredit = remainingCredit;
  }

  get customerId(): number {
    return this._customerId;
  }
  get eventId(): number {
    return this._eventId;
  }
  get remainingCredit(): number {
    return this._remainingCredit;
  }

  set remainingCredit(remainingCredit: number): void {
    this._remainingCredit = remainingCredit;
  }
}
