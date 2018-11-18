import actionTypes from '../stores/actionTypes';

const defaultState = {
  originCurrency: 'USD',
  originAmount: '0.00',
  destinationAmount: '0.00',
  conversionRate: 1.5,
  feeAmount: 0.00,
  totalCost: 0.00,
  destinationCurrency: 'EUR',
};

export default function amount(state = defaultState, action) {
  switch (action.type) {
    case actionTypes.CHANGE_ORIGIN_AMOUNT: {
      return { ...state, originAmount: action.data.newAmount };
    }
    case actionTypes.CHANGE_DESTINATION_AMOUNT: {
      return { ...state, destinationAmount: action.data.newAmount };
    }
    case actionTypes.CHANGE_ORIGIN_CURRENCY: {
      return { ...state, originCurrency: action.data.newCurrency };
    }
    case actionTypes.CHANGE_DEST_CURRENCY: {
      return { ...state, destinationCurrency: action.data.newCurrency };
    }
    case actionTypes.RECEIVED_CONVERSION_RATE_SUCCESS: {
      return {
        ...state,
        conversionRate: action.data.xRate,
        originAmount: action.data.originAmount,
        destinationAmount: action.data.destAmount
      }
    }
    case actionTypes.RECEIVED_FEES_SUCCESS: {
      const newFeeAmount = action.data.feeAmount;
      const newTotal = parseFloat(state.originAmount, 10) + parseFloat(newFeeAmount, 10);

      return {
        ...state,
        feeAmount: newFeeAmount,
        totalCost: newTotal
      }
    }
    default: {
      return state
    }
  }
}
