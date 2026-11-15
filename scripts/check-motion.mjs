// Browser acceptance check for motion (docs/requisitos/05-tema-y-movimiento.md).
// Opens the home in headless Chrome, with and without «reduce motion», and fails when:
//   - the diagrams' transactions don't flow on their own, without scrolling (R-35);
//   - they move with «reduce motion» on (R-36).
//
// usage: npm run build && npx astro preview --port 4329 & node scripts/check-motion.mjs [baseUrl]
import { spawn } from 'node:child_process';

const BASE = process.argv[2] ?? 'http://localhost:4329';
const PAGES = ['/', '/es'];
const PORT = 9343;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function connect() {
  const chrome = spawn('google-chrome', ['--headless=new', '--disable-gpu', `--remote-debugging-port=${PORT}`, '--user-data-dir=/tmp/check-motion-profile', 'about:blank'], { stdio: 'ignore' });
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
  const evaluate = async (expression) => (await send('Runtime.evaluate', { expression, returnByValue: true })).result.result.value;
  return { chrome, ws, send, evaluate };
}

// The dash offset of every transaction stroke in the visible (wide) diagrams.
const OFFSETS = `[...document.querySelectorAll('.flow-wide .tx')].map((p) => getComputedStyle(p).strokeDashoffset)`;

const { chrome, ws, send, evaluate } = await connect();
let failures = 0;
const fail = (msg) => { failures++; console.log(`FALLA ${msg}`); };
try {
  await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  for (const reduce of [false, true]) {
    await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: reduce ? 'reduce' : 'no-preference' }] });
    for (const page of PAGES) {
      const label = `${page.padEnd(4)} ${reduce ? 'reducir movimiento' : 'con movimiento'}`;
      await send('Page.navigate', { url: BASE + page });
      await sleep(1500);
      const before = await evaluate(OFFSETS);
      await sleep(1000);
      const after = await evaluate(OFFSETS);
      const moved = before.filter((offset, i) => offset !== after[i]).length;
      if (!reduce && moved !== before.length) fail(`${label}: ${before.length - moved} de ${before.length} transacciones quietas sin scroll`);
      else if (reduce && moved > 0) fail(`${label}: ${moved} transacciones se mueven`);
      else console.log(`ok    ${label}: diagramas`);
    }
  }
} finally {
  ws.close();
  chrome.kill();
}
console.log(failures ? `\n${failures} problema(s)` : '\nMovimiento como se espera');
process.exit(failures ? 1 : 0);
