import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      // Mengaktifkan polyfills untuk modul spesifik yang dibutuhkan Solana Web3 SDK
      globals: {
        Buffer: true, // Sangat krusial untuk transaksi dan keypair Solana
        process: true,
      },
    }),
  ],
})