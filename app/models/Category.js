//@flow
export default class Category {
  _id: number;
  _name: string;

  constructor(id: number, name: string) {
    this._id = id;
    this._name = name;
  }

  get id(): number {
    return this._id;
  }
  get name(): string {
    return this._name;
  }

  static fromObject(obj: Object): Category {
    return new Category(obj.id, obj.name);
  }
}
