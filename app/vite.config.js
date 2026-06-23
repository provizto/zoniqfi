import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      globals: {
        Buffer: true,
        process: true,
      },
    }),
  ],
  resolve: {
    alias: {
      // Mengarahkan langsung ke distribusi internal paket buffer yang stabil
      buffer: 'buffer',
    },
  },
  define: {
    // Solana Web3.js membutuhkan penegasan objek global di level browser produksi
    'global': 'globalThis',
  },
  build: {
    // Memaksa sistem untuk tidak membuang modul polyfill saat optimasi produksi
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
})