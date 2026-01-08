
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Register service worker to enable PWA installation
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Using a simple relative string for sw.js to prevent URL construction errors
    navigator.serviceWorker.register('sw.js').catch(err => {
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
