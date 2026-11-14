import { describe, it, expect } from 'vitest';
import { LOGO_SPRITE_URL, logoHref, logoId, logoShape, logoSprite, logoStyle, logoSvg, logoSymbol } from '../lib/logos';

const URULEYES = '/logo_uruleyes.svg';
const MISSING = '/logo_does-not-exist.svg';
const URULEYES_DRAWING =
  '<path fill="currentColor" d="M5,10.5V190.5A90.75,90.75 0 0 0 186.5,190.5V10.5H135V190.5A39.5,39.5 0 0 1 56,190.5V10.5ZM201,75h51v148h-51z"/>' +
  '<path fill="#9C7A24" d="M191.3,237.5H323.5V273.6H162.2A106.6,106.6 0 0 0 191.3,237.5Z"/>';
const URULEYES_SYMBOL = `<symbol id="logo-uruleyes" viewBox="0 0 331 286">${URULEYES_DRAWING}</symbol>`;

describe('logoSvg: logo incrustado (CA-23)', () => {
  it('devuelve el SVG del archivo en public/', () => {
    expect(logoSvg(URULEYES)).toBe(`<svg viewBox="0 0 331 286" xmlns="http://www.w3.org/2000/svg">${URULEYES_DRAWING}</svg>\n`);
  });

  it('devuelve undefined si el archivo no existe', () => {
    expect(logoSvg(MISSING)).toBeUndefined();
  });
});

describe('logoSymbol: logo reutilizable con <use> (CA-14)', () => {
  it('envuelve exactamente el dibujo en un <symbol> con el id y el viewBox del archivo', () => {
    expect(logoSymbol(URULEYES, 'logo-uruleyes')).toBe(URULEYES_SYMBOL);
  });

  it('devuelve undefined si el archivo no existe', () => {
    expect(logoSymbol(MISSING, 'logo-x')).toBeUndefined();
  });
});

describe('logoShape: todos los logos pesan lo mismo a la vista (R-41, CA-39)', () => {
  const COMPANY_LOGOS = ['/logo_ancel.svg', '/logo_gestionTotal.svg', '/logo_hacknoid.svg', '/logo_upshow.svg', URULEYES];

  it('da el ancho y el alto, relativos a un cuadrado de lado 1, con su proporción', () => {
    // Uruleyes: viewBox 331 × 286, más ancho que alto
    expect(logoShape(URULEYES)).toEqual({ width: 1.076, height: 0.93 });
    // Antel: viewBox 232 × 275.3, más alto que ancho
    expect(logoShape('/logo_ancel.svg')).toEqual({ width: 0.918, height: 1.089 });
  });

  it('todos ocupan la misma superficie que el cuadrado', () => {
    COMPANY_LOGOS.forEach((path) => {
      const { width, height } = logoShape(path)!;
      expect(width * height, path).toBeCloseTo(1, 2);
    });
  });

  it('devuelve undefined si el archivo no existe', () => {
    expect(logoShape(MISSING)).toBeUndefined();
  });

  it('se lo pasa al CSS como --lw y --lh', () => {
    expect(logoStyle(URULEYES)).toBe('--lw:1.076; --lh:0.93');
    expect(logoStyle(MISSING)).toBeUndefined();
  });
});

describe('sprite de logos (R-45)', () => {
  it('el id de un logo sale del nombre de su archivo', () => {
    expect(logoId('/logo_gestionTotal.svg')).toBe('logo-gestionTotal');
  });

  it('cada logo se dibuja desde /logos.svg con su id', () => {
    expect(LOGO_SPRITE_URL).toBe('/logos.svg');
    expect(logoHref('/logo_ancel.svg')).toBe('/logos.svg#logo-ancel');
  });

  it('el sprite tiene todos los logos, en orden de archivo', () => {
    const ids = [...logoSprite().matchAll(/<symbol id="([^"]+)"/g)].map(([, id]) => id);
    expect(ids).toEqual(['logo-ancel', 'logo-gestionTotal', 'logo-hacknoid', 'logo-upshow', 'logo-uruleyes']);
  });

  it('el sprite es un SVG con los símbolos exactos, uno detrás del otro', () => {
    const files = ['/logo_ancel.svg', '/logo_gestionTotal.svg', '/logo_hacknoid.svg', '/logo_upshow.svg', URULEYES];
    const symbols = files.map((path) => logoSymbol(path, logoId(path))).join('');
    expect(logoSprite()).toBe(`<svg xmlns="http://www.w3.org/2000/svg">${symbols}</svg>`);
    expect(logoSprite().endsWith(`${URULEYES_SYMBOL}</svg>`)).toBe(true);
  });
});
