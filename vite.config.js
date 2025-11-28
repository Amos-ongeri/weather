import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    //proxy rule for /api requests
    proxy: {
      '/api': {
        target: 'https://weather-server-side.onrender.com', // your backend
        //rewrites header from http://localhost:5173 to the target header
        changeOrigin: true,
      }
    }
  }
})