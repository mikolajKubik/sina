import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { federation } from '@module-federation/vite'

// https://vite.dev/config/
export default defineConfig({
  build: {
    target: 'chrome89',
  },
  plugins: [
    federation({
      name: 'host',
      remotes: {
        products: {
          type: 'module',
          name: 'products',
          entry: 'http://localhost:3001/mf-manifest.json',
          entryGlobalName: 'products',
          shareScope: 'default',
        },
        cart: {
          type: 'module',
          name: 'cart',
          entry: 'http://localhost:3002/mf-manifest.json',
          entryGlobalName: 'cart',
          shareScope: 'default',
        },
      },
      shared: {
        react: {
          singleton: true,
        },
        'react-dom': {
          singleton: true,
        },
      },
    }),
    react(),
  ],
  server: {
    port: 3000,
    cors: true,
  },
})