import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/docutalk",
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
    commonjsOptions: {
      include: [/appwrite/, /node_modules/],
    },
  },
})
