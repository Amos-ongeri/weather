import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    //proxy rule for /api requests
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // your backend
        //rewrites header from http://localhost:5173 to the target header
        changeOrigin: true,
      }
    }
  }
})