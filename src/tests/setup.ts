import { expect, beforeAll, afterEach } from 'vitest';

// Clean up after each test
afterEach(() => {
  // Reset DOM if needed
  if (typeof document !== 'undefined') {
    document.body.innerHTML = '';
  }
});

// Setup global test environment
beforeAll(() => {
  // Mock window.AudioContext for terminal sound tests
  if (typeof window !== 'undefined') {
    window.AudioContext = window.AudioContext || class AudioContext {
      createOscillator() {
        return {
          connect: () => {},
          disconnect: () => {},
          start: () => {},
          stop: () => {},
          frequency: { value: 0 },
          type: 'sine'
        };
      }
      createGain() {
        return {
          connect: () => {},
          disconnect: () => {},
          gain: {
            setValueAtTime: () => {},
            linearRampToValueAtTime: () => {}
          }
        };
      }
      get destination() {
        return {};
      }
      get currentTime() {
        return 0;
      }
    } as any;
  }
});
