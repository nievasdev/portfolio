// Browser acceptance check for motion (docs/requisitos/05-tema-y-movimiento.md).
// Opens the home in headless Chrome, with and without «reduce motion», and fails when:
//   - the diagrams' transactions don't flow on their own, without scrolling (R-35);
//   - they move with «reduce motion» on (R-36);
//   - Uruleyes' search doesn't walk app → API → PostgreSQL → API → app, on desktop and phones (R-56);
//   - Uruleyes' loading dots don't go from scraping to the sources and from scraping to the app (R-57).
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

// Uruleyes' search walk (R-56): with every animation frozen at a given time, in the visible
// diagram: where the query pill sits (x, in the diagram's units), what it reads, and which stages
// are lit — a lit gold outline over a stage, matched by position, so the check doesn't trust the
// page's own idea of which stage each outline belongs to.
const SEARCH_AT = (ms) => `(() => {
  const svg = [...document.querySelectorAll('.flow-search svg')].find((s) => getComputedStyle(s).display !== 'none');
  const anims = svg.getAnimations({ subtree: true });
  anims.forEach((a) => { a.pause(); a.currentTime = ${ms}; });
  const shown = (el) => getComputedStyle(el).display !== 'none' && Number(getComputedStyle(el).opacity) > 0.5;
  // Colours come back in any CSS format (rgb, oklab…): paint each on a pixel and compare the RGB.
  const ctx = Object.assign(document.createElement('canvas'), { width: 1, height: 1 }).getContext('2d');
  const rgb = (colour) => { ctx.clearRect(0, 0, 1, 1); ctx.fillStyle = colour; ctx.fillRect(0, 0, 1, 1); return [...ctx.getImageData(0, 0, 1, 1).data].slice(0, 3); };
  const gold = rgb(getComputedStyle(document.documentElement).getPropertyValue('--gold').trim());
  const isGold = (colour) => rgb(colour).every((c, i) => Math.abs(c - gold[i]) <= 3);
  const stages = [...svg.querySelectorAll('.stage')];
  const at = (r) => r.getAttribute('x') + ',' + r.getAttribute('y');
  const query = svg.querySelector('.query');
  return {
    animated: anims.length,
    x: query && shown(query) ? parseFloat(getComputedStyle(query).translate.split(' ')[0] || 0) : null,
    text: query && shown(query) ? [...query.querySelectorAll('text')].filter(shown).map((t) => t.textContent) : [],
    lit: [...svg.querySelectorAll('.stage-lit')]
      .filter((r) => shown(r) && isGold(getComputedStyle(r).stroke))
      .map((r) => stages.findIndex((s) => at(s) === at(r))),
  };
})()`;
const STAGE_MS = 1600; // 8 s loop, one stop every 20 %
// CA-49, stop by stop: the stage lit (stages: 0 sources, 1 scraping, 2 PostgreSQL, 3 API, 4 app),
// the pill's offset in the wide diagram, and whether it reads «results» instead of «query».
const STOPS = [
  { stage: 4, x: 0, results: false },
  { stage: 3, x: -152, results: false },
  { stage: 2, x: -305, results: false },
  { stage: 3, x: -152, results: true },
  { stage: 4, x: 0, results: true },
];
const PILL = { '/': { query: 'query', results: 'results' }, '/es': { query: 'consulta', results: 'resultados' } };
const VIEWPORTS = [
  { name: 'escritorio', width: 1440, height: 900, mobile: false },
  { name: 'celular', width: 390, height: 844, mobile: true },
];

// Uruleyes' loading dots (R-57): for every dotted stroke in the visible diagram, frozen at two
// times, which way its dots travel (a unit step along the diagram's axis: -1 towards the sources,
// +1 towards the app, 0 still) and whether it sits between the sources and scraping boxes. The
// direction comes from the stroke's own geometry, so drawing a stroke backwards is caught.
const LOADING_DOTS = `(() => {
  const svg = [...document.querySelectorAll('.flow-search svg')].find((s) => getComputedStyle(s).display !== 'none');
  const wide = svg.classList.contains('flow-wide');
  const along = (p) => (wide ? p.x : p.y);
  const [sources, scraping] = [...svg.querySelectorAll('.stage')].map((r) => r.getBBox());
  const gap = wide ? [sources.x + sources.width, scraping.x] : [sources.y + sources.height, scraping.y];
  const anims = svg.getAnimations({ subtree: true });
  const offsetsAt = (ms) => {
    anims.forEach((a) => { a.pause(); a.currentTime = ms; });
    return [...svg.querySelectorAll('.tx')].map((p) => parseFloat(getComputedStyle(p).strokeDashoffset));
  };
  const [before, after] = [offsetsAt(1000), offsetsAt(1500)];
  return [...svg.querySelectorAll('.tx')].map((p, i) => {
    const [start, end] = [p.getPointAtLength(0), p.getPointAtLength(p.getTotalLength())];
    const middle = (along(start) + along(end)) / 2;
    // a falling dash offset moves the dots from the stroke's start towards its end
    const travel = Math.sign(before[i] - after[i]) * Math.sign(along(end) - along(start));
    return { inGap: middle >= gap[0] && middle <= gap[1], travel };
  });
})()`;

const towards = (travel) => (travel < 0 ? 'las fuentes' : travel > 0 ? 'la app' : 'ningún lado');

// Problems with the loading dots at one page, viewport and motion setting (empty when they're right).
async function loadingProblems({ reduce }) {
  const strokes = await evaluate(LOADING_DOTS);
  if (reduce) return strokes.some((s) => s.travel !== 0) ? ['los puntos se mueven con movimiento reducido'] : [];
  const problems = [];
  if (!strokes.some((s) => s.inGap)) problems.push('no hay puntos entre las fuentes y el scraping');
  strokes.forEach((s, i) => {
    const expected = s.inGap ? -1 : 1;
    if (s.travel !== expected) problems.push(`trazo ${i + 1}: los puntos van hacia ${towards(s.travel)}, deberían ir hacia ${towards(expected)}`);
  });
  return problems;
}

// Problems with the search walk at one page, viewport and motion setting (empty when it's right).
async function searchProblems({ page, viewport, reduce }) {
  const stops = [];
  for (let i = 0; i < STOPS.length; i++) stops.push(await evaluate(SEARCH_AT(i * STAGE_MS + 500)));
  if (reduce) return stops.some((s) => s.animated > 0 || s.lit.length > 0) ? ['se anima con movimiento reducido'] : [];
  return stops.flatMap((s, i) => {
    const expected = STOPS[i];
    const problems = [];
    if (JSON.stringify(s.lit) !== JSON.stringify([expected.stage])) problems.push(`parada ${i + 1}: etapas iluminadas ${JSON.stringify(s.lit)}, debería ser [${expected.stage}]`);
    if (viewport.mobile) {
      if (s.x !== null) problems.push(`parada ${i + 1}: la píldora se ve en el celular`);
    } else {
      const word = PILL[page][expected.results ? 'results' : 'query'];
      if (s.x === null || Math.abs(s.x - expected.x) > 1) problems.push(`parada ${i + 1}: la píldora está en x=${s.x}, debería estar en ${expected.x}`);
      if (JSON.stringify(s.text) !== JSON.stringify([word])) problems.push(`parada ${i + 1}: la píldora dice ${JSON.stringify(s.text)}, debería decir «${word}»`);
    }
    return problems;
  });
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
    }
  }
  // Search walk (CA-49): at the middle of each stop, on desktop and on phones.
  for (const viewport of VIEWPORTS) {
    const { name, ...metrics } = viewport;
    await send('Emulation.setDeviceMetricsOverride', { ...metrics, deviceScaleFactor: 1 });
    for (const reduce of [false, true]) {
      await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: reduce ? 'reduce' : 'no-preference' }] });
      for (const page of PAGES) {
        const label = `${page.padEnd(4)} ${name.padEnd(10)} ${reduce ? 'reducir movimiento' : 'con movimiento'}`;
        await send('Page.navigate', { url: BASE + page });
        await sleep(500);
        const problems = await searchProblems({ page, viewport, reduce });
        if (problems.length) problems.forEach((p) => fail(`${label}: búsqueda de Uruleyes, ${p}`));
        else console.log(`ok    ${label}: búsqueda ${reduce ? 'quieta' : 'app → API → PostgreSQL → API → app'}`);
        const loading = await loadingProblems({ reduce });
        if (loading.length) loading.forEach((p) => fail(`${label}: carga de Uruleyes, ${p}`));
        else console.log(`ok    ${label}: carga ${reduce ? 'quieta' : 'scraping → fuentes, scraping → app'}`);
      }
    }
  }
} finally {
  ws.close();
  chrome.kill();
}
console.log(failures ? `\n${failures} problema(s)` : '\nMovimiento como se espera');
process.exit(failures ? 1 : 0);
