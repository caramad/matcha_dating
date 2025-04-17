import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
	hot: true,            // Enable hot module replacement
    host: "0.0.0.0",       // Allow connections from other containers
    port: 5000,            // Ensure it runs on the expected port
    strictPort: true,      // Prevents random port selection
    hmr: {
      clientPort: 5000,    // Ensures hot reload works in Docker
    },
    watch: {
      usePolling: true,    // Fixes issues with file watching inside Docker
    },
    allowedHosts: ['nginx'], // Allow requests from the nginx container
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
