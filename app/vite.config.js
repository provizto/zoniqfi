import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'

export default defineConfig({
  plugins: [react()],
  envPrefix: 'VITE_',
  define: {
    // Menyediakan fallback global instan di browser produksi Vercel
    'global': 'globalThis',
    'process.env': {}
  },
  optimizeDeps: {
    esbuildOptions: {
      // Mengaktifkan polyfill Node.js pada fase pengembangan awal
      plugins: [
        NodeGlobalsPolyfillPlugin({
          process: true,
          buffer: true
        })
      ]
    }
  },
  build: {
    // Memaksa esbuild menyuntikkan Buffer secara absolut ke dalam file akhir (dist)
    rollupOptions: {
      plugins: [
        NodeGlobalsPolyfillPlugin({
          process: true,
          buffer: true
        })
      ]
    },
    commonjsOptions: {
      transformMixedEsModules: true
    }
  }
})