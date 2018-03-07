import OrderReducer, { mkOrderState } from "./orders";
import CategoryReducer, { mkCategoryState } from "./categories";
import ProductReducer, { mkProductState } from "./products";

const initialState = () => {
  return {
    orders: mkOrderState(),
    categories: mkCategoryState(),
    products: mkProductState()
  };
};

export const reducer = (state = initialState(), action) => {
  let orders = OrderReducer(state.orders, action);
  let categories = CategoryReducer(state.categories, action);
  let products = CategoryReducer(state.products, action);

  return {
    orders: orders,
    categories: categories,
    products: products
  };
};
