import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // CRITICAL FIX: Polyfill process.env to an empty object.
    // This prevents "ReferenceError: process is not defined" crash on Vercel.
    'process.env': {},
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});