// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://portfolio-maurojs-projects.vercel.app',
  output: 'static',
  vite: {
    plugins: [],
    build: {
      // Minificación agresiva
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log'],
          reduce_vars: true,
          reduce_funcs: true,
          hoist_funs: true,
          hoist_vars: true,
          if_return: true,
          join_vars: true,
          cascade: true,
          collapse_vars: true,
          evaluate: true,
          loops: true,
          unsafe: true,
          unsafe_comps: true,
          unsafe_math: true,
          unsafe_proto: true,
          conditionals: true,
          dead_code: true,
          booleans: true,
          unused: true,
          toplevel: true,
          top_retain: false,
          properties: true
        },
        mangle: {
          toplevel: true,
          safari10: true
        },
        format: {
          comments: false
        }
      },
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