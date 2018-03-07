//@flow
import Product from "../models/Product";
import ProductDAO from "../lib/data/ProductDAO";

export const mkProductState = (products: Product[] = fetchAllProducts()) => {
  return products;
};

function fetchAllProducts() {
  return ProductDAO.fetchAll();
}

const reducer = (state: any = mkProductState(), action: any) => {
  switch (action.type) {
    default:
      return state;
  }
};

export default reducer;
