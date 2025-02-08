import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/docutalk/', // This is important for GitHub Pages
  envPrefix: 'DOCUTALK_',
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  optimizeDeps: {
    include: ['appwrite'],
  },
  build: {
    outDir: 'build',
    assetsDir: 'assets',
    emptyOutDir: true,
    sourcemap: true,
    commonjsOptions: {
      include: [/appwrite/, /node_modules/],
    },
  },
})
