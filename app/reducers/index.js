import { combineReducers } from "redux";
import customerReducer from "./customers";
import cashierReducer from "./cashiers";

const reducer = combineReducers({
  customerReducer: customerReducer,
  cashierReducer: cashierReducer
});

export default reducer;
