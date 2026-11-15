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

// The hero's counting figures: each counter's current and final value, and which copy shows.
const FIGURES = `({
  counts: [...document.querySelectorAll('.fig .count')].map((c) => ({ now: Number(getComputedStyle(c).getPropertyValue('--n')), to: Number(c.style.getPropertyValue('--to')) })),
  textShown: [...document.querySelectorAll('.fig-text')].every((t) => getComputedStyle(t).visibility === 'visible'),
  wordsShown: [...document.querySelectorAll('.fig:not(:has(.fig-count)) .fig-text')].every((t) => getComputedStyle(t).visibility === 'visible'),
  countShown: [...document.querySelectorAll('.fig-count')].some((c) => getComputedStyle(c).display !== 'none' && getComputedStyle(c).visibility === 'visible'),
})`;

// Uruleyes' search walk (R-56): with every animation frozen at a given time, where the query sits
// (x, in the diagram's units) and which stages of the visible diagram are lit gold.
const SEARCH_AT = (ms) => `(() => {
  const svg = [...document.querySelectorAll('.flow-search svg')].find((s) => getComputedStyle(s).display !== 'none');
  const anims = svg ? svg.getAnimations({ subtree: true }) : [];
  anims.forEach((a) => { a.pause(); a.currentTime = ${ms}; });
  const query = svg?.querySelector('.query');
  // Colours come back in any CSS format (rgb, oklab…): paint each on a pixel and compare the RGB.
  const ctx = Object.assign(document.createElement('canvas'), { width: 1, height: 1 }).getContext('2d');
  const rgb = (colour) => { ctx.clearRect(0, 0, 1, 1); ctx.fillStyle = colour; ctx.fillRect(0, 0, 1, 1); return [...ctx.getImageData(0, 0, 1, 1).data].slice(0, 3); };
  const gold = rgb(getComputedStyle(document.documentElement).getPropertyValue('--gold').trim());
  const isGold = (colour) => rgb(colour).every((c, i) => Math.abs(c - gold[i]) <= 3);
  return {
    animated: anims.length,
    x: query ? parseFloat(getComputedStyle(query).translate.split(' ')[0] || 0) : null,
    lit: [...(svg?.querySelectorAll('.stage') ?? [])].map((r) => isGold(getComputedStyle(r).stroke)),
  };
})()`;
const STAGE_MS = 1600; // 8 s loop, one stage every 20 %
const STAGE_X = [0, 153, 305, 458, 610]; // the query's offset at each stage (wide diagram)

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
      // Figures (R-55): counting right after load, the real text at the end; still with reduce.
      await sleep(350);
      const early = await evaluate(FIGURES);
      await sleep(2000);
      const done = await evaluate(FIGURES);
      if (!early.counts.length) fail(`${label}: el hero no tiene cifras que cuenten`);
      else if (!reduce && !(early.countShown && early.counts.some(({ now, to }) => now < to))) fail(`${label}: las cifras no están contando al cargar`);
      else if (!early.wordsShown) fail(`${label}: un dato que no es número («Uruleyes») desaparece mientras las cifras cuentan`);
      else if (reduce && (early.countShown || !early.textShown)) fail(`${label}: con movimiento reducido las cifras no muestran su valor desde el principio`);
      else if (!done.textShown || done.countShown) fail(`${label}: al terminar no queda el valor real de las cifras`);
      else console.log(`ok    ${label}: cifras`);
      const before = await evaluate(OFFSETS);
      await sleep(1000);
      const after = await evaluate(OFFSETS);
      const moved = before.filter((offset, i) => offset !== after[i]).length;
      if (!reduce && moved !== before.length) fail(`${label}: ${before.length - moved} de ${before.length} transacciones quietas sin scroll`);
      else if (reduce && moved > 0) fail(`${label}: ${moved} transacciones se mueven`);
      else console.log(`ok    ${label}: diagramas`);
      // Search walk: at the middle of each stop, the query is on that stage and only it is lit.
      const stops = [];
      for (let i = 0; i < STAGE_X.length; i++) stops.push(await evaluate(SEARCH_AT(i * STAGE_MS + 500)));
      if (reduce) {
        if (stops.some((s) => s.animated > 0 && s.lit.some(Boolean))) fail(`${label}: la búsqueda de Uruleyes se anima`);
        else console.log(`ok    ${label}: búsqueda quieta`);
      } else {
        const wrong = stops.flatMap((s, i) => {
          const problems = [];
          if (s.x === null || Math.abs(s.x - STAGE_X[i]) > 1) problems.push(`etapa ${i + 1}: la consulta está en x=${s.x}, debería estar en ${STAGE_X[i]}`);
          if (s.lit.length !== STAGE_X.length || s.lit.some((on, j) => on !== (j === i))) problems.push(`etapa ${i + 1}: iluminadas ${JSON.stringify(s.lit)}`);
          return problems;
        });
        if (wrong.length) wrong.forEach((w) => fail(`${label}: búsqueda de Uruleyes, ${w}`));
        else console.log(`ok    ${label}: búsqueda recorre las 5 etapas`);
      }
      await send('Page.reload');
      await sleep(500);
    }
  }
} finally {
  ws.close();
  chrome.kill();
}
console.log(failures ? `\n${failures} problema(s)` : '\nMovimiento como se espera');
process.exit(failures ? 1 : 0);
