import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

const requiredEnvVars = [
  'VITE_COACH_API_URL',
  'VITE_DIMAIST_API_URL',
  'VITE_RUMI_API_URL'
]

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  // Check required env vars
  const missing = requiredEnvVars.filter(v => !env[v])
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables:\n  ${missing.join('\n  ')}`)
  }

  return {
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
  }
})
