// Weight budget (R-45): every built HTML page, gzipped, must fit in the first round trip of a
// connection (TCP's initial window: 10 segments ≈ 14.6 KB, minus headers). Images, the logo
// sprite and the display font load on their own and do not count.
//
// usage: npm run build && npm run check:size
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';

const DIST = 'dist';
const BUDGET_BYTES = 14000;
const KB = 1024;

function htmlFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return htmlFiles(path);
    return path.endsWith('.html') ? [path] : [];
  });
}

let failures = 0;
for (const file of htmlFiles(DIST).sort()) {
  const html = readFileSync(file);
  const gzipped = gzipSync(html, { level: 9 }).length;
  const status = gzipped > BUDGET_BYTES ? 'FALLA' : 'ok';
  if (gzipped > BUDGET_BYTES) failures++;
  console.log(`${status.padEnd(5)} ${file.padEnd(36)} ${(html.length / KB).toFixed(1).padStart(5)} KB · gzip ${(gzipped / KB).toFixed(1)} KB`);
}
console.log(failures ? `\n${failures} página(s) superan ${BUDGET_BYTES} bytes con gzip` : `\nTodas las páginas entran en ${BUDGET_BYTES} bytes con gzip`);
process.exit(failures ? 1 : 0);
