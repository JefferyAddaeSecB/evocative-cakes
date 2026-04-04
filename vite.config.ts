import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
    cors: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    target: 'esnext',
    // Inline small assets (< 8KB) as base64 — eliminates extra HTTP requests for tiny files
    assetsInlineLimit: 8192,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // recharts is only used in the admin dashboard — keep it out of the main bundle
          if (id.includes('recharts') || id.includes('victory-')) {
            return 'vendor-charts'
          }
          // framer-motion is a large shared dep — isolate it for better caching
          if (id.includes('framer-motion')) {
            return 'vendor-motion'
          }
          // Supabase SDK — isolate for caching
          if (id.includes('@supabase')) {
            return 'vendor-supabase'
          }
          // Core React + router in a stable vendor chunk
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('react-router')) {
            return 'vendor-react'
          }
          // OpenAI SDK — only used by chatbot
          if (id.includes('openai')) {
            return 'vendor-openai'
          }
        },
      },
    },
  },
})
