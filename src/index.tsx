import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Switch } from "react-router-dom";
import * as Sentry from '@sentry/react';

import './index.css';
import MainDashboard from './dashboards/Main';
import UploadDashboard from './dashboards/Upload';
import Login from "./account/Login";

import history from './app/history';
import { store } from './app/store';
import { Provider } from 'react-redux';
import * as serviceWorker from './serviceWorker';


Sentry.init({
  dsn: (window as any).SENTRY_DSN,
  environment: (window as any).SENTRY_ENV,
});

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router history={history}>
        <Switch>
          <Route path="/login/" component={Login} />
          <Route path="/accounts/:slug/upload/" component={UploadDashboard} />
          <Route path="/accounts/:slug/" component={MainDashboard} />
        </Switch>
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
