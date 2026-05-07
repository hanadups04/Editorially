import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), 
    VitePWA({
      registerType: "prompt",
      manifest: {
        
      }
    })
  ],
  build: {
    outDir: "build", // This line tells Vite to output to the 'build' directory.
  },
})
