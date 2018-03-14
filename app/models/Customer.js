//@flow

export default class Customer {
  _id: number;
  _lastName: String;
  _firstName: String;
  _role: String;
  _creditBalance: number;
  _userName: ?String;
  _hashedPass: ?String;
  _salt: ?String;

  static fromObject(obj: {}) {
    return new Customer(
      obj._id,
      obj.firstName,
      obj.lastName,
      obj.role,
      obj.creditBalance,
      obj.userName,
      obj.hashedPass,
      obj.salt
    );
  }

  constructor(
    id: number,
    lastName: String,
    firstName: string,
    role: String,
    creditBalance: number,
    userName: ?String,
    hashedPass: ?String,
    salt: ?String
  ) {
    this._id = id;
    this._lastName = lastName;
    this._firstName = firstName;
    this._role = role;
    this._creditBalance = creditBalance;
    this._userName = userName;
    this._hashedPass = hashedPass;
    this._salt = salt;
  }

  get id(): number {
    return this._id;
  }
  get lastName(): String {
    return this._lastName;
  }
  get firstName(): String {
    return this._firstName;
  }
  get role(): String {
    return this._role;
  }
  get creditBalance(): number {
    return this._creditBalance;
  }
  get userName(): ?String {
    return this._userName;
  }
  get hashedPass(): ?String {
    return this._hashedPass;
  }
  get salt(): ?String {
    return this._salt;
  }
  set creditBalance(creditBalance: number): void {
    this._creditBalance = creditBalance;
  }
  toString(): String {
    return `${this._lastName} ${this._firstName}`;
  }
}
