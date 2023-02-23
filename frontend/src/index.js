import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom'; //inserted, without this we were getting "Error, you should not use <link> outside a <router>"

const root = ReactDOM.createRoot(document.getElementById('root')); //use browser router instead of "react.strictmode"
root.render(
  <BrowserRouter> 
    <App />
  </BrowserRouter>
);

