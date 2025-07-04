import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // string shorthand: /api -> http://localhost:3001/api
      '/api': {
        target: 'http://localhost:3001', // The address of your Express server
        changeOrigin: true, // Recommended for most cases
        // rewrite: (path) => path.replace(/^\/api/, '') // Uncomment if you don't want /api prefix forwarded
      },
    },
  },
})
