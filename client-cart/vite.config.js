import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { federation } from '@module-federation/vite'

// https://vite.dev/config/
export default defineConfig({
  build: {
    target: 'chrome89',
  },
  plugins: [
    federation({
      name: 'cart',
      filename: 'remoteEntry.js',
      exposes: {
        './Cart': './src/lib/Cart.svelte',
      },
      remotes: {
        products: {
          type: 'module',
          name: 'products',
          entry: 'http://localhost:3001/mf-manifest.json',
          entryGlobalName: 'products',
          shareScope: 'default',
        },
      },
      shared: {
        svelte: {
          singleton: true,
        },
      },
    }),
    svelte(),
  ],
  server: {
    port: 3002,
    cors: true,
  },
})