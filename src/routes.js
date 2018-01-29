import React from 'react';
import { Route, Switch } from 'react-router';

import New from './pages/New';
import Detail from './pages/Detail';
import NotFound from './pages/NotFound';

export default (
  <Switch>
    <Route exact path="/" component={New} />
    <Route path="/edit/:id" component={Detail} />
    <Route path="/donate/:id" component={Detail} />
    <Route component={NotFound} />
  </Switch>
);
