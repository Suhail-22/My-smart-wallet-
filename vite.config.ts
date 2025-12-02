import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // This is the critical fix for the "White Screen" on Vercel.
    // It replaces 'process.env' with an empty object in the browser,
    // preventing "ReferenceError: process is not defined".
    'process.env': {},
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});