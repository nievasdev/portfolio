// Budgets for the built site:
//  - Weight (R-45): every HTML page, gzipped, must fit in the first round trip of a connection
//    (TCP's initial window: 10 segments ≈ 14.6 KB, minus headers). Images, the logo sprite and the
//    display font load on their own and do not count.
//  - Reading time (R-46): the home must be scannable in about a minute.
//
// usage: npm run build && npm run check:size
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';

const DIST = 'dist';
const BUDGET_BYTES = 14000;
const HOME_PAGES = ['dist/index.html', 'dist/es/index.html'];
const BUDGET_WORDS = 300;
const KB = 1024;

function htmlFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return htmlFiles(path);
    return path.endsWith('.html') ? [path] : [];
  });
}

// Words a visitor reads in <main>: no markup, scripts, styles, SVG labels, closed popovers (the
// enlarged screenshots) or screen-reader text.
function readableWords(html) {
  const main = html.match(/<main[\s\S]*<\/main>/)?.[0] ?? '';
  const text = main
    .replace(/<(script|style|svg|dialog)[\s\S]*?<\/\1>/g, ' ')
    .replace(/<span class="sr-only">[\s\S]*?<\/span>/g, ' ')
    .replace(/<[^>]+>/g, ' ');
  return text.split(/\s+/).filter((word) => /[\p{L}\p{N}]/u.test(word)).length;
}

let failures = 0;
for (const file of htmlFiles(DIST).sort()) {
  const html = readFileSync(file);
  const gzipped = gzipSync(html, { level: 9 }).length;
  const status = gzipped > BUDGET_BYTES ? 'FALLA' : 'ok';
  if (gzipped > BUDGET_BYTES) failures++;
  console.log(`${status.padEnd(5)} ${file.padEnd(36)} ${(html.length / KB).toFixed(1).padStart(5)} KB · gzip ${(gzipped / KB).toFixed(1)} KB`);
}
for (const file of HOME_PAGES) {
  const words = readableWords(readFileSync(file, 'utf8'));
  const status = words > BUDGET_WORDS ? 'FALLA' : 'ok';
  if (words > BUDGET_WORDS) failures++;
  console.log(`${status.padEnd(5)} ${file.padEnd(36)} ${words} palabras para leer (máximo ${BUDGET_WORDS})`);
}
console.log(failures ? `\n${failures} problema(s)` : `\nPeso y lectura dentro del presupuesto`);
process.exit(failures ? 1 : 0);
