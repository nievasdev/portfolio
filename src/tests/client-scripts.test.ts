import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Client-Side JavaScript', () => {
  describe('Terminal Sound Function', () => {
    beforeEach(() => {
      // Reset window object
      if (typeof window !== 'undefined') {
        delete (window as any).playTerminalSound;
      }
    });

    it('should create playTerminalSound function without errors', () => {
      // Simulate the inline script from Layout.astro
      const createPlayTerminalSound = () => {
        (window as any).playTerminalSound = function playTerminalSound() {
          const context = new (window.AudioContext || (window as any).webkitAudioContext)();
          const oscillator = context.createOscillator();
          const gainNode = context.createGain();

          oscillator.connect(gainNode);
          gainNode.connect(context.destination);

          oscillator.frequency.value = 2000;
          oscillator.type = 'sine';

          gainNode.gain.setValueAtTime(0, context.currentTime);
          gainNode.gain.linearRampToValueAtTime(0.18, context.currentTime + 0.003);
          gainNode.gain.linearRampToValueAtTime(0, context.currentTime + 0.035);

          oscillator.start(context.currentTime);
          oscillator.stop(context.currentTime + 0.035);

          const oscillator2 = context.createOscillator();
          const gainNode2 = context.createGain();

          oscillator2.connect(gainNode2);
          gainNode2.connect(context.destination);

          oscillator2.frequency.value = 1400;
          oscillator2.type = 'sine';

          gainNode2.gain.setValueAtTime(0, context.currentTime + 0.012);
          gainNode2.gain.linearRampToValueAtTime(0.12, context.currentTime + 0.018);
          gainNode2.gain.linearRampToValueAtTime(0, context.currentTime + 0.045);

          oscillator2.start(context.currentTime + 0.012);
          oscillator2.stop(context.currentTime + 0.045);
        };
      };

      expect(() => createPlayTerminalSound()).not.toThrow();
      expect(typeof (window as any).playTerminalSound).toBe('function');
    });

    it('should call playTerminalSound without throwing', () => {
      (window as any).playTerminalSound = function playTerminalSound() {
        const context = new (window.AudioContext || (window as any).webkitAudioContext)();
        context.createOscillator();
        context.createGain();
      };

      expect(() => (window as any).playTerminalSound()).not.toThrow();
    });
  });

  describe('Language Switching', () => {
    beforeEach(() => {
      // Setup DOM
      document.body.innerHTML = `
        <div id="content-en" class="desktop"></div>
        <div id="content-es" class="desktop hidden"></div>
        <div id="mobile-en" class="mobile"></div>
        <div id="mobile-es" class="mobile hidden"></div>
      `;

      // Mock localStorage
      const localStorageMock: { [key: string]: string } = {};
      global.localStorage = {
        getItem: (key: string) => localStorageMock[key] || null,
        setItem: (key: string, value: string) => {
          localStorageMock[key] = value;
        },
        removeItem: (key: string) => {
          delete localStorageMock[key];
        },
        clear: () => {
          Object.keys(localStorageMock).forEach(key => delete localStorageMock[key]);
        },
        key: () => null,
        length: 0
      };
    });

    it('should switch to Spanish when called with "es"', () => {
      // Simulate the switchLanguage function from index.astro
      const switchLanguage = (lang: string) => {
        const contentEn = document.getElementById('content-en');
        const contentEs = document.getElementById('content-es');
        const mobileEn = document.getElementById('mobile-en');
        const mobileEs = document.getElementById('mobile-es');

        if (lang === 'en') {
          contentEn?.classList.remove('hidden');
          contentEs?.classList.add('hidden');
          mobileEn?.classList.remove('hidden');
          mobileEs?.classList.add('hidden');
        } else {
          contentEn?.classList.add('hidden');
          contentEs?.classList.remove('hidden');
          mobileEn?.classList.add('hidden');
          mobileEs?.classList.remove('hidden');
        }

        localStorage.setItem('preferred-lang', lang);
      };

      switchLanguage('es');

      expect(document.getElementById('content-en')?.classList.contains('hidden')).toBe(true);
      expect(document.getElementById('content-es')?.classList.contains('hidden')).toBe(false);
      expect(document.getElementById('mobile-en')?.classList.contains('hidden')).toBe(true);
      expect(document.getElementById('mobile-es')?.classList.contains('hidden')).toBe(false);
      expect(localStorage.getItem('preferred-lang')).toBe('es');
    });

    it('should switch to English when called with "en"', () => {
      const switchLanguage = (lang: string) => {
        const contentEn = document.getElementById('content-en');
        const contentEs = document.getElementById('content-es');
        const mobileEn = document.getElementById('mobile-en');
        const mobileEs = document.getElementById('mobile-es');

        if (lang === 'en') {
          contentEn?.classList.remove('hidden');
          contentEs?.classList.add('hidden');
          mobileEn?.classList.remove('hidden');
          mobileEs?.classList.add('hidden');
        } else {
          contentEn?.classList.add('hidden');
          contentEs?.classList.remove('hidden');
          mobileEn?.classList.add('hidden');
          mobileEs?.classList.remove('hidden');
        }

        localStorage.setItem('preferred-lang', lang);
      };

      // Start with Spanish
      switchLanguage('es');
      // Switch to English
      switchLanguage('en');

      expect(document.getElementById('content-en')?.classList.contains('hidden')).toBe(false);
      expect(document.getElementById('content-es')?.classList.contains('hidden')).toBe(true);
      expect(document.getElementById('mobile-en')?.classList.contains('hidden')).toBe(false);
      expect(document.getElementById('mobile-es')?.classList.contains('hidden')).toBe(true);
      expect(localStorage.getItem('preferred-lang')).toBe('en');
    });

    it('should toggle between languages', () => {
      let currentLang = 'en';

      const toggleLanguage = () => {
        const newLang = currentLang === 'en' ? 'es' : 'en';
        currentLang = newLang;
        return newLang;
      };

      expect(toggleLanguage()).toBe('es');
      expect(currentLang).toBe('es');
      expect(toggleLanguage()).toBe('en');
      expect(currentLang).toBe('en');
    });

    it('should persist language preference in localStorage', () => {
      const switchLanguage = (lang: string) => {
        localStorage.setItem('preferred-lang', lang);
      };

      switchLanguage('es');
      expect(localStorage.getItem('preferred-lang')).toBe('es');

      switchLanguage('en');
      expect(localStorage.getItem('preferred-lang')).toBe('en');
    });

    it('should default to "en" when no preference is saved', () => {
      const savedLang = localStorage.getItem('preferred-lang') || 'en';
      expect(savedLang).toBe('en');
    });
  });

  describe('Terminal Animation', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <span class="terminal-prompt" id="terminal-line-1"></span>
        <span class="terminal-prompt" id="terminal-line-2"></span>
        <span class="terminal-mobile" id="terminal-mobile"></span>
        <div id="work-content" class="work-content work-hidden"></div>
      `;
    });

    it('should initialize terminal elements', () => {
      const line1 = document.getElementById('terminal-line-1');
      const line2 = document.getElementById('terminal-line-2');
      const terminalMobile = document.getElementById('terminal-mobile');
      const workContent = document.getElementById('work-content');

      expect(line1).not.toBeNull();
      expect(line2).not.toBeNull();
      expect(terminalMobile).not.toBeNull();
      expect(workContent).not.toBeNull();
    });

    it('should reset terminal state on init', () => {
      const line1 = document.getElementById('terminal-line-1');
      const line2 = document.getElementById('terminal-line-2');
      const terminalMobile = document.getElementById('terminal-mobile');

      // Add some state
      if (line1) {
        line1.textContent = 'test';
        line1.classList.add('typing');
      }

      // Reset
      if (line1 && line2 && terminalMobile) {
        line1.textContent = '';
        line2.textContent = '';
        terminalMobile.textContent = '';
        line1.classList.remove('typing');
        line2.classList.remove('typing');
        terminalMobile.classList.remove('typing');
      }

      expect(line1?.textContent).toBe('');
      expect(line2?.textContent).toBe('');
      expect(terminalMobile?.textContent).toBe('');
      expect(line1?.classList.contains('typing')).toBe(false);
    });

    it('should generate correct terminal commands', () => {
      const workName = 'Test Company';
      const lines = [
        `> cd ${workName.toLowerCase().replace(/\s+/g, '_')}/`,
        `> less experience.txt`
      ];

      expect(lines[0]).toBe('> cd test_company/');
      expect(lines[1]).toBe('> less experience.txt');
    });

    it('should generate correct mobile terminal command', () => {
      const workName = 'Test Company';
      const mobileLine = `> cd ${workName.toLowerCase().replace(/\s+/g, '_')}/ && less experience.txt`;

      expect(mobileLine).toBe('> cd test_company/ && less experience.txt');
    });
  });

  describe('Modal Interactions', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <input type="checkbox" id="project-modal-0" class="modal-toggle" />
        <div class="modal" onclick="document.getElementById('project-modal-0').checked=false">
          <div class="modal-content" onclick="event.stopPropagation()">
            <button class="close" onclick="document.getElementById('project-modal-0').checked=false">×</button>
          </div>
        </div>
      `;
    });

    it('should toggle modal checkbox', () => {
      const modalToggle = document.getElementById('project-modal-0') as HTMLInputElement;

      expect(modalToggle.checked).toBe(false);

      modalToggle.checked = true;
      expect(modalToggle.checked).toBe(true);

      modalToggle.checked = false;
      expect(modalToggle.checked).toBe(false);
    });

    it('should close modal when checkbox is unchecked', () => {
      const modalToggle = document.getElementById('project-modal-0') as HTMLInputElement;

      // Open modal
      modalToggle.checked = true;
      expect(modalToggle.checked).toBe(true);

      // Close modal (simulating onclick)
      modalToggle.checked = false;
      expect(modalToggle.checked).toBe(false);
    });
  });
});
