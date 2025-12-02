import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Robust Polyfill for crypto.randomUUID
// This prevents crashes in browsers where crypto is undefined or read-only
try {
  if (typeof crypto === 'undefined') {
    Object.defineProperty(window, 'crypto', {
      value: {
        randomUUID: generateUUID
      },
      writable: true,
      configurable: true
    });
  } else if (!crypto.randomUUID) {
    // Some browsers have crypto but no randomUUID
    // We try to assign it, but handle cases where crypto is read-only
    try {
      crypto.randomUUID = generateUUID as any;
    } catch(e) {
      console.warn("Failed to assign crypto.randomUUID", e);
    }
  }
} catch (e) {
  console.warn("Crypto polyfill failed", e);
}

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
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