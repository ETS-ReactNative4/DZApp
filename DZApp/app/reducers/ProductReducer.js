//@flow
import * as types from "../actions/types";

const initialState = {
  isFetching: false,
  products: [],
  errorMessage: null
};

const ProductReducer = (state: {} = initialState, action: {}) => {
  switch (action.type) {
    case types.REQUEST_PRODUCTS:
      return Object.assign({}, state, {
        isFetching: true,
        errorMessage: null
      });
    case types.RECEIVE_PRODUCTS:
      return Object.assign({}, state, {
        isFetching: false,
        products: action.data,
        errorMessage: null
      });
    case types.FETCH_PRODUCTS_FAILED: {
      return Object.assign({}, state, {
        isFetching: false,
        errorMessage: action.data
      });
    }
    case types.LOCAL_ORDER: {
      let orderlines = action.data.order.orderlines;

      //clone the product array so we can safely change it
      let newProducts = state.products.slice(0);

      //iterate over orderlines
      //foreach orderline, clone the corresponding product, adjust inStock
      //and insert it back in the newProducts array at the same index
      orderlines.forEach(o => {
        console.warn("orderline: " + o);
        let product = newProducts.find(p => p._id == o.productId);
        console.warn("product: " + product)
        let index = newProducts.indexOf(product);
        let newProduct = Object.assign({}, product);
        newProduct.inStock -= o.quantity;
        newProducts[index] = newProduct;
      });

      return Object.assign({}, state, { products: newProducts });
    }
    default:
      return state;
  }
};

export default ProductReducer;
