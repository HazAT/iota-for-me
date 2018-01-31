import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import Layout from './pages/Layout';

import configureStore from './store';
import routes from './routes';

import 'typeface-roboto';

const initialState = window.__INITIAL_STATE__ || {
  firebase: {},
  address: { loading: false },
  balance: { loading: false }
};
const store = configureStore(initialState);

render(
  <Provider store={store}>
    <Router>
      <Layout>{routes}</Layout>
    </Router>
  </Provider>,
  document.getElementById('root')
);
