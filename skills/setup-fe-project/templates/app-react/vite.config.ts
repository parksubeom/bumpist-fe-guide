import { fileURLToPath, URL } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // `ANALYZE=true vite build` opens an interactive treemap of the production bundle.
    process.env.ANALYZE === 'true' &&
      visualizer({ open: true, gzipSize: true, brotliSize: true, filename: 'dist/stats.html' }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
