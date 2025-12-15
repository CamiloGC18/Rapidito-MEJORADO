import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
// PERF-007: Optimized Vite configuration for better bundle splitting and performance
export default defineConfig({
  plugins: [
    react(),
    // VitePWA({ ... }) // PWA desactivado temporalmente
  ],
  build: {
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Use terser for better minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true,
      },
    },
    // Chunk splitting configuration
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks - separate heavy dependencies
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-maps': ['mapbox-gl'],
          'vendor-animation': ['framer-motion'],
          'vendor-socket': ['socket.io-client'],
          'vendor-utils': ['axios', 'lodash.debounce'],
        },
      },
    },
    // Reduce chunk size warning limit (opcional, pero recomendado mantenerlo bajo para detectar problemas)
    chunkSizeWarningLimit: 400,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'axios'],
  },
})
