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

export default combineReducers({
  firebase: firebaseReducer,
  address: addressReducer
});
