import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on mode
  const env = loadEnv(mode, process.cwd(), '')
  
  const isProduction = mode === 'production'
  const base = isProduction ? '/' : '/docutalk/'
  
  return {
    plugins: [react()],
    base, // This will be '/' in production
    envPrefix: 'VITE_',
    envDir: '.',
    define: {
      __DEV__: mode === 'development',
      // Expose env variables to client
      ...Object.keys(env).reduce((acc, key) => {
        if (key.startsWith('VITE_')) {
          acc[`process.env.${key}`] = JSON.stringify(env[key])
        }
        return acc
      }, {})
    },
    server: {
      cors: {
        origin: ['https://docutalk.co.uk', 'http://localhost:5173'],
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
      outDir: 'dist',
      assetsDir: 'assets',
      emptyOutDir: true,
      sourcemap: false, // Set to false in production
      rollupOptions: {
        external: [],
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            appwrite: ['appwrite']
          },
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name.split('.')
            const extType = info[info.length - 1]
            if (/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/i.test(assetInfo.name)) {
              return `assets/media/[name]-[hash][extname]`
            }
            if (/\.(png|jpe?g|gif|svg|webp|ico)(\?.*)?$/i.test(assetInfo.name)) {
              return `assets/img/[name]-[hash][extname]`
            }
            if (/\.(woff2?|eot|ttf|otf)(\?.*)?$/i.test(assetInfo.name)) {
              return `assets/fonts/[name]-[hash][extname]`
            }
            return `assets/[name]-[hash][extname]`
          },
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
        }
      }
    },
    resolve: {
      alias: {
        '@': path.resolve(process.cwd(), './src')
      }
    }
  }
})
