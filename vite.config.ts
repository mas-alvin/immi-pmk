import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/google-api': {
        target: 'https://script.google.com',
        changeOrigin: true,
        followRedirects: true, // Sangat penting agar proxy mengikuti redirect Google
        rewrite: (path) => path.replace(/^\/google-api/, ''),
      }
    }
  }
})
