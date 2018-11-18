import { applyMiddleware, createStore } from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import rootReducer from '../reducers'

const logger = createLogger({ collapsed: true });

const middleware = [thunk, logger];
const store = createStore(
  rootReducer,
  applyMiddleware(...middleware)
);

export default store;
