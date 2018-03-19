//@flow
import IllegalAmountError from "./errors/IllegalAmountError";

export default class OrderLine {
  _productId: number;
  _quantity: number;

  constructor(productId: number) {
    this._productId = productId;
    this._quantity = 0;
  }

  get productId(): number {
    return this._productId;
  }
  get quantity(): number {
    return this._quantity;
  }
  set quantity(quantity: number) {
    if (quantity >= 0) this._quantity = quantity;
    else throw new IllegalAmountError("Can't set quantity to a negative value");
  }
  addUnit() {
    this._quantity++;
  }
  addUnits(quantity: number) {
    if (quantity <= 0) {
      throw new IllegalAmountError("Can't add a negative amount or zero");
    }
    this._quantity += quantity;
  }
  removeUnit() {
    if (this._quantity > 0) this._quantity--;
    else throw new IllegalAmountError("Can't remove units from orderline");
  }
}
