import React from 'react';
import { createRoot } from 'react-dom/client';
// Menggunakan jalur relatif standar './App' untuk memastikan kompatibilitas bundler yang paling stabil
import App from './App'; 

/**
 * Registrasi Service Worker untuk Progressive Web App (PWA)
 * Ini memungkinkan aplikasi dapat diinstal dan bekerja secara offline.
 */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => {
        console.log('HERNIPRINT SW registered:', reg.scope);
      })
      .catch(err => {
        console.error('HERNIPRINT SW registration failed:', err);
      });
  });
}

const container = document.getElementById('root');

if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      {/* Komponen utama aplikasi */}
      <App />
    </React.StrictMode>
  );
} else {
  console.error("Critical Error: Failed to find root element.");
}
