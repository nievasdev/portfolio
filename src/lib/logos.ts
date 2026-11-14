// Company logos live in public/logo_*.svg (fill="currentColor"). They are inlined, never requested.
const raw = import.meta.glob('../../public/logo_*.svg', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

export function logoSvg(path: string): string | undefined {
  return raw[`../../public${path}`];
}

// Turns a logo file into a <symbol> so a page can define it once and <use> it many times.
export function logoSymbol(path: string, id: string): string | undefined {
  const svg = logoSvg(path);
  if (!svg) return undefined;
  // Every logo file is a single <svg> with a viewBox; keep what is between its tags.
  const viewBox = svg.match(/viewBox="([^"]+)"/)![1];
  const inner = svg.slice(svg.indexOf('>') + 1, svg.lastIndexOf('</svg>'));
  return `<symbol id="${id}" viewBox="${viewBox}">${inner}</symbol>`;
}
