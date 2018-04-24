export const calculateTotal = (orderlines, products) => {
  let totalAmount = 0.0;
  orderlines.forEach(o => {
    totalAmount += o.quantity * products.find(p => p._id === o.productId).price;
  });
  return totalAmount;
};

export const calculateSubTotal = (orderline, product) => {
  return orderline.quantity * product.price;
};
