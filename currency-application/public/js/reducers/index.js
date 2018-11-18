import { combineReducers } from 'redux';

import amount from './amount';
import errors from './errors';

export default combineReducers({
  amount,
  errors
})
