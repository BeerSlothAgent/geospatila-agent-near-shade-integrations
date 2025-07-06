import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis',
  },
  resolve: {
    alias: {
      buffer: 'buffer',
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: ['near-api-js', '@near-wallet-selector/core', '@near-wallet-selector/my-near-wallet', '@near-wallet-selector/meteor-wallet', '@near-wallet-selector/modal-ui']
  },
  server: {
    fs: {
      allow: ['..']
    }
  }
});