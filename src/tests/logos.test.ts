import { describe, it, expect } from 'vitest';
import { logoSvg, logoSymbol } from '../lib/logos';

const URULEYES = '/logo_uruleyes.svg';
const MISSING = '/logo_does-not-exist.svg';
const URULEYES_DRAWING =
  '<path fill="currentColor" d="M5,10.5V190.5A90.75,90.75 0 0 0 186.5,190.5V10.5H135V190.5A39.5,39.5 0 0 1 56,190.5V10.5ZM201,75h51v148h-51z"/>' +
  '<path fill="#9C7A24" d="M191.3,237.5H323.5V273.6H162.2A106.6,106.6 0 0 0 191.3,237.5Z"/>';

describe('logoSvg: logo incrustado (CA-23)', () => {
  it('devuelve el SVG del archivo en public/', () => {
    expect(logoSvg(URULEYES)).toBe(`<svg viewBox="0 0 331 286" xmlns="http://www.w3.org/2000/svg">${URULEYES_DRAWING}</svg>\n`);
  });

  it('devuelve undefined si el archivo no existe', () => {
    expect(logoSvg(MISSING)).toBeUndefined();
  });
});

describe('logoSymbol: logo definido una vez y reutilizable (CA-14)', () => {
  it('envuelve exactamente el dibujo en un <symbol> con el id y el viewBox del archivo', () => {
    expect(logoSymbol(URULEYES, 'logo-uruleyes')).toBe(
      `<symbol id="logo-uruleyes" viewBox="0 0 331 286">${URULEYES_DRAWING}</symbol>`,
    );
  });

  it('devuelve undefined si el archivo no existe', () => {
    expect(logoSymbol(MISSING, 'logo-x')).toBeUndefined();
  });
});
