# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run build` - Build static site for production
- `npm run dev` - Start development server
- `npm run start` - Preview production build
- `npm test` - Run the Vitest suite (content, schema, routes, i18n parity)
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
