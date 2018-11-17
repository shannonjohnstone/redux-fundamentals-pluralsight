import { applyMiddleware, createStore } from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';

const logger = createLogger({ collapsed: true });

const defaultState = {
  originAmount: '0.00',
  destinationAmount: '0.00',
  conversionRate: 1.5
};

function amount(state = defaultState, action) {
  if (action.type === 'CHANGE_ORIGIN_AMOUNT') return { ...state, originAmount: action.data };
  if (action.type === 'RECEIVED_CONVERSION_RATE') {
    return {
      ...state,
      conversionRate: action.data.xRate,
      destinationAmount: action.data.destAmount
    }
  }
  return state;
}

const middleware = [thunk, logger];
const store = createStore(
  amount,
  applyMiddleware(...middleware)
);

export default store;
