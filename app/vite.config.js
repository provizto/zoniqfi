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
    // Menyusupkan inisialisasi global ke HTML secara aman tanpa merusak build
    {
      name: 'solana-production-fix',
      transformIndexHtml(html) {
        return html.replace(
          '<head>',
          `<head>
          <script>
            window.global = window;
            window.process = { env: {} };
          </script>`
        );
      },
    },
  ],
  define: {
    // Memberikan proteksi cadangan di level compiler global
    'global': 'globalThis',
  }
})