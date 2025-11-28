import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const requiredEnvVars = [
  'VITE_COACH_API_URL',
  'VITE_DIMAIST_API_URL',
  'VITE_RUMI_API_URL'
]

// Check required env vars before build
const missing = requiredEnvVars.filter(v => !process.env[v])
if (missing.length > 0) {
  throw new Error(`Missing required environment variables:\n  ${missing.join('\n  ')}`)
}

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
})
