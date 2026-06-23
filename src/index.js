import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import reportWebVitals from './reportWebVitals';

import { Provider } from 'react-redux';
import store from './store';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { GoogleOAuthProvider } from '@react-oauth/google';


const root = ReactDOM.createRoot(
  document.getElementById('root')
);


root.render(

  <React.StrictMode>

    <GoogleOAuthProvider
      clientId={process.env.REACT_APP_CLIENT_ID}
    >

      <Provider store={store}>

        <App />

        <ToastContainer position="top-right" />

      </Provider>

    </GoogleOAuthProvider>


  </React.StrictMode>

);


reportWebVitals();