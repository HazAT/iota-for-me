import { createStore, compose, applyMiddleware } from 'redux';
import rootReducer from './reducer';
import thunk from 'redux-thunk';
import { reactReduxFirebase, getFirebase } from 'react-redux-firebase';
import { firebaseConfig } from './config';
import firebase from 'firebase';

firebase.initializeApp(firebaseConfig); // <- new to v2.*.*
export default function configureStore(initialState, history) {
  return createStore(
    rootReducer,
    initialState,
    compose(
      applyMiddleware(thunk.withExtraArgument(getFirebase)),
      // reactReduxFirebase(firebase, { userProfile: 'users' }),
      reactReduxFirebase(firebase),
      typeof window === 'object' && typeof window.devToolsExtension !== 'undefined'
        ? window.devToolsExtension()
        : f => f
    )
  );
}
