import { describe, it, expect } from 'vitest';
import { LOGO_INK, LOGO_SPRITE_URL, logoHref, logoId, logoShapes, logoSprite, logoStyles, logoSvg, logoSymbol } from '../lib/logos';

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

describe('logoShapes: todos los logos se ven igual de grandes (R-41, CA-39)', () => {
  const ANTEL = '/logo_ancel.svg';
  const UPSHOW = '/logo_upshow.svg';
  const COMPANIES = [ANTEL, '/logo_gestionTotal.svg', '/logo_hacknoid.svg', UPSHOW];
  const ratio = (path: string) => {
    const [, , w, h] = logoSvg(path)!.match(/viewBox="([^"]+)"/)![1].split(' ').map(Number);
    return w / h;
  };

  it('un logo solo llena el alto y conserva la proporción de su viewBox', () => {
    // Uruleyes: viewBox 331 × 286
    expect(logoShapes([URULEYES]).get(URULEYES)).toEqual({ width: 1.157, height: 1 });
  });

  it('en un conjunto, el más alto mide 1 y cada uno conserva su proporción', () => {
    const shapes = logoShapes(COMPANIES);
    expect(Math.max(...[...shapes.values()].map((s) => s.height))).toBe(1);
    COMPANIES.forEach((path) => {
      const { width, height } = shapes.get(path)!;
      expect(width / height, path).toBeCloseTo(ratio(path), 2);
    });
  });

  it('pesan lo mismo: superficie × √tinta es igual para todos', () => {
    const shapes = logoShapes(COMPANIES);
    const weight = (path: string) => shapes.get(path)!.width * shapes.get(path)!.height * Math.sqrt(LOGO_INK[path]);
    COMPANIES.forEach((path) => expect(weight(path), path).toBeCloseTo(weight(ANTEL), 2));
  });

  it('el liviano se dibuja más grande que el pintado: la «a» de Antel más alta que «UP»', () => {
    const shapes = logoShapes(COMPANIES);
    expect(shapes.get(ANTEL)!.height).toBe(1);
    expect(shapes.get(UPSHOW)!.height).toBeLessThan(0.75);
  });

  it('deja afuera los archivos que no existen', () => {
    expect([...logoShapes([URULEYES, MISSING]).keys()]).toEqual([URULEYES]);
  });

  it('se lo pasa al CSS como --lw y --lh', () => {
    expect(logoStyles([URULEYES, MISSING])).toEqual(new Map([[URULEYES, '--lw:1.157; --lh:1']]));
  });
});

describe('tinta de los logos (scripts/measure-logos.mjs)', () => {
  it('cada logo tiene su fracción pintada medida, entre 0 y 1', () => {
    logoSprite().match(/id="logo-[^"]+"/g)!.forEach((id) => {
      const path = `/logo_${id.slice('id="logo-'.length, -1)}.svg`;
      expect(LOGO_INK[path], path).toBeGreaterThan(0);
      expect(LOGO_INK[path], path).toBeLessThan(1);
    });
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
