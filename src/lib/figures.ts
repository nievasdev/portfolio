// The hero's figures count up on load (Hero.astro + CSS counters). CSS can only count integers,
// so a figure is split into what surrounds the number and the number's whole and decimal parts:
// "3,5M" → "" · 3 · "," · 5 · "M". Each part keeps its language's own format.
export interface FigureParts {
  prefix: string;
  integer: number;
  separator: string;
  fraction: number | undefined;
  suffix: string;
}

// Non-digits, an integer, optionally "." or "," and ONE decimal, non-digits; nothing else.
// One decimal only: a CSS counter shows "05" as "5", so "1.05" would count to the wrong value.
const FIGURE = /^(\D*)(\d+)(?:([.,])(\d))?(\D*)$/;

// undefined when the value is not a single number (a word like "Uruleyes" is shown as it is).
export function figureParts(value: string): FigureParts | undefined {
  const match = value.match(FIGURE);
  if (!match) return undefined;
  const [, prefix, integer, separator = '', fraction, suffix] = match;
  return { prefix, integer: Number(integer), separator, fraction: fraction === undefined ? undefined : Number(fraction), suffix };
}
