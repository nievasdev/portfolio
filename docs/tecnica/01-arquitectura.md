# 1. Arquitectura

## Stack

- **Astro 5**, salida 100 % estática (`output: 'static'`), CSS incrustado en cada página.
- **Sin JavaScript en el navegador**, salvo los dos scripts mínimos del tema (R-37). Todo el
  movimiento es CSS.
- **pdfkit** genera el CV en el build. **Vitest** para tests, **Stryker** para mutación.

## Carpetas

```
src/
  pages/          rutas (envoltorios finos): index, es/index, work/[slug], es/work/[slug],
                  cv.pdf.ts, es/cv.pdf.ts, logos.svg.ts (sprite de logos)
  components/     HomePage, Hero, Statement, Projects, Experience, About, Contact,
                  WorkDetail, Header, Footer, Mark, ThemeToggle, TransactionsFlow, SearchFlow,
                  ProfileLinks (CV/GitHub/LinkedIn con ícono), IconSprite (sus símbolos, solo home)
  layouts/        Layout.astro: <head> (hreflang, canonical, meta, tema), header y footer
  content/        works/, projects/, cv/ (JSON por idioma), schemas.ts, config.ts
  i18n/ui.ts      textos fijos por idioma, links, localePath()
  lib/            lógica pura en TypeScript (lo que muta Stryker)
    experience.ts   años de experiencia desde el 1/4/2017
    timeline.ts     segmentos proporcionales de la línea de tiempo
    paths.ts        getStaticPaths de las páginas de empresa
    rich.ts         **negritas** → <b>, con escape de HTML
    logos.ts        SVG de logos incrustados y como <symbol>
    cv.ts           punto de entrada del CV (buildCv, renderCv)
    cv-pdf/         el CV por dentro (ver 04-cv-pdf.md)
    cv-route.ts     respuesta HTTP del PDF (borde con astro:content)
  styles/global.css
  tests/          Vitest; fakes/ (astro:content falso, documento PDF que graba)
public/           logos SVG, capturas WebP, fuentes, favicon
scripts/check-layout.mjs   revisión en el navegador (ver 05-calidad.md)
```

## Rutas por idioma

- Inglés en la raíz, español bajo `/es`. Cada página de `pages/` es un envoltorio de una línea
  que llama a `HomePage` o `WorkDetail` con `lang`.
- `localePath(lang, path)` (`i18n/ui.ts`) traduce una ruta neutra (`/work/antel`) a la del idioma.
  El selector EN/ES y los `hreflang` del `Layout` la usan.
- Las páginas de empresa salen de `workPaths()` (`lib/paths.ts`), con el `slug` de cada empresa.

## Bordes con el framework

La lógica de `lib/` es TypeScript plano que devuelve valores; Astro solo aparece en los bordes:
`cv-route.ts` (lee `astro:content`) y los componentes. En los tests `astro:content` se reemplaza
por `src/tests/fakes/astro-content.ts` (alias en `vitest.config.ts`).
