// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://portfolio-maurojs-projects.vercel.app',
  output: 'static',
  vite: {
    build: {
      minify: 'esbuild',
      cssMinify: 'lightningcss'
    }
  },
  build: {
    // Inline CSS pequeño directamente en HTML
    inlineStylesheets: 'always',
    assets: '_assets'
  },
  compressHTML: true
});
