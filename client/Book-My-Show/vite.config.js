import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/', // ✅ Important: Ensures paths work in production
  server: {
    port: 3000,
    host: 'localhost',
  },
  define: {
    'process.env': {},
  },
})

