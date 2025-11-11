import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { federation } from '@module-federation/vite'

export default defineConfig({
  build: {
    target: 'chrome89',
  },
  plugins: [
    federation({
      filename: 'remoteEntry.js',
      name: 'products',
      exposes: {
        './ProductList': './src/ProductList.jsx',
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
    port: 3001,
    cors: true,
  },
})