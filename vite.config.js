import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    //proxy rule for /api requests
    proxy: {
      '/api': {
        target: 'https://weather-server-side.onrender.com', // your backend
        changeOrigin: true,
      }
    }
  }
})