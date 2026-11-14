// A stand-in for PDFKit's document that records every drawing call in order.
// It keeps the cursor (x, y) the way PDFKit does closely enough for page breaks to happen at
// the same places: each finished line of text and each moveDown advance y by one line.
import type { CvDocument } from '../../lib/cv';

export const PAGE = { width: 595.28, height: 841.89 };
export const MARGIN = 50;
const LINE = 12;
const CHAR_WIDTH = 5;

export type Call = [string, ...unknown[]];

type Options = { continued?: boolean } | undefined;

function lastOptions(args: unknown[]): Options {
  const last = args[args.length - 1];
  return typeof last === 'object' && last !== null ? (last as Options) : undefined;
}

export function recordingDocument(): { doc: CvDocument; calls: Call[] } {
  const calls: Call[] = [];
  const state = { x: MARGIN, y: MARGIN, page: PAGE };

  const advance: Record<string, (args: unknown[]) => void> = {
    text: (args) => {
      if (typeof args[1] === 'number') state.x = args[1];
      if (typeof args[2] === 'number') state.y = args[2];
      if (!lastOptions(args)?.continued) state.y += LINE;
    },
    moveDown: (args) => {
      state.y += LINE * ((args[0] as number | undefined) ?? 1);
    },
    addPage: () => {
      state.y = MARGIN;
    },
  };

  const doc: CvDocument = new Proxy({} as CvDocument, {
    get(_target, property: string) {
      if (property in state) return state[property as keyof typeof state];
      if (property === 'widthOfString') {
        return (text: string) => {
          calls.push(['widthOfString', text]);
          return text.length * CHAR_WIDTH;
        };
      }
      return (...args: unknown[]) => {
        calls.push([property, ...args]);
        advance[property]?.(args);
        return doc;
      };
    },
    set(_target, property: string, value: number) {
      calls.push(['set', property, value]);
      (state as Record<string, unknown>)[property] = value;
      return true;
    },
  });

  return { doc, calls };
}
