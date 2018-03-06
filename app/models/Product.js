//@flow
export default class Product {
  _id: number;
  _name: string;
  _price: number;
  _imageUri: string;
  _categoryId: number;

  constructor(
    id: number,
    name: string,
    price: number,
    imageUri: string,
    categoryId: number
  ) {
    this._id = id;
    this._name = name;
    this._price = price;
    this._imageUri = imageUri;
    this._categoryId = categoryId;
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
  get categoryId(): number {
    return this._categoryId;
  }
}
