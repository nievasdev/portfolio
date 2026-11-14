# 4. CV en PDF

`/cv.pdf` y `/es/cv.pdf` son endpoints estáticos (`src/pages/cv.pdf.ts`) que llaman a
`cvResponse(lang)` (`lib/cv-route.ts`): lee el contenido de `astro:content` y genera el PDF en el
build con pdfkit.

## Diseño: Facade + lista de secciones

```
lib/cv.ts              buildCv: crea el PDF real (A4, fuentes, metadatos) y llama a renderCv
                       renderCv: crea el writer y recorre CV_SECTIONS
lib/cv-pdf/types.ts    CvContent (qué dice el CV) y CvDocument (el documento PDFKit)
lib/cv-pdf/format.ts   texto puro: displayUrl, formatMonth, segments (**negritas**)
lib/cv-pdf/writer.ts   Facade sobre PDFKit: ensure, sectionHead, bullet, titleRow;
                       paleta, fuentes, tamaños y medidas con nombre
lib/cv-pdf/sections.ts una función por sección y la lista ordenada CV_SECTIONS
```

- **Facade (`createCvWriter`):** las secciones dicen *qué* va en la página («un título de sección»,
  «una viñeta») sin tocar primitivas de PDFKit. Un cambio de estilo de las viñetas se hace en un
  solo lugar.
- **Secciones como estrategias:** cada sección es `(writer, contenido) => void`. El CV es la lista
  `CV_SECTIONS`; agregar una sección es sumarla a la lista sin modificar las otras.

Cómo cumple SOID:

| Principio | Dónde |
| --- | --- |
| S | `format` da forma al texto, `writer` dibuja piezas, cada sección arma su bloque, `buildCv` crea el archivo |
| O | una sección nueva se agrega a `CV_SECTIONS` |
| I | cada sección recibe solo el writer y el contenido |
| D | `renderCv` recibe el documento; los tests le pasan uno que graba |

## Saltos de página

`ensure(space)` agrega una página si el bloque no entra; lo usan los títulos de sección, las
viñetas y las filas de título. `sectionHead(label, keep)` reserva el alto de la sección entera
(`keep`) para secciones cortas como habilidades o referencias, así nunca se cortan entre páginas
(R-29); por eso sus filas no llaman a `ensure` (sería código que nunca actúa).

## Fuentes

JetBrains Mono en **WOFF** (`src/assets/fonts/`), no WOFF2: fontkit no puede recortar WOFF2 al
incrustarla. Esas copias completas no se publican; la web solo usa el recorte de la 600
(`public/fonts/jetbrains-mono-display-600.woff2`, ver 03-estilos-y-movimiento.md).

## Cómo se prueba

- `cv-layout.test.ts` dibuja el CV sobre `fakes/recording-document.ts`, que graba cada llamada y
  simula el cursor, y compara la secuencia con la aprobada (snapshot en `__snapshots__/`). Es un
  test de la salida en el borde con PDFKit: cualquier cambio de texto, fuente, color, tamaño,
  posición o salto de página lo detecta. **Si el cambio es buscado**, se revisa el diff del
  snapshot y se actualiza con `npx vitest run -u`.
- `cv.test.ts` genera el PDF real: A4, metadatos, años, empresas y mail.
- `cv-route.test.ts` prueba la respuesta HTTP y el error de contenido faltante.
