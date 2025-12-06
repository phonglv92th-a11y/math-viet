
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, (process as any).cwd(), '');

  return {
    plugins: [react()],
    define: {
      // Expose API_KEY to client for immediate functionality in this environment.
      // Note: In a production Vercel deployment with a real backend, you would remove this.
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
    },
  };
});
