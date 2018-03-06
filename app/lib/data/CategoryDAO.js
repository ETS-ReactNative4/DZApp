//@flow
import { MockCategories } from "./mockdata/MockData";
import Category from "../../models/Category";

export default class CategoryDAO {
  static fetchAll(): Category[] {
    return MockCategories;
  }
}
