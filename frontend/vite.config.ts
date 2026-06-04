import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  envDir: '..',
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          charts: ['recharts'],
          firebase: ['firebase/app', 'firebase/auth', 'firebase/analytics'],
          vendor: ['@reduxjs/toolkit', 'react-redux', 'axios', 'date-fns', 'lucide-react']
        }
      }
    }
  },
  test: {
    environment: 'jsdom'
  },
  server: {
    port: 5173
  }
});
