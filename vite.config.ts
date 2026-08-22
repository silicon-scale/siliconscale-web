import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { VitePWA } from 'vite-plugin-pwa';
import { imagetools } from 'vite-imagetools';

/**
 * Plain `vite` (`pnpm dev`) serves `/api/*` as transformed TypeScript source,
 * which breaks `res.json()` in the blog/admin clients. Intercept those routes
 * with a clear JSON error; use `pnpm dev:full` (vercel dev) for real API handlers.
 */
function apiRoutesRequireVercelDev(): Plugin {
  return {
    name: 'api-routes-require-vercel-dev',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const pathname = req.url?.split('?')[0] ?? ''
        if (!pathname.startsWith('/api/')) {
          next()
          return
        }
        res.statusCode = 503
        res.setHeader('Content-Type', 'application/json; charset=utf-8')
        res.end(
          JSON.stringify({
            error:
              'API routes are unavailable under `pnpm dev` (Vite only). Stop that process and run `pnpm dev:full` so Vercel serves /api/*.',
          }),
        )
      })
    },
  }
}

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
    apiRoutesRequireVercelDev(),
    imagetools({
      // `?responsive` imports → AVIF+WebP variants at 800/1400/2000w consumed
      // by <OptimizedImage> as a <picture>. Plain imports are untouched.
      defaultDirectives: (url) => {
        if (url.searchParams.has('responsive')) {
          return new URLSearchParams('w=800;1400;2000&format=avif;webp&as=picture')
        }
        return new URLSearchParams()
      },
    }),
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.ico',
        'favicon-16x16.png',
        'favicon-32x32.png',
        'apple-touch-icon.png',
        'android-chrome-192x192.png',
        'android-chrome-512x512.png',
        'site.webmanifest',
        'robots.txt',
        'llms.txt',
        'og-image.png',
      ],
      workbox: {
        // Don't serve the SPA shell for API/meta routes (was causing React 404 on /sitemap.xml)
        navigateFallbackDenylist: [
          /^\/api\//,
          /\/sitemap\.xml$/i,
          /\/robots\.txt$/i,
          /\/llms\.txt$/i,
        ],
      },
      manifest: {
        name: 'SiliconScale',
        short_name: 'SiliconScale',
        description: 'Creative technology agency for modern digital experiences',
        theme_color: '#000000',
        background_color: '#000000',
        display: 'standalone',
        icons: [
          {
            src: 'android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
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
