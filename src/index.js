// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './main';

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './main';
import JsonConvertor from './JsonConvertor';
import JsonValidator from './JsonValidator';
import './index.css';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/json-converter" element={<JsonConvertor />} />
        <Route path="/json-validator" element={<JsonValidator />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);