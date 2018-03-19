//@flow

export default class Customer {
  id: number;
  lastName: String;
  firstName: String;
  role: String;
  creditBalance: number;
  userName: ?String;

  static fromObject(obj: {}) {
    return new Customer(
      obj._id,
      obj.firstName,
      obj.lastName,
      obj.role,
      obj.creditBalance,
      obj.userName,
    );
  }

  constructor(
    id: number,
    lastName: String,
    firstName: string,
    role: String,
    creditBalance: number,
    userName: ?String,
  ) {
    this.id = id;
    this.lastName = lastName;
    this.firstName = firstName;
    this.role = role;
    this.creditBalance = creditBalance;
    this.userName = userName;
  }
}
