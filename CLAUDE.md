# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Flujo de trabajo (obligatorio)

Adaptado del flujo de veratv-web, sin el contrato en PDF ni el envío a servicios: acá el cliente es
Mauro.

### Comunicación

- Los cambios a archivos se hacen con Edit/Write, nunca con comandos de shell, para que Mauro vea
  cada cambio.
- Todo lo que se le escribe a Mauro va en español; las siglas (R, CA) se explican la primera vez.

### Antes de programar: requisitos

1. Se actualiza la documentación viva, `docs/requisitos/` (un archivo por área): requisitos `R-xx`
   (qué hace el sitio) y criterios de aceptación `CA-xx` (Dado/Cuando/Entonces, indicando qué R
   verifican y cómo se verifican). Los IDs son únicos y nunca se reutilizan ni se renumeran.
2. Mauro aprueba el cambio de requisitos. Recién ahí se programa, con TDD.

La documentación técnica (`docs/tecnica/`, cómo está hecho) se actualiza en el mismo commit que
cambia lo que describe.

### TDD, un commit por ciclo

Rojo, verde y refactor son fases de **un solo ciclo** y van en **un solo commit**, que se hace al
cerrar el ciclo (después de la mutación y el navegador).

- **Plan:** qué CA cubre, qué test se escribe y qué archivos se tocan; se espera el OK.
- **Rojo:** el test que falla. Si el código no existe, un stub para que falle en la aserción.
- **Verde:** lo mínimo para pasar.
- **Refactor:** con la skill `clean-code-ts-react` (versionada en `.claude/skills/`) sobre el diff
  del ciclo, código y tests: qué se marcó, qué se aplicó y qué se descartó, con el porqué.
- **Mutación:** `npm run mutation` (Stryker sobre todo el TypeScript de `src/lib`, `src/i18n` y
  `src/content/schemas.ts`). La meta es **100 %**: ningún mutante vivo se acepta. Si uno parece
  equivalente, se reescribe el código sin cambiar el comportamiento o se le plantea a Mauro; nunca
  se da por bueno por cuenta propia. Los `.astro` no se pueden mutar: lo visual se cubre con CA
  verificados en el navegador.
- **Navegador:** si el cambio se ve, `npm run build`, `npx astro preview --port 4329` y
  `npm run check:layout`, que recorre los anchos 360, 390, 420, 769, 1080, 1200, 1400, 1440 y
  1920, falla ante desborde lateral u objetivos táctiles chicos y guarda capturas en
  `.layout-check/` para compararlas antes/después.
- **Commit:** `feat|fix|test|refactor|docs|chore(alcance): …` en español, con los R/CA que cubre.
  `test:` es solo para tests que pasan desde el principio (caracterización o matar un mutante).
  Antes de commitear, `npm test`, `npm run typecheck` y `npm run build` tienen que pasar.

Después de cada fase se para y se espera el OK, salvo que Mauro pida «hazlo completo».

### Clean code

SOID (SOLID sin Liskov), KISS, DRY, YAGNI, POLA; patrones solo donde encajan (hoy: Facade +
lista de secciones en el CV, ver `docs/tecnica/04-cv-pdf.md`); nombres con intención (funciones con verbo, tipos
con sustantivo); funciones chicas; más de 2 parámetros → un objeto; calcular o cambiar estado, no
las dos cosas; sin números mágicos; comentarios solo para el porqué; tests como especificación
(un comportamiento por test, Preparar / Actuar / Verificar).

### Commits

- Conventional Commits en español. `git add` con rutas concretas: hay archivos sin versionar a
  propósito (`propuesta/`).
- El push lo hace Mauro (la clave SSH tiene passphrase): se commitea local y al cerrar se dice
  cuántos commits quedan sin pushear.

## Development Commands

- `npm run build` - Build static site for production
- `npm run dev` - Start development server
- `npm run start` - Preview production build
- `npm test` - Run the Vitest suite (content, schema, routes, i18n parity)
- `npm run mutation` - Stryker mutation testing (must stay at 100 %)
- `npm run check:layout` - Browser check at every reference width (needs `astro preview` on :4329)
- `npm run lint` - Run Astro check (needs `@astrojs/check` installed)

Requires Node.js 20+ (`nvm use 20.0.0`).

## Architecture Overview

Fully static **Astro 5** site for nievas.dev. Zero client-side JavaScript.

### Routes and languages
- English at the root, Spanish under `/es`, each its own page (no client-side language switching).
- `src/pages/index.astro` and `src/pages/es/index.astro` render `HomePage` with `lang`.
- `src/pages/work/[slug].astro` and `src/pages/es/work/[slug].astro` render `WorkDetail`; paths come from `workPaths()` in `src/lib/paths.ts`, slugs from the `slug` field in the works JSON.
- `Layout.astro` takes `lang` + a language-agnostic `path` and emits `<html lang>`, canonical and `hreflang` links (en, es, x-default). `localePath()` in `src/i18n/ui.ts` maps paths between languages.

### Content
- Works: `src/content/works/{en,es}.json`. Projects: `src/content/projects/{en,es}.json` (`kind`: featured | case | earlier).
- Zod schemas live in `src/content/schemas.ts` (imported by `config.ts` and by the tests).
- Metrics in highlights are marked `**like this**` and rendered by `rich()` in `src/lib/rich.ts`.
- UI strings (nav, hero, about, stack, contact, labels, meta) live in `src/i18n/ui.ts`; EN and ES must have identical keys.
- Technology names must use the canonical spelling listed in `src/tests/data-integrity.test.ts`. Missing data is omitted, never shipped as `[placeholder]`.

### Components (`src/components/`)
`HomePage` composes `Hero`, `Experience`, `Projects`, `About`, `Contact`; `Header`/`Footer` come from `Layout`. `Mark` is the logo (sprite symbol, animated hero version, or `<use>` reference). `WorkDetail` is the per-company page.

### Visual system
- Palette from the logo: navy `#1E2A44`, cold white `#E6E9F0`, grays `#A9B0BF`/`#5B6478`, one gold accent `#C9A227` (decorative on light; `--gold-ink` `#8A6D12` for gold text on light).
- Light/dark follows `prefers-color-scheme` (no toggle). Tokens in `src/styles/global.css`.
- JetBrains Mono (self-hosted in `public/fonts/`) for name, headings, labels, tags; system sans for reading text.
- Layout: a narrow label gutter + one reading column; single column under 52rem.
- Company logos in `public/logo_*.svg` use `fill="currentColor"` and are inlined into the page.
- Favicon `public/favicon.svg` switches stroke color with the system theme.
