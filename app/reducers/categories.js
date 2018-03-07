//@flow
import Category from "../models/Category";
import CategoryDAO from "../lib/data/CategoryDAO";

export const mkCategoryState = (
  categories: Category[] = fetchAllCategories()
) => {
  return categories;
};

function fetchAllCategories() {
  return CategoryDAO.fetchAll();
}

const reducer = (state: any = mkCategoryState(), action: any) => {
  switch (action.type) {
    default:
      return state;
  }
};

export default reducer;
