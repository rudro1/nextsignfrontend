import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5001', // Apnar backend port
        changeOrigin: true,
        secure: false,
      }
    }
  },
  optimizeDeps: {
    include: ['pdfjs-dist'], // ✅ PDF worker support er jonno eita dorkar
  },
  build: {
    // Eita add korle worker bundle korte Vite-er subidha hoy
    rollupOptions: {
      output: {
        manualChunks: {
          pdfjsWorker: ['pdfjs-dist/build/pdf.worker.mjs'],
        },
      },
    },
  },
})