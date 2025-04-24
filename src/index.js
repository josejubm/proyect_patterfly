import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // Este import debe venir después de los imports de PF
import reportWebVitals from './reportWebVitals';
import '@patternfly/react-core/dist/styles/base.css';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();