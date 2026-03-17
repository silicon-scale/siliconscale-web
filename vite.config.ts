import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
  },
  build: {
    esbuild: {
      drop: ['console', 'debugger'],
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['framer-motion'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['masked-icon.svg', 'site.webmanifest', 'robots.txt', 'sitemap.xml'],
      manifest: {
        name: 'SiliconScale',
        short_name: 'SiliconScale',
        description: 'Creative technology agency for modern digital experiences',
        theme_color: '#000000',
        background_color: '#000000',
        display: 'standalone',
        icons: [
          {
            src: 'masked-icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      }
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
