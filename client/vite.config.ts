import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import GlobPlugin from 'vite-plugin-glob'


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    GlobPlugin(),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})

