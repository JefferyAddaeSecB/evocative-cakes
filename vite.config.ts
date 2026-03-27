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
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            return
          }

          if (id.includes('framer-motion')) {
            return 'motion'
          }

          if (id.includes('@supabase')) {
            return 'supabase-sdk'
          }

          if (id.includes('openai')) {
            return 'openai-sdk'
          }

          return 'vendor'
        },
      },
    },
  },
})
