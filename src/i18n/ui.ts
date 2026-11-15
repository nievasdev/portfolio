import { yearsOfExperience as years } from '../lib/experience';

export const languages = ['en', 'es'] as const;
export type Lang = (typeof languages)[number];

export const links = {
  github: 'https://github.com/nievasdev',
  linkedin: 'https://www.linkedin.com/in/mauronievasdev/',
  email: 'mauro@nievas.dev',
} as const;

// Home sections in page order; the header menu follows it.
export const homeSections = ['experience', 'projects', 'about', 'contact'] as const;

// Maps a language-agnostic path ('/', '/work/antel') to its URL in `lang`.
// English lives at the root, Spanish under /es.
export function localePath(lang: Lang, path: string): string {
  if (lang === 'en') return path;
  return path === '/' ? '/es' : `/es${path}`;
}

const en = {
  meta: {
    title: 'Mauro Nievas — Senior Full-Stack Developer (Node.js, TypeScript, React)',
    description: 'Senior Full-Stack Developer from Montevideo. Node.js and TypeScript backends handling millions of daily transactions, and the React/Next.js interfaces on top of them.',
  },
  skip: 'Skip to content',
  home: 'Mauro Nievas, home',
  language: 'Language',
  theme: { toDark: 'Switch to dark theme', toLight: 'Switch to light theme' },
  nav: {
    label: 'Sections',
    experience: 'Experience',
    projects: 'Projects',
    about: 'About',
    contact: 'Contact',
  },
  hero: {
    role: 'Senior Full-Stack Developer · Node.js · TypeScript · React / Next.js',
    lede: 'I build backends that handle millions of daily transactions, and their interfaces.',
    facts: [
      { value: `${years}+`, label: 'years', href: null },
      { value: '3.5M', label: 'transactions/day ↓', href: '#flow-transactions' },
      { value: 'Uruleyes', label: 'try it live ↓', href: '#project-uruleyes' },
    ],
    cta: 'Contact me',
    cv: 'CV (PDF)',
  },
  statement: 'Every day, up to 3.5 million transactions run through Node.js services I built and maintain',
  flow: {
    label: 'Diagram: files arrive over SFTP, Node.js microservices process up to 3.5 million transactions a day, and the results are stored in SQL databases.',
    input: 'SFTP files',
    service: 'Node.js microservices',
    store: 'SQL databases',
    rate: '≈ 3.5M / day',
  },
  searchFlow: {
    label: 'Diagram: laws and rulings are scraped from Parliament, IMPO and the TCA, normalized and stored in PostgreSQL with full-text and pgvector indexes; Gemini writes plain-language summaries and local e5 models compute embeddings; a hybrid search API fuses full-text and semantic results with RRF and serves the Preact app.',
    nodes: [
      ['Parliament', 'IMPO · TCA'],
      ['Scraping', '+ normalizing'],
      ['PostgreSQL', 'FTS + pgvector'],
      ['Hybrid search', 'API · RRF'],
      ['Preact app', 'on Vercel'],
    ],
    enrich: ['Gemini summaries', 'e5 embeddings'],
    rate: '1,500 searches/min · p95 46 ms',
    query: 'query',
    results: 'results',
  },
  search: {
    label: 'Try it (in Spanish)',
    button: 'Search',
    opens: '(opens in a new tab)',
  },
  timeline: {
    label: 'Career timeline',
    now: 'now',
  },
  sections: {
    experience: 'experience',
    projects: 'projects',
    about: 'about',
    contact: 'contact',
  },
  projects: {
    visit: 'Visit site →',
    caseStudy: 'Case study →',
    enlarge: 'Enlarge screenshot',
    close: 'Close ×',
    kind: {
      featured: 'featured',
      case: 'case study',
    },
    case: {
      problem: 'Problem',
      role: 'My role',
      built: 'What I built',
      result: 'Result',
    },
  },
  about: {
    paragraphs: [
      "Based in Montevideo. I'd rather ship solid than flashy. I'm finishing a degree in Information Systems at Universidad ORT and enjoy time with my family.",
    ],
    stack: [
      { label: 'Backend', items: 'Node.js · TypeScript · Express · REST · GraphQL' },
      { label: 'Frontend', items: 'React · Next.js · Tailwind CSS · SCSS' },
      { label: 'Data', items: 'MySQL · MariaDB · PostgreSQL · MongoDB · Sequelize' },
      { label: 'DevOps & tools', items: 'Docker · GitLab CI/CD · Git · Jest · Linux' },
    ],
  },
  contact: {
    text: 'Open to remote work.',
  },
  work: {
    back: '← All experience',
    overview: 'overview',
    highlights: 'highlights',
    context: 'context',
    projects: 'projects',
    stack: 'stack',
    more: 'more',
  },
  footer: 'Montevideo, Uruguay',
};

type Dictionary = typeof en;

const es: Dictionary = {
  meta: {
    title: 'Mauro Nievas — Desarrollador Full-Stack Senior (Node.js, TypeScript, React)',
    description: 'Desarrollador Full-Stack Senior en Montevideo. Backends en Node.js y TypeScript que procesan millones de transacciones diarias, y las interfaces en React/Next.js que se usan sobre ellos.',
  },
  skip: 'Saltar al contenido',
  home: 'Mauro Nievas, inicio',
  language: 'Idioma',
  theme: { toDark: 'Cambiar a tema oscuro', toLight: 'Cambiar a tema claro' },
  nav: {
    label: 'Secciones',
    experience: 'Experiencia',
    projects: 'Proyectos',
    about: 'Sobre mí',
    contact: 'Contacto',
  },
  hero: {
    role: 'Desarrollador Full-Stack Senior · Node.js · TypeScript · React / Next.js',
    lede: 'Construyo backends que procesan millones de transacciones diarias, y sus interfaces.',
    facts: [
      { value: `+${years}`, label: 'años', href: null },
      { value: '3,5M', label: 'transacciones/día ↓', href: '#flow-transactions' },
      { value: 'Uruleyes', label: 'probalo en vivo ↓', href: '#project-uruleyes' },
    ],
    cta: 'Contactarme',
    cv: 'CV (PDF)',
  },
  statement: 'Cada día, hasta 3,5 millones de transacciones pasan por servicios en Node.js que construí y mantengo',
  flow: {
    label: 'Diagrama: los archivos llegan por SFTP, microservicios en Node.js procesan hasta 3,5 millones de transacciones diarias y los resultados se guardan en bases de datos SQL.',
    input: 'Archivos SFTP',
    service: 'Microservicios Node.js',
    store: 'Bases de datos SQL',
    rate: '≈ 3,5M / día',
  },
  searchFlow: {
    label: 'Diagrama: las leyes y sentencias se obtienen del Parlamento, IMPO y el TCA, se normalizan y se guardan en PostgreSQL con índices de texto completo y pgvector; Gemini escribe resúmenes en lenguaje llano y modelos e5 locales calculan los embeddings; una API de búsqueda híbrida fusiona resultados de texto completo y semánticos con RRF y sirve la app en Preact.',
    nodes: [
      ['Parlamento', 'IMPO · TCA'],
      ['Scraping', '+ normalización'],
      ['PostgreSQL', 'FTS + pgvector'],
      ['Búsqueda', 'híbrida · RRF'],
      ['App Preact', 'en Vercel'],
    ],
    enrich: ['Resúmenes Gemini', 'embeddings e5'],
    rate: '1.500 búsquedas/min · p95 46 ms',
    query: 'consulta',
    results: 'resultados',
  },
  search: {
    label: 'Probalo',
    button: 'Buscar en',
    opens: '(se abre en otra pestaña)',
  },
  timeline: {
    label: 'Línea de tiempo de la carrera',
    now: 'hoy',
  },
  sections: {
    experience: 'experiencia',
    projects: 'proyectos',
    about: 'sobre mí',
    contact: 'contacto',
  },
  projects: {
    visit: 'Visitar sitio →',
    caseStudy: 'Caso de estudio →',
    enlarge: 'Ampliar captura',
    close: 'Cerrar ×',
    kind: {
      featured: 'destacado',
      case: 'caso de estudio',
    },
    case: {
      problem: 'Problema',
      role: 'Mi rol',
      built: 'Qué construí',
      result: 'Resultado',
    },
  },
  about: {
    paragraphs: [
      'Vivo en Montevideo. Prefiero lo sólido a lo vistoso. Estoy terminando la Licenciatura en Sistemas en la Universidad ORT y disfruto el tiempo con mi familia.',
    ],
    stack: [
      { label: 'Backend', items: 'Node.js · TypeScript · Express · REST · GraphQL' },
      { label: 'Frontend', items: 'React · Next.js · Tailwind CSS · SCSS' },
      { label: 'Datos', items: 'MySQL · MariaDB · PostgreSQL · MongoDB · Sequelize' },
      { label: 'DevOps y herramientas', items: 'Docker · GitLab CI/CD · Git · Jest · Linux' },
    ],
  },
  contact: {
    text: 'Abierto a trabajo remoto.',
  },
  work: {
    back: '← Toda la experiencia',
    overview: 'resumen',
    highlights: 'logros',
    context: 'contexto',
    projects: 'proyectos',
    stack: 'stack',
    more: 'más',
  },
  footer: 'Montevideo, Uruguay',
};

export const ui: Record<Lang, Dictionary> = { en, es };
