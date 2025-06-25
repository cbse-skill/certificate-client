import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [react()],
    assetsInclude: ['**/*.xlsx'],
    base: mode === 'production' ? './' : './',
    server: {
      port: Number(process.env.VITE_PORT) || 5173, // default to 5173
    }
  }
})
