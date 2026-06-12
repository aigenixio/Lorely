import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Unregister ALL service workers to clear cached install page
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(registration => {
      registration.unregister();
      console.log('Service worker unregistered');
    });
  });
  // Also clear all caches
  caches.keys().then(keys => {
    keys.forEach(key => {
      caches.delete(key);
      console.log('Cache cleared:', key);
    });
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)