//@flow
import { MockCustomers } from "../mockdata/data";
import Customer from "../../../models/Customer";

export default class CustomerDAO {
  static fetchAll(): Customer[] {
    return MockCustomers;
  }
}
