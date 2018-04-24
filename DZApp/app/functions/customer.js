export const getCustomerById = (id, customers) => {
  return customers.find(c => c._id === id);
};

export const getFullName = customer => {
  return `${customer.firstName} ${customer.lastName}`;
};
