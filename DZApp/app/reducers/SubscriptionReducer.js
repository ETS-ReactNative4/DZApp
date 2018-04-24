//@flow
import * as types from "../actions/types";

const initialState = {
  isFetching: false,
  subscriptions: [],
  errorMessage: null
};

const SubscriptionReducer = (state: {} = initialState, action: {}) => {
  switch (action.type) {
    case types.REQUEST_SUBSCRIPTIONS:
      return Object.assign({}, state, {
        isFetching: true,
        errorMessage: null
      });
    case types.RECEIVE_SUBSCRIPTIONS:
      return Object.assign({}, state, {
        isFetching: false,
        subscriptions: action.data,
        errorMessage: null
      });
    case types.FETCH_SUBSCRIPTIONS_FAILED: {
      return Object.assign({}, state, {
        isFetching: false,
        errorMessage: action.data
      });
    }
    case types.LOCAL_ORDER: {
      let order = action.data.order;
      let amtPayedFromSubscriptionFee = order.amtPayedFromSubscriptionFee;

      if (amtPayedFromSubscriptionFee && amtPayedFromSubscriptionFee > 0) {
        let customerId = order.customerId;
        let eventId = order.eventId;
        //clone the subscription object and update remaining credit
        let subscription = state.subscriptions.find(
          s => s.customerId === customerId && s.eventId === eventId
        );
        let newSubscription = Object.assign({}, subscription);
        newSubscription.remainingCredit -= amtPayedFromSubscriptionFee;
        //clone the subscriptions array and insert new subscription
        let newSubscriptions = state.subscriptions.slice(0);
        let index = newSubscriptions.indexOf(subscription);
        newSubscriptions[index] = newSubscription;

        return Object.assign({}, state, { subscriptions: newSubscriptions });
      }
    }
    default:
      return state;
  }
};

export default SubscriptionReducer;
