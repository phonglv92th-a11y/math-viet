
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, (process as any).cwd(), '');

  return {
    plugins: [react()],
    define: {
      // SECURITY UPDATE: Do NOT expose API_KEY to client. 
      // All AI requests must go through the /api/generate endpoint.
      // 'process.env.API_KEY': JSON.stringify(env.API_KEY),
    },
  };
});