import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // CRITICAL FIX: This prevents "ReferenceError: process is not defined" 
    // which causes the White Screen crash on Vercel/Netlify.
    'process.env': {},
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});