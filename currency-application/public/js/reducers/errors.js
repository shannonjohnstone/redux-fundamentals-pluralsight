import actionTypes from '../stores/actionTypes';
const defaultState = {

}

export default function error(state = defaultState, action) {
  switch (action.type) {
    case actionTypes.RECEIVED_AJAX_CALL_FAILURE: {
      return {
        ...state,
        errorMsg: action.data.msg
      }
    }
    default:{
      return state;
    }
  }
}
