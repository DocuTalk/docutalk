import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Load env file based on mode
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    base: '/docutalk', // This is important for GitHub Pages
    envPrefix: 'VITE_',
    envDir: '.',  // Look for .env files in root
    define: {
      __DEV__: mode === 'development',
      // Expose env variables to client
      'process.env.VITE_APPWRITE_PROJECT_ID': JSON.stringify(env.VITE_APPWRITE_PROJECT_ID),
      'process.env.VITE_APPWRITE_DATABASE_ID': JSON.stringify(env.VITE_APPWRITE_DATABASE_ID),
      'process.env.VITE_APPWRITE_STORAGE_ID': JSON.stringify(env.VITE_APPWRITE_STORAGE_ID),
      'process.env.VITE_APPWRITE_USER_COLLECTION_ID': JSON.stringify(env.VITE_APPWRITE_USER_COLLECTION_ID),
      'process.env.VITE_APPWRITE_DOC_COLLECTION_ID': JSON.stringify(env.VITE_APPWRITE_DOC_COLLECTION_ID),
      'process.env.VITE_DEV_API_ENDPOINT': JSON.stringify(env.VITE_DEV_API_ENDPOINT),
      'process.env.VITE_UPLOAD_API_ENDPOINT': JSON.stringify(env.VITE_UPLOAD_API_ENDPOINT),
      'process.env.VITE_DELETE_API_ENDPOINT': JSON.stringify(env.VITE_DELETE_API_ENDPOINT),
      'process.env.VITE_QUERY_API_ENDPOINT': JSON.stringify(env.VITE_QUERY_API_ENDPOINT),
      'process.env.VITE_MAX_QUERY_COUNT': JSON.stringify(env.VITE_MAX_QUERY_COUNT),
      'process.env.VITE_MAX_DOC_COUNT': JSON.stringify(env.VITE_MAX_DOC_COUNT)
    },
    server: {
      cors: {
        origin: ['https://docutalk.github.io', 'http://localhost:5173'],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        credentials: true
      },
      proxy: {
        '/api': {
          target: 'https://cloud.appwrite.io/v1',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },
    optimizeDeps: {
      include: [
        'appwrite',
        '@emotion/is-prop-valid',
        'react',
        'react-dom',
        'react-router-dom'
      ],
      exclude: []
    },
    build: {
      outDir: 'build',
      assetsDir: 'assets',
      emptyOutDir: true,
      sourcemap: true,
      rollupOptions: {
        external: [],
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            appwrite: ['appwrite']
          }
        }
      }
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    }
  }
})
