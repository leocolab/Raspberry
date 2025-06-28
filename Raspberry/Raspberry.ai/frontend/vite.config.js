import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // <-- this adds the '@' alias
    },
  },
  server: {
    proxy: {
      '/chat': 'http://localhost:8000',
    },
  },
})
