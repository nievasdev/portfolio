// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://portfolio-maurojs-projects.vercel.app',
  output: 'static',
  vite: {
    plugins: [],
    build: {
      minify: 'esbuild',
      // Optimización de chunks
      rollupOptions: {
        output: {
          manualChunks: undefined,
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name.split('.');
            const ext = info[info.length - 1];
            if (/\.(css)$/.test(assetInfo.name)) {
              return `[name][extname]`;
            }
            if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name)) {
              return `[name][extname]`;
            }
            return `[name][extname]`;
          },
          chunkFileNames: '[name].js',
          entryFileNames: '[name].js'
        }
      }
    }
  },
  build: {
    // Inline CSS pequeño directamente en HTML
    inlineStylesheets: 'always',
    // Optimización de assets
    assets: '_assets'
  },
  compressHTML: true,
  // Minificación de HTML
  html: {
    minify: true
  }
});