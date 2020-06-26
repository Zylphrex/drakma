import React from 'react';
import ReactDOM from 'react-dom';
import { createBrowserHistory } from "history";
import { Router, Route, Switch } from "react-router-dom";

import './index.css';
import MainDashboard from './dashboard/Main';
import UploadDashboard from './dashboard/Upload';
import Login from "./account/Login";

import { store } from './app/store';
import { Provider } from 'react-redux';
import * as serviceWorker from './serviceWorker';

const history = createBrowserHistory();

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
