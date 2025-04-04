import React from 'react';
import ReactDOM from 'react-dom';
import {CartProvider} from '../src/component/pos/CartContext.jsx'
import './index.css';
import App from './App';

ReactDOM.render(
  <CartProvider>
      <App />
  </CartProvider>,
  document.getElementById('root')
);
