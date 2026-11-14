import { afterEach } from 'vitest';

// Clean up after each test
afterEach(() => {
  if (typeof document !== 'undefined') {
    document.body.innerHTML = '';
  }
});
