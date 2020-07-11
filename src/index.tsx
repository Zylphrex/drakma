import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Switch } from "react-router-dom";
import * as Sentry from '@sentry/react';
import { Integrations as ApmIntegrations } from '@sentry/apm';

import './index.css';
import MainDashboard from './dashboards/Main';
import UploadDashboard from './dashboards/Upload';
import Login from "./account/Login";

import history from './app/history';
import { storeMatch } from './app/routes';
import { store } from './app/store';
import { Provider } from 'react-redux';
import HomeRoute from './HomeRoute';
import * as serviceWorker from './serviceWorker';


const SENTRY_DSN = process.env.REACT_APP_SENTRY_DSN;
const SENTRY_ENV = process.env.REACT_APP_SENTRY_ENV;

Sentry.init({
  dsn: SENTRY_DSN,
  environment: SENTRY_ENV,
  integrations: [
    new ApmIntegrations.Tracing({
      beforeNavigate: () => store.getState().location.path ?? '/',
    }),
  ],
  tracesSampleRate: 1.0,
});

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router history={history}>
        <Switch>
          <Route path="/login/" component={storeMatch(Login)} />
          <Route path="/accounts/:slug/upload/" component={storeMatch(UploadDashboard)} />
          <Route path="/accounts/:slug/" component={storeMatch(MainDashboard)} />
          <Route path="/" component={storeMatch(HomeRoute)} />
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
