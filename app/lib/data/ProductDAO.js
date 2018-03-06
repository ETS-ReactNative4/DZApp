//@flow

import { MockProducts } from "./mockdata/MockData";
import Product from "../../models/Product";

export default class ProductDAO {
  static fetchAll(): Product[] {
    return MockProducts;
  }

  static fetchByCategoryId(categoryId: number) {
    return MockProducts.filter(product => product.categoryId === categoryId);
  }
}
