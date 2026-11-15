# 3. Estilos y movimiento

Todo en `src/styles/global.css`, incrustado en cada página.

## Tokens y tema

- Colores como variables en `:root` (claro) y redefinidas para oscuro en dos lugares:
  `@media (prefers-color-scheme: dark)` sobre `:root:not([data-theme="light"])` y
  `:root[data-theme="dark"]`.
- `ThemeToggle.astro` guarda la elección en `localStorage('theme')` y pone `data-theme` en
  `<html>`. Un script de una línea en el `<head>` (`Layout.astro`) la aplica **antes de pintar**,
  así no hay parpadeo. Sin JS el botón queda `hidden` y manda el sistema.

## Grilla

`.row` es `margen | [text] columna [text-end] | resto`: `var(--gutter) minmax(0, var(--measure))
minmax(0, 1fr)`. Con `.wrap` a 80rem, el resto mide lo mismo que el margen y la columna queda en el
centro de la pantalla; en pantallas medianas el `1fr` se achica primero y la columna no se toca.
El cuerpo de una entrada se ubica con `grid-column: text` (la línea con nombre sirve igual con una
columna en el celular). Cada entrada es `logo | encabezado` arriba y el cuerpo debajo. En la home,
la zona del logo (`--logo-h`) se arma con las medidas del propio texto (ver «Logos»); su celda
ocupa las dos filas (`grid-row: span 2`) para no empujar el cuerpo hacia abajo. En la página de
cada empresa el logo (`flex: 1 1 0` + `aspect-ratio` desde `--lw/--lh`) toma el alto de su fila,
el encabezado. El logo grande del hero usa la misma fila, en el margen. `check:layout` verifica,
por sección, que cada logo de la home esté centrado en la zona que arranca en el nombre y mide lo
que el logo más alto, que llegue al menos al final de la primera línea (por la caja de la línea,
no la del glifo) y que todos compartan el eje.

`npm run check:layout` verifica el eje: título, «← volver», frase de la banda y texto de cada
entrada tienen que empezar en la misma x (el título y la frase se miden por su primer texto, así
una caja estirada con texto centrado también falla).

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
| Cifras del hero que cuentan | `figureParts()` (`lib/figures.ts`) separa «3,5M» en prefijo, entero, separador, decimal y sufijo; cada número es un `@property --n` entero animado de 0 a `--to` y mostrado con `counter()`. La copia que cuenta (`aria-hidden`) va encima del texto real y se intercambian al terminar con `visibility` en `step-end` |
| Transacciones de los diagramas | `stroke-dasharray` punteado y `stroke-dashoffset` en bucle por tiempo (6 s), avanzando un número exacto de períodos del patrón para que no salte; funciona en todos los navegadores |
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
escritorio y vertical para pantallas chicas. Los verticales son compactos (viewBox 300×260 y
340×330, cajas de 40–44 de alto) para no pasar de ~400 px en el celular. En escritorio se salen de la columna de texto hacia el
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

Tamaño óptico: un logo se ve tan grande como su superficie por la raíz de su tinta (la fracción
de su caja que está pintada). `scripts/measure-logos.mjs` mide esa tinta una vez, dibujando cada
SVG en un canvas de Chrome sin interfaz, y la guarda en `src/lib/logo-ink.json` (hay que volver a
correrlo si cambia un logo; un test exige que todos tengan su valor). `logoShapes(paths)` escala
cada lado por tinta^(-1/4), estira según la proporción del `viewBox` (√proporción de ancho,
1/√proporción de alto) y normaliza el conjunto para que el más alto mida 1. `logoStyles()` lo pasa
como `--lw`/`--lh`, y `.co-mini` y `.seg-logo` los multiplican por el alto disponible. Así la «a»
de Antel (34 % pintada) se dibuja más grande que «UP» (58 %) y pesan lo mismo. En la home, la zona
del logo mide `--logo-h` (nombre + rol + primera línea + la línea de tags en experiencia,
`--tags-h`; en proyectos sin tags porque sigue el diagrama); el más alto la llena, cada logo se
centra en altura sobre ella y todos en un mismo eje vertical (`--logo-slot`). La proporción
se lee con `split(' ')` porque SVGO escribe el `viewBox` con un solo espacio.

## Tipografías

- Todo el texto monoespaciado usa la mono del sistema (`--mono`).
- Solo el nombre, los títulos de empresa, la marca, el mail y las cifras del hero usan
  `--display`: JetBrains Mono 600 recortada a letras, acentos del español, `.@-`, dígitos, `+` y
  `,` (`public/fonts/jetbrains-mono-display-600.woff2`, 5,3 KB, precargada y con
  `font-display: swap`). Si un título nuevo usa un carácter fuera de ese
  conjunto, se muestra con la mono del sistema: hay que regenerar el recorte (por ejemplo con la
  librería `subset-font`) a partir de la fuente completa.

## Peso

Cada página HTML, con gzip, cabe en 14 000 bytes (R-45), así llega entera en la primera ida y
vuelta. El favicon va incrustado como `data:` URI (leído de `public/favicon.svg` al compilar). Lo
que más pesa dentro del HTML es el CSS (~4,5 KB con gzip) y los dos diagramas.
