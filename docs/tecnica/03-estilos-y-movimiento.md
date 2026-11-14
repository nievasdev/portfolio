# 3. Estilos y movimiento

Todo en `src/styles/global.css`, incrustado en cada página.

## Tokens y tema

- Colores como variables en `:root` (claro) y redefinidas para oscuro en dos lugares:
  `@media (prefers-color-scheme: dark)` sobre `:root:not([data-theme="light"])` y
  `:root[data-theme="dark"]`.
- `ThemeToggle.astro` guarda la elección en `localStorage('theme')` y pone `data-theme` en
  `<html>`. Un script de una línea en el `<head>` (`Layout.astro`) la aplica **antes de pintar**,
  así no hay parpadeo. Sin JS el botón queda `hidden` y manda el sistema.

## Bandas marinas (`.band`)

Redefinen los tokens dentro de la sección, así todo lo que contienen se adapta solo. El ancho
completo se logra pintando el fondo hacia los costados con `box-shadow: 0 0 0 100vmax` y
recortándolo en vertical con `clip-path: inset(0 -100vmax)`. **No usar `100vw`**: incluye la barra
de scroll y corre la banda.

## Movimiento solo con CSS

| Efecto | Técnica |
| --- | --- |
| Llaves del logo que se dibujan al cargar | `pathLength="1"` + `stroke-dashoffset` |
| Punto del nombre que cae | `animation-timeline: view()` en el rango de salida |
| Punto y línea de cada título | `view-timeline-name: --head` en `.section-head` |
| Palabras de la frase-momento | una animación por palabra, rango desplazado por `--i` / `--n` |
| Transacciones de los diagramas | `stroke-dasharray` punteado y `stroke-dashoffset` atado al scroll |
| Nombre de empresa → título del detalle | View Transitions entre documentos (`@view-transition`) |

Todo lo atado al scroll está dentro de `@supports (animation-timeline: view())` y de
`prefers-reduced-motion: no-preference`. Sin soporte (Firefox) o con «reducir movimiento», el
contenido queda quieto y visible.

### Gotchas

- **Minificador: esbuild** (`astro.config.mjs`). lightningcss reescribe la regla como
  `animation: … nombre --timeline`, que el navegador rechaza: las animaciones de scroll
  desaparecen **solo en producción**. Verificar siempre sobre `astro preview`.
- En los `@keyframes` de `stroke-dashoffset` las unidades son obligatorias (`px`); sin unidades
  Chrome descarta el keyframe.
- La transición del nombre oculta la imagen vieja (`::view-transition-old(.work-name)`) para que no
  se vea una copia pixelada estirada.

## Diagramas

`TransactionsFlow.astro` (Antel) y `SearchFlow.astro` (Uruleyes) tienen dos SVG: horizontal para
escritorio y vertical para pantallas chicas. En escritorio se salen de la columna de texto hacia el
margen (`--bleed`) para que las etiquetas se lean a ~16 px.

## Logos

SVG en `public/logo_*.svg` con `fill="currentColor"` y el `viewBox` recortado al dibujo. En la home
se definen una vez como `<symbol>` (`lib/logos.ts`) y se reutilizan con `<use>`.
