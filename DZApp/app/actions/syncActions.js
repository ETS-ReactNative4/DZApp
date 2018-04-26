import { fetchCustomers } from "./customerActions";
import { fetchProducts } from "./productActions";
import { fetchSubscriptions } from "./subscriptionActions";
import { fetchEvents } from "./eventActions";
import { syncOrders } from "./orderActions";
import { syncTopups } from "./topupActions";
import { syncRollbacks } from "./rollbackActions";
import { syncCloseouts } from "./cashierActions";

export const syncAll = () => {
  return function(dispatch) {
    dispatch(fetchCustomers());
    dispatch(fetchProducts());
    dispatch(fetchSubscriptions());
    dispatch(fetchEvents());
    dispatch(syncOrders());
    dispatch(syncTopups());
    dispatch(syncRollbacks());
    dispatch(syncCloseouts());
  };
};
