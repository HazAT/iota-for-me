import ActionTypes from '../constants/actionTypes';
import IOTA from 'iota.lib.js';

function iotaBalanceRequestedAction() {
  return {
    type: ActionTypes.iotaBalanceRequested
  };
}

function iotaBalanceSuccessAction(data) {
  return {
    type: ActionTypes.iotaBalanceSuccess,
    ...data
  };
}

function iotaBalanceErrorAction(error) {
  return {
    type: ActionTypes.iotaBalanceError,
    error
  };
}

export function refreshBalance(address) {
  return dispatch => {
    dispatch(iotaBalanceRequestedAction());

    var iota = new IOTA({
      host: 'http://nodes.iota.fm',
      port: 80
    });

    iota.api.getBalances([address], 10, (error, success) => {
      if (error) {
        dispatch(iotaBalanceErrorAction(error));
      } else {
        dispatch(iotaBalanceSuccessAction(success));
      }
    });
  };
}
