
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import NetworkService from './interceptor';
import * as redux from './createStore';
import { BrowserRouter, Route } from 'react-router-dom'


import './index.css';
import './App.css';
import App from './App';



//import * as serviceWorker from './serviceWorker';
NetworkService.setupInterceptors(redux.store)



ReactDOM.render(
  <Provider store={redux.store}>
    <BrowserRouter>
      <Route path="/" component={App} />
    </BrowserRouter>
  </Provider>, document.getElementById('root'));
