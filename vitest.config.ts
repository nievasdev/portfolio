import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    globals: true,
    // No test needs a DOM; node keeps the suite (and every Stryker mutant run) fast.
    environment: 'node',
    // Some tests build real PDFs; under Stryker's parallel load they need more than 5 s.
    testTimeout: 30000,
    setupFiles: ['./src/tests/setup.ts'],
    include: ['src/**/*.{test,spec}.{js,ts}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/tests/',
        'dist/',
        '**/*.config.{js,ts}',
        '**/*.d.ts'
      ]
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      // Astro's virtual module does not exist outside Astro; tests swap in a fake they control.
      'astro:content': resolve(__dirname, './src/tests/fakes/astro-content.ts')
    }
  }
});
