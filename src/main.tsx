import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// تسجيل Service Worker بسيط
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW مسجل:', registration.scope);
      })
      .catch(error => {
        console.log('SW فشل التسجيل:', error);
      });
  });
}

// Polyfill محسّن لـ crypto.randomUUID
if (typeof window !== 'undefined') {
  if (!window.crypto) {
    (window as any).crypto = {};
  }
  
  if (!window.crypto.randomUUID) {
    const generateUUID = () => {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    };
    
    (window.crypto as any).randomUUID = generateUUID;
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('لم يتم العثور على عنصر الجذر');

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);