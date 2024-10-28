import React from 'react';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import store from './store'; // Your Redux store
import App from './App';

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>,
  document.getElementById('root')
);

reportWebVitals();
