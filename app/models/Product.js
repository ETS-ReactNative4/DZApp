//@flow
export default class Product {
  _id: number;
  _name: string;
  _price: number;
  _imageUri: string;
  _inStock: number;
  _criticalStock: number;

  constructor(
    id: number,
    name: string,
    price: number,
    imageUri: string,
    inStock: number,
    criticalStock: number
  ) {
    this._id = id;
    this._name = name;
    this._price = price;
    this._imageUri = imageUri;
    this._inStock = inStock;
    this._criticalStock = criticalStock;
  }

  get id(): number {
    return this._id;
  }
  get name(): string {
    return this._name;
  }
  get price(): number {
    return this._price;
  }
  get imageUri(): string {
    return this._imageUri;
  }
  get inStock(): number {
    return this._inStock;
  }
  get criticalStock(): number {
    return this._criticalStock;
  }
  set inStock(inStock: number): void {
    this._inStock = inStock;
  }
}
