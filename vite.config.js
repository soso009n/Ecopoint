// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'EcoPoint Bank Sampah',
        short_name: 'EcoPoint',
        theme_color: '#ffffff',
      }
    })
  ],
  // TAMBAHKAN BAGIAN INI
  server: {
    host: true, // Mengizinkan akses dari IP Network (LAN)
    port: 5173, // Port default (bisa diganti jika bentrok)
  }
})