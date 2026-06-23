import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      // Mengaktifkan seluruh polyfill global esensial untuk ekosistem Web3
      include: ['buffer', 'crypto', 'stream', 'util', 'process'],
      globals: {
        Buffer: true,
        process: true,
        global: true,
      },
    }),
  ],
  resolve: {
    alias: {
      // Mengunci pemetaan modul ke versi browser-safe secara mutlak
      buffer: 'vite-plugin-node-polyfills/shims/buffer',
      crypto: 'vite-plugin-node-polyfills/shims/crypto',
      process: 'vite-plugin-node-polyfills/shims/process',
    },
  },
  define: {
    // Menyediakan fallback objek global tingkat runtime
    'global': 'globalThis',
  },
  build: {
    // Mencegah Vite membuang fungsi polyfill saat optimasi produksi (tree-shaking)
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
})