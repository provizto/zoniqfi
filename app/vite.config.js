import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        manualChunks: {
          solana: ['@solana/web3.js'],
          supabase: ['@supabase/supabase-js'],
        },
      },
    },
  },
})