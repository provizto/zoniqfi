import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vitejs.dev/config/
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
      // Memaksa sistem alias membaca modul buffer eksternal dengan aman saat produksi
      buffer: 'buffer/',
    },
  },
  define: {
    // Menyediakan cadangan variabel global jika struktur Solana Web3 membutuhkannya secara mendadak
    'global': 'globalThis',
  },
})