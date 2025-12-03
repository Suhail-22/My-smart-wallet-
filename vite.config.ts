import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // We cast process to any to avoid TS errors in some environments
  const env = loadEnv(mode, (process as any).cwd(), '');

  return {
    plugins: [react()],
    define: {
      // Prevents "process is not defined" error in browser/Vercel
      'process.env': {},
      // Inject the API Key specifically so Gemini Service can use it safely
      'process.env.API_KEY': JSON.stringify(env.API_KEY || process.env.API_KEY),
    },
    resolve: {
      alias: {
        '@': '/src',
      },
    },
  };
});