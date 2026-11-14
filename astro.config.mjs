// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://nievas.dev',
  output: 'static',
  vite: {
    build: {
      minify: 'esbuild',
      // Not lightningcss: it folds animation-timeline into the `animation` shorthand,
      // which browsers reject, so every scroll-driven animation silently disappears in production.
      cssMinify: 'esbuild'
    }
  },
  build: {
    // Inline CSS pequeño directamente en HTML
    inlineStylesheets: 'always',
    assets: '_assets'
  },
  compressHTML: true
});
