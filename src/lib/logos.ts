// Logos live in public/logo_*.svg (fill="currentColor", so they follow the theme).
// Pages reference them from one sprite, /logos.svg, with <use>: the HTML stays small and the
// sprite is cached like any image. A page's lead logo may still be inlined with `logoSvg`.
const PUBLIC_PREFIX = '../../public';
const FILE_PREFIX = '/logo_';
const FILE_EXTENSION = '.svg';
const raw = import.meta.glob('../../public/logo_*.svg', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

export const LOGO_SPRITE_URL = '/logos.svg';

export function logoSvg(path: string): string | undefined {
  return raw[`${PUBLIC_PREFIX}${path}`];
}

// "/logo_ancel.svg" → "logo-ancel": the symbol's id inside the sprite.
export function logoId(path: string): string {
  return `logo-${path.slice(FILE_PREFIX.length, -FILE_EXTENSION.length)}`;
}

// Where a <use> points to draw a logo from the sprite.
export function logoHref(path: string): string {
  return `${LOGO_SPRITE_URL}#${logoId(path)}`;
}

// Every logo file is a single <svg> with a viewBox.
function viewBoxOf(svg: string): string {
  return svg.match(/viewBox="([^"]+)"/)![1];
}

export interface LogoShape {
  width: number;
  height: number;
}

const roundTo3 = (n: number) => Math.round(n * 1000) / 1000;

// Size of a logo relative to a square of side 1, keeping its proportions and that square's area:
// a wide logo gets shorter and a tall one narrower, so no logo looks bigger than the rest.
export function logoShape(path: string): LogoShape | undefined {
  const svg = logoSvg(path);
  if (!svg) return undefined;
  // SVGO writes the viewBox with single spaces
  const [, , width, height] = viewBoxOf(svg).split(' ').map(Number);
  const stretch = Math.sqrt(width / height);
  return { width: roundTo3(stretch), height: roundTo3(1 / stretch) };
}

// The shape as CSS custom properties; `.co-mini` and `.seg-logo` multiply them by their --logo side.
export function logoStyle(path: string): string | undefined {
  const shape = logoShape(path);
  return shape && `--lw:${shape.width}; --lh:${shape.height}`;
}

// Turns a logo file into a <symbol> so it can be drawn many times with <use>.
export function logoSymbol(path: string, id: string): string | undefined {
  const svg = logoSvg(path);
  if (!svg) return undefined;
  // Keep what is between the <svg> tags.
  const viewBox = viewBoxOf(svg);
  const inner = svg.slice(svg.indexOf('>') + 1, svg.lastIndexOf('</svg>'));
  return `<symbol id="${id}" viewBox="${viewBox}">${inner}</symbol>`;
}

// Every logo as one SVG sprite, in file-name order (import.meta.glob already sorts them).
export function logoSprite(): string {
  const symbols = Object.keys(raw)
    .map((file) => file.slice(PUBLIC_PREFIX.length))
    .map((path) => logoSymbol(path, logoId(path)))
    .join('');
  return `<svg xmlns="http://www.w3.org/2000/svg">${symbols}</svg>`;
}
