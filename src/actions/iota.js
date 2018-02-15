import ActionTypes from '../constants/actionTypes';

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

export function refreshBalance(addressId) {
  return dispatch => {
    dispatch(iotaBalanceRequestedAction());

    fetch(`https://us-central1-iota-for-me.cloudfunctions.net/api/getBalance`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({ addressId })
    })
      .then(response => response.json())
      .then(data => dispatch(iotaBalanceSuccessAction(data)))
      .catch(error => dispatch(iotaBalanceErrorAction(error)));
  };
}
