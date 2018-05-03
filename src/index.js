import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import AppContainer from './AppContainer';
import { Provider } from 'react-redux';
import store from './store';

ReactDOM.render(
  <Provider store={store}>
    <AppContainer />
  </Provider>,
  document.getElementById('root'),
);
