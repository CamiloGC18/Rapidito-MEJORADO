import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import { VitePWA } from 'vite-plugin-pwa'  // ← Comentar esta línea

// https://vite.dev/config/
// PERF-007: Optimized Vite configuration for better bundle splitting and performance
export default defineConfig({
  plugins: [
    react(),
    // VitePWA({ ... }) // PWA desactivado temporalmente
  ],
  build: {
    cssCodeSplit: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-maps': ['mapbox-gl'],
          'vendor-animation': ['framer-motion'],
          'vendor-socket': ['socket.io-client'],
          'vendor-utils': ['axios', 'lodash.debounce'],
        },
      },
    },
    chunkSizeWarningLimit: 400,
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'axios'],
  },
})
