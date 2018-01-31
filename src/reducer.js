import { combineReducers } from 'redux';
import { firebaseReducer } from 'react-redux-firebase';
import ActionTypes from './constants/actionTypes';

function addressReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.storeAddressRequested: {
      return Object.assign({}, state, {
        loading: true
      });
    }
    case ActionTypes.storeAddressSuccess: {
      const newState = Object.assign({}, state, {
        loading: false,
        result: action
      });
      return newState;
    }
    case ActionTypes.storeAddressError: {
      console.error(action, 'error');
      return Object.assign({}, state, {
        loading: false,
        error: action
      });
    }
    default:
      return state;
  }
}

// From https://github.com/iotaledger/wallet/blob/42cff65ba6dd329f00f076ba4de0f94bc48e67db/ui/js/ui.utils.js#L9
function formatAmount(amount) {
  amount = parseInt(amount, 10);

  var units = '',
    afterComma = '',
    beforeComma = '',
    hidden = '',
    afterCommaDigits = 0;

  if (amount < 0) {
    amount = Math.abs(amount);
  }

  if (amount >= 1000000000000000) {
    units = 'Pi';
    afterCommaDigits = 15;
  } else if (amount >= 1000000000000) {
    units = 'Ti';
    afterCommaDigits = 12;
  } else if (amount >= 1000000000) {
    units = 'Gi';
    afterCommaDigits = 9;
  } else if (amount >= 1000000) {
    units = 'Mi';
    afterCommaDigits = 6;
  } else {
    units = 'i';
    afterCommaDigits = 0;
  }

  amount = amount.toString();

  var digits = amount.split('').reverse();

  for (var i = 0; i < afterCommaDigits; i++) {
    afterComma = digits[i] + afterComma;
  }

  if (/^0*$/.test(afterComma)) {
    afterComma = '';
  }

  var j = 0;

  for (i = afterCommaDigits; i < digits.length; i++) {
    if (j > 0 && j % 3 === 0) {
      beforeComma = "'" + beforeComma;
    }
    beforeComma = digits[i] + beforeComma;
    j++;
  }

  if (afterComma.length > 1) {
    hidden = afterComma.substring(1).replace(/0+$/, '');
    afterComma = afterComma[0];
  }

  var short =
    beforeComma +
    (afterComma ? '.' + afterComma : '') +
    (hidden ? '+' : '') +
    ' ' +
    units;

  return short;
}

function balanceReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.iotaBalanceRequested: {
      return Object.assign({}, state, {
        loading: true
      });
    }
    case ActionTypes.iotaBalanceSuccess: {
      let balance = action.balances.reduce((prev, current) => prev + current, 0);
      action.formattedBalance = formatAmount(balance);
      const newState = Object.assign({}, state, {
        loading: false,
        result: action
      });
      return newState;
    }
    case ActionTypes.iotaBalanceError: {
      console.error(action, 'error');
      return Object.assign({}, state, {
        loading: false,
        error: action
      });
    }
    default:
      return state;
  }
}

export default combineReducers({
  firebase: firebaseReducer,
  address: addressReducer,
  balance: balanceReducer
});
