import axios from 'axios';
import debounce from 'lodash.debounce';
import actionTypes from '../stores/actionTypes';

export function changeOriginAmount(newAmount) {
  return {
    type: actionTypes.CHANGE_ORIGIN_AMOUNT,
    data: { newAmount }
  }
}

export function changeDestAmount(newAmount) {
  return {
    type: actionTypes.CHANGE_DESTINATION_AMOUNT,
    data: { newAmount }
  }
}

export function changeOriginCurrency(newCurrency) {
  return {
    type: actionTypes.CHANGE_ORIGIN_CURRENCY,
    data: { newCurrency }
  }
}

export function changeDestCurrency(newCurrency) {
  return {
    type: actionTypes.CHANGE_DEST_CURRENCY,
    data: { newCurrency }
  }
}

export function fetchConversionRate(payload) {
  return dispatch => {
    return makeCoversionApiCall(payload, dispatch);
  }
}

function _makeConversionApiCall(payload, dispatch) {
  dispatch({ type: actionTypes.REQUEST_CONVERSION_RATE, data: payload });

  return axios.get('/api/conversion', {
    params: payload
  })
    .then(res => dispatch({ type: actionTypes.RECEIVED_CONVERSION_RATE_SUCCESS, data: res.data }))
    .catch(err => dispatch({ type: actionTypes.RECEIVED_CONVERSION_RATE_FAILURE, data: err }))
}

const makeCoversionApiCall = debounce(_makeConversionApiCall, 300);

export function fetchConversionRateAndFees(payload) {
  return dispatch => {
    return makeCoversionAndFeesApiCall(payload, dispatch);
  }
}

function _makeConversionAndFessApiCall(payload, dispatch) {
  dispatch({ type: actionTypes.REQUEST_CONVERSION_RATE, data: payload });

  return axios.get('/api/conversion', {
    params: payload
  })
    .then(res => {
      dispatch({ type: actionTypes.RECEIVED_CONVERSION_RATE_SUCCESS, data: res.data });
      const feePayload = { ...payload, originAmount: res.data.originAmount }
      dispatch(fetchFees(feePayload))
    })
    .catch(err => dispatch({ type: actionTypes.RECEIVED_CONVERSION_RATE_FAILURE, data: err }))
}

const makeCoversionAndFeesApiCall = debounce(_makeConversionAndFessApiCall, 300);

export function fetchFees(payload) {
  return dispatch => {
    return fetchFeesApiCall(payload, dispatch);
  }
}

function _fetchFeesApiCall(payload, dispatch) {
  dispatch({ type: actionTypes.REQUEST_FEES, data: payload });

  return axios.get('/api/fees', {
    params: payload
  })
    .then(res => dispatch({ type: actionTypes.RECEIVED_FEES_SUCCESS, data: res.data }))
    .catch(err => dispatch({ type: actionTypes.RECEIVED_AJAX_CALL_FAILURE, data: { msg: getErrorMsg(res), failCall: 'fees' }}))
}

const fetchFeesApiCall = debounce(_fetchFeesApiCall, 300);

/**
 * helpers
 */
// we'll handle all failures the same
function getErrorMsg(resp) {
  var msg = 'Error. Please try again later.'

  if (resp && resp.request && resp.request.status === 0) {
    msg = 'Oh no! App appears to be offline.'
  }

  mesg
}
