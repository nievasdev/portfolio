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

En la home, el de Antel vive dentro de la banda marina (`Statement.astro`), debajo de la frase: toma
los colores de la banda porque `.band` redefine los tokens. Ahí no necesita `--bleed` (la banda ya
ocupa todo el contenedor) y la versión vertical se limita a 24rem para que en tablet no crezca de
más. En la página de Antel sigue en su columna, con el `--bleed`.

## Logos

SVG en `public/logo_*.svg` con `fill="currentColor"`, el `viewBox` recortado al dibujo y
optimizados con SVGO (precisión de 1 decimal). El endpoint `src/pages/logos.svg.ts` los junta en un
sprite, `/logos.svg`, generado en el build desde esos mismos archivos (`logoSprite()` en
`lib/logos.ts`). Las páginas los dibujan con `<use href="/logos.svg#logo-ancel">`: siguen tomando
el color del tema y no pesan en el HTML. El logo grande de cada página de empresa sí va incrustado,
porque está arriba de todo.

Tamaño óptico: `logoShape()` toma la proporción del `viewBox` y devuelve ancho y alto relativos a un
cuadrado de lado 1 con la misma superficie (ancho = √proporción, alto = 1/√proporción).
`logoStyle()` lo pasa como `--lw`/`--lh`, y `.co-mini` y `.seg-logo` los multiplican por su
`--logo`, el lado del cuadrado de cada contexto. Así «UP», que es ancho, y la «a» de Antel, que es
alta, pesan lo mismo. La proporción se lee con `split(' ')` porque SVGO escribe el `viewBox` con un
solo espacio.

## Tipografías

- Todo el texto monoespaciado usa la mono del sistema (`--mono`).
- Solo el nombre, los títulos de empresa, la marca y el mail usan `--display`: JetBrains Mono 600
  recortada a letras, acentos del español y `.@-` (`public/fonts/jetbrains-mono-display-600.woff2`,
  4,5 KB, precargada y con `font-display: swap`). Si un título nuevo usa un carácter fuera de ese
  conjunto, se muestra con la mono del sistema: hay que regenerar el recorte (por ejemplo con la
  librería `subset-font`) a partir de la fuente completa.

## Peso

Cada página HTML, con gzip, cabe en 14 000 bytes (R-45), así llega entera en la primera ida y
vuelta. El favicon va incrustado como `data:` URI (leído de `public/favicon.svg` al compilar). Lo
que más pesa dentro del HTML es el CSS (~4,5 KB con gzip) y los dos diagramas.
