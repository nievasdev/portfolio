# 1. Estructura e idiomas

## Requerimientos

- **R-01.** El sitio en inglés vive en `/` y el español en `/es`. Cada idioma es una página propia,
  con `lang` en el `<html>`.
- **R-02.** El encabezado tiene un selector **EN / ES** que lleva a la misma página en el otro
  idioma; el idioma actual se marca subrayado en dorado.
- **R-03.** Cada página declara su dirección canónica y las alternativas `hreflang` (`en`, `es` y
  `x-default` apuntando al inglés), siempre sobre `https://nievas.dev`.
- **R-04.** Cada idioma tiene su propio `<title>` y su `meta description`.
- **R-05.** El encabezado tiene el menú interno **Projects · Experience · About · Contact** (en
  español: Proyectos · Experiencia · Sobre mí · Contacto), que lleva a cada sección de la home del
  mismo idioma. En pantallas chicas el menú se oculta y quedan la marca, el tema y el idioma.
- **R-06.** Cada empresa tiene su página en `/work/<empresa>` y `/es/work/<empresa>`, con el mismo
  identificador en los dos idiomas (`antel`, `upshow`, `hacknoid`, `gestion-total`).

## Criterios de aceptación

**CA-01: rutas por idioma** (R-01, R-06)

- Dado el sitio construido
- Cuando se piden `/`, `/es`, `/work/antel` y `/es/work/antel`
- Entonces las cuatro existen y cada una declara su idioma

Verificación: `src/tests/static-paths.test.ts`, `npm run check:layout`.

**CA-02: cambio de idioma conservando la página** (R-02)

- Dada la página `/work/hacknoid`
- Cuando el visitante toca **ES**
- Entonces llega a `/es/work/hacknoid`

Verificación: `src/tests/static-paths.test.ts` (`localePath`).

**CA-03: hreflang** (R-03)

- Dada cualquier página
- Cuando se lee su `<head>`
- Entonces tiene `hreflang="en"`, `hreflang="es"` y `hreflang="x-default"` con URL absoluta

Verificación: revisión del build (`dist/**/index.html`).

**CA-04: textos por idioma** (R-04, R-05)

- Dado el diccionario de textos
- Cuando se comparan inglés y español
- Entonces tienen exactamente las mismas claves y ninguna vacía

Verificación: `src/tests/i18n.test.ts`.

**CA-05: identificadores de empresa** (R-06)

- Dadas las empresas en los dos idiomas
- Cuando se comparan sus identificadores
- Entonces son únicos, en kebab-case y aparecen en el mismo orden

Verificación: `src/tests/static-paths.test.ts`.

**CA-06: volver a la experiencia** (R-06)

- Dada la página de una empresa en cualquier idioma
- Cuando el visitante toca «← All experience» / «← Toda la experiencia»
- Entonces vuelve a la sección de experiencia de la home de ese idioma

Verificación: navegador.
