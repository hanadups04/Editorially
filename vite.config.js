import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), 
    VitePWA({
      registerType: "prompt",
      manifest: {
        name: "Editorially",
        short_name: "Booger",
        start_url: ".",
        display:'standalone',
        background_color: "#ecb4ca",
        theme_color: "#000000",
        icons: [
          {
            src: "/icons/small.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icons/big.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 6 * 1024 * 1024,
      },
    })
  ],
  build: {
    outDir: "build", // This line tells Vite to output to the 'build' directory.
  },
})
