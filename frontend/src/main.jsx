import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { API_BASE_URL } from './utils/api.js';

// Global API Interceptor: Asegura que toda petición a /api/ o /images/ se envíe a Render
const originalFetch = window.fetch;
window.fetch = function (input, init) {
  if (typeof input === 'string') {
    if (input.startsWith('/api/') || input.startsWith('/images/')) {
      input = `${API_BASE_URL}${input}`;
    }
  } else if (input instanceof Request) {
    const url = input.url;
    if (url.startsWith('/api/') || url.startsWith('/images/')) {
      input = new Request(`${API_BASE_URL}${url}`, input);
    }
  }
  return originalFetch.call(this, input, init);
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
