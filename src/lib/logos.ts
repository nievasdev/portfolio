// Logos live in public/logo_*.svg (fill="currentColor", so they follow the theme).
// Pages reference them from one sprite, /logos.svg, with <use>: the HTML stays small and the
// sprite is cached like any image. A page's lead logo may still be inlined with `logoSvg`.
import ink from './logo-ink.json';

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

// Fraction of each logo's box that is painted, measured by scripts/measure-logos.mjs.
export const LOGO_INK: Record<string, number> = ink;

// A logo looks as big as its area times the square root of its ink: a mostly painted box ("UP")
// weighs more than a light glyph (Antel's "a") of the same size, but not proportionally more.
// Equal weight for every logo means scaling each side by ink^(-1/4).
const INK_WEIGHT_EXPONENT = -0.25;

const roundTo3 = (n: number) => Math.round(n * 1000) / 1000;

// Size before normalizing: area 1 at full ink, stretched to the logo's proportions.
function weightedShape(path: string): LogoShape | undefined {
  const svg = logoSvg(path);
  if (!svg) return undefined;
  // SVGO writes the viewBox with single spaces
  const [, , width, height] = viewBoxOf(svg).split(' ').map(Number);
  const stretch = Math.sqrt(width / height);
  const size = LOGO_INK[path] ** INK_WEIGHT_EXPONENT;
  return { width: size * stretch, height: size / stretch };
}

// Sizes for a set of logos shown together, so they all look equally big: relative to the tallest,
// which measures 1 (CSS multiplies by the height each place has, e.g. the text beside them).
// Files that don't exist are left out.
export function logoShapes(paths: string[]): Map<string, LogoShape> {
  const shapes = paths.flatMap((path) => {
    const shape = weightedShape(path);
    return shape ? [[path, shape] as const] : [];
  });
  const tallest = Math.max(...shapes.map(([, shape]) => shape.height));
  return new Map(shapes.map(([path, { width, height }]) => [path, { width: roundTo3(width / tallest), height: roundTo3(height / tallest) }]));
}

// The same, as the CSS custom properties `.co-mini` and `.seg-logo` read (--lw, --lh).
export function logoStyles(paths: string[]): Map<string, string> {
  return new Map([...logoShapes(paths)].map(([path, { width, height }]) => [path, `--lw:${width}; --lh:${height}`]));
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
