// Browser acceptance check (docs/requisitos: CA about layout).
// Opens every page at every width with real device emulation and fails when:
//   - the page scrolls sideways (anything wider than the viewport),
//   - an interactive target outside running text is smaller than 24x24 px (WCAG 2.5.8).
// Saves one full-page screenshot per page and width in .layout-check/.
//
// usage: npm run build && npx astro preview --port 4329 & node scripts/check-layout.mjs [baseUrl]
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';

const BASE = process.argv[2] ?? 'http://localhost:4329';
const PAGES = ['/', '/es', '/work/antel', '/es/work/hacknoid'];
const WIDTHS = [360, 390, 420, 769, 1080, 1200, 1400, 1440, 1920];
const HEIGHT = 900;
const MOBILE_BELOW = 769;
const MIN_TARGET = 24;
const PORT = 9341;
const OUT = '.layout-check';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Runs inside the page: returns every problem found at the current width.
const AUDIT = `(() => {
  const width = document.documentElement.clientWidth;
  const problems = [];
  if (document.documentElement.scrollWidth > width) {
    problems.push('desborde horizontal: ' + document.documentElement.scrollWidth + 'px en ' + width + 'px');
  }
  // One reading axis: the page title, the statement and every entry's text start on the same x.
  // Measured on the first text node, so a box stretched over the column with centered text fails too.
  const textLeft = (el) => {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, { acceptNode: (n) => n.textContent.trim() ? 1 : 3 });
    const node = walker.nextNode();
    if (!node) return el.getBoundingClientRect().left;
    const range = document.createRange();
    range.selectNodeContents(node);
    return range.getBoundingClientRect().left;
  };
  // Entries are measured by their box: a list's text starts after its dash.
  const axis = [
    ...[...document.querySelectorAll('main h1, .back, .statement-text')].map((el) => ({ el, left: Math.round(textLeft(el)) })),
    ...[...document.querySelectorAll('.entry.row > :last-child')].map((el) => ({ el, left: Math.round(el.getBoundingClientRect().left) })),
  ];
  const misaligned = axis.filter(({ left }) => Math.abs(left - axis[axis.length - 1].left) > 1);
  for (const { el, left } of misaligned) {
    problems.push('fuera del eje de lectura (' + left + 'px, la columna empieza en ' + axis[axis.length - 1].left + 'px): ' + (el.className || el.tagName));
  }
  // Desktop: every entry logo spans from the name to the end of the body's first line (R-41).
  if (width > 832) {
    for (const entry of document.querySelectorAll('.entry:has(> .meta > .co-mini)')) {
      const logo = entry.querySelector('.co-mini').getBoundingClientRect();
      // The first line's box: its element's top plus one line-height (glyph boxes are shorter).
      const first = entry.querySelector('.entry-body > :first-child');
      const line = first.querySelector('li') ?? first;
      const lineBottom = line.getBoundingClientRect().top + parseFloat(getComputedStyle(line).lineHeight);
      const top = entry.querySelector('.entry-head').getBoundingClientRect().top;
      if (Math.abs(logo.top - top) > 1 || Math.abs(logo.bottom - lineBottom) > 2) {
        problems.push('logo de ' + entry.id + ' (' + Math.round(logo.top) + '–' + Math.round(logo.bottom) + 'px) no cubre del nombre a la primera línea (' + Math.round(top) + '–' + Math.round(lineBottom) + 'px)');
      }
    }
  }
  const inText = (el) => el.closest('p, li:not(.seg), dd') && !el.closest('.actions, .links, .facts, .more, .lang');
  for (const el of document.querySelectorAll('a[href], button:not([hidden]), input')) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0 || inText(el)) continue;
    if (r.width < ${MIN_TARGET} || r.height < ${MIN_TARGET}) {
      problems.push('objetivo chico (' + Math.round(r.width) + 'x' + Math.round(r.height) + '): ' + (el.textContent.trim() || el.getAttribute('aria-label') || el.tagName).slice(0, 40));
    }
  }
  return problems;
})()`;

async function connect() {
  const chrome = spawn('google-chrome', ['--headless=new', '--disable-gpu', '--hide-scrollbars', `--remote-debugging-port=${PORT}`, '--user-data-dir=/tmp/layout-check-profile', 'about:blank'], { stdio: 'ignore' });
  let target;
  for (let i = 0; i < 40 && !target; i++) {
    await sleep(250);
    try { target = (await (await fetch(`http://127.0.0.1:${PORT}/json`)).json()).find((t) => t.type === 'page'); } catch { /* not up yet */ }
  }
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((r) => ws.addEventListener('open', r));
  let id = 0;
  const pending = new Map();
  ws.addEventListener('message', (e) => { const m = JSON.parse(e.data); pending.get(m.id)?.(m); pending.delete(m.id); });
  const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  return { chrome, ws, send };
}

const { chrome, ws, send } = await connect();
mkdirSync(OUT, { recursive: true });
let failures = 0;
try {
  await send('Page.enable');
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  for (const page of PAGES) {
    for (const width of WIDTHS) {
      const mobile = width < MOBILE_BELOW;
      await send('Emulation.setDeviceMetricsOverride', { width, height: HEIGHT, deviceScaleFactor: 1, mobile });
      await send('Emulation.setTouchEmulationEnabled', { enabled: mobile });
      await send('Page.navigate', { url: BASE + page });
      await sleep(1200);
      const problems = (await send('Runtime.evaluate', { expression: AUDIT, returnByValue: true })).result.result.value;
      const { result } = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true });
      writeFileSync(`${OUT}/${page.replace(/\//g, '_') || '_'}-${width}.png`, Buffer.from(result.data, 'base64'));
      const status = problems.length ? 'FALLA' : 'ok';
      console.log(`${status.padEnd(5)} ${page.padEnd(18)} ${width}px${problems.length ? '\n        ' + problems.join('\n        ') : ''}`);
      failures += problems.length;
    }
  }
} finally {
  ws.close();
  chrome.kill();
}
console.log(failures ? `\n${failures} problema(s)` : '\nSin problemas en ningún ancho');
process.exit(failures ? 1 : 0);
