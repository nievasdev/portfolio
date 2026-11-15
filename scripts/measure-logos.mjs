// Measures how much of each logo's box is painted ("ink", 0–1) and writes src/lib/logo-ink.json,
// which logoShapes() uses so every logo looks as big as the others (R-41).
// Draws each public/logo_*.svg on a canvas in headless Chrome and counts the opaque pixels.
// Run again only when a logo changes.
//
// usage: node scripts/measure-logos.mjs
import { spawn } from 'node:child_process';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';

const PUBLIC = 'public';
const OUT = 'src/lib/logo-ink.json';
const PORT = 9342;
const SIZE = 600; // px on the longest side: enough for a stable ratio
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const logos = readdirSync(PUBLIC).filter((f) => /^logo_.+\.svg$/.test(f)).sort();
const svgs = Object.fromEntries(logos.map((f) => [`/${f}`, readFileSync(`${PUBLIC}/${f}`, 'utf8')]));

// Runs in the page: draws every SVG at its own proportions and returns opaque pixels / all pixels.
const MEASURE = `(async (svgs) => {
  const ink = {};
  for (const [path, svg] of Object.entries(svgs)) {
    const [, , w, h] = svg.match(/viewBox="([^"]+)"/)[1].split(' ').map(Number);
    const scale = ${SIZE} / Math.max(w, h);
    const canvas = Object.assign(document.createElement('canvas'), { width: Math.round(w * scale), height: Math.round(h * scale) });
    const img = new Image();
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    await img.decode();
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let painted = 0;
    for (let i = 3; i < data.length; i += 4) if (data[i] > 127) painted++;
    ink[path] = Math.round((painted / (canvas.width * canvas.height)) * 1000) / 1000;
  }
  return ink;
})(${JSON.stringify(svgs)})`;

const chrome = spawn('google-chrome', ['--headless=new', '--disable-gpu', `--remote-debugging-port=${PORT}`, '--user-data-dir=/tmp/measure-logos-profile', 'about:blank'], { stdio: 'ignore' });
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
try {
  const { result } = await send('Runtime.evaluate', { expression: MEASURE, awaitPromise: true, returnByValue: true });
  writeFileSync(OUT, JSON.stringify(result.result.value, null, 2) + '\n');
  console.log(`${OUT}:`, result.result.value);
} finally {
  ws.close();
  chrome.kill();
}
