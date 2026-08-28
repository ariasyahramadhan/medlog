import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'icons/*.png'],
      manifest: {
        name: 'MedLog Anestesiologi UNRI',
        short_name: 'MedLog',
        description: 'Logbook & Presensi Residen Anestesiologi UNRI',
        theme_color: '#003178',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait-primary',
        start_url: '/login',
        scope: '/',
        icons: [
          {
            src: '/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable',
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        // Cache semua asset statis kecuali file gambar besar
        globPatterns: ['**/*.{js,css,html,ico,svg,woff2}'],
        // Ignore file PNG/JPG besar (gambar FK yang >2MB)
        globIgnores: ['**/fk*.png', '**/fk*.jpg', '**/*.ttf'],
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024, // 4MB limit
        // Jangan cache API calls
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.sigmaeducation\.id\/api\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: { maxEntries: 50, maxAgeSeconds: 300 },
            },
          },
        ],
      },
    }),
  ],
})
