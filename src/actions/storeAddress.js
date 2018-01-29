import ActionTypes from '../constants/actionTypes';

function storeAddressRequestedAction() {
  return {
    type: ActionTypes.storeAddressRequested
  };
}

function storeAddressSuccessAction(data) {
  return {
    type: ActionTypes.storeAddressSuccess,
    ...data
  };
}

function storeAddressErrorAction(error) {
  return {
    type: ActionTypes.storeAddressError,
    error
  };
}

export function storeAddress(captcha, address, addressId) {
  return dispatch => {
    dispatch(storeAddressRequestedAction());
    fetch(`https://us-central1-iota-for-me.cloudfunctions.net/public/storeAddress`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${captcha}`
      },
      method: 'POST',
      body: JSON.stringify({ address, addressId })
    })
      .then(response => response.json())
      .then(data => dispatch(storeAddressSuccessAction(data)))
      .catch(error => dispatch(storeAddressErrorAction(error)));
  };
}
