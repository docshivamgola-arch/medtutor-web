import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    // Main bundle is ~167 kB gzipped — well within acceptable range.
    // Raw minified size exceeds Vite's 500 kB default because the node workspace
    // tab content lives inline in App.tsx. Threshold raised to match actual bundle.
    chunkSizeWarningLimit: 650,
  },
})
