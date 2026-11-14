# 6. Diseño en todos los anchos

Anchos de referencia: **360, 390, 420, 769, 1080, 1200, 1400, 1440 y 1920 px**. Por debajo de
769 px el sitio es de una columna.

## Requerimientos

- **R-38.** En ningún ancho la página se desplaza hacia los costados.
- **R-39.** Todo enlace o botón fuera de un párrafo mide al menos **24 × 24 px** (WCAG 2.5.8), para
  que se pueda tocar sin errar.
- **R-40.** Las bandas marinas ocupan exactamente el ancho de la pantalla, sin corrimientos.
- **R-41.** Los logos se ven del mismo tamaño aparente entre sí: cada SVG está recortado a su
  dibujo. En la entrada de cada empresa miden 68 px en escritorio y 48 px en pantallas chicas; en
  la línea de tiempo, 26 px y 24 px.
- **R-42.** En escritorio los diagramas ocupan todo el ancho del contenedor; en pantallas chicas
  usan su versión vertical, a todo el ancho, con las etiquetas legibles.
- **R-43.** En pantallas chicas la frase-momento no deja más de una pantalla de aire.
- **R-45.** Cada página HTML, comprimida con gzip, pesa como máximo **14 000 bytes**, para que
  llegue entera en la primera ida y vuelta de la conexión. Esa página trae todo lo necesario para
  verse: CSS, textos, diagramas y favicon. Aparte se cargan solo las imágenes (capturas y el
  archivo de logos `/logos.svg`) y la tipografía del nombre, recortada a las letras que usa.
- **R-46.** La home se recorre en alrededor de un minuto: como máximo **300 palabras** visibles en
  cada idioma, y cada punto clave de una empresa tiene 15 palabras o menos. El detalle va en las
  páginas de cada empresa.
- **R-44.** La herramienta `npm run check:layout` recorre la home y una página de empresa en los dos
  idiomas en todos los anchos de referencia y falla ante cualquier problema de R-38 o R-39.

## Criterios de aceptación

**CA-37: sin desplazamiento lateral** (R-38, R-40)

- Dada cualquier página en cualquier ancho de referencia
- Cuando se mide el documento
- Entonces su ancho no supera el de la pantalla

Verificación: `npm run check:layout`.

**CA-38: objetivos táctiles** (R-39)

- Dada cualquier página en cualquier ancho de referencia
- Cuando se miden los enlaces y botones fuera de párrafos
- Entonces ninguno mide menos de 24 × 24 px

Verificación: `npm run check:layout`.

**CA-39: logos recortados** (R-41)

- Dado cualquier logo de empresa o proyecto
- Cuando se lee su `viewBox`
- Entonces no es el lienzo cuadrado original sin recortar

Verificación: `src/tests/data-integrity.test.ts`.

**CA-40: diagrama vertical en móvil** (R-42)

- Dado un ancho de 390 px
- Cuando se ve un diagrama
- Entonces se muestra la versión vertical, centrada y sin cajas corridas

Verificación: navegador (capturas de `npm run check:layout`).

**CA-41: frase-momento en móvil** (R-43)

- Dado un ancho de 360 px
- Cuando se ve la banda de la frase
- Entonces su alto no supera el de la pantalla

Verificación: navegador.

**CA-42: bandas alineadas en escritorio** (R-40)

- Dado un ancho de 1440 px con barra de scroll
- Cuando se mide una banda
- Entonces empieza en x = 0 y termina en el borde de la pantalla

Verificación: navegador.

**CA-44: la página entra en un request** (R-45)

- Dado el sitio construido
- Cuando se comprime cada página HTML con gzip
- Entonces ninguna supera 14 000 bytes

Verificación: `npm run check:size`.

**CA-45: la home se lee en un minuto** (R-46)

- Dado el sitio construido
- Cuando se cuentan las palabras visibles del `<main>` de la home en cada idioma, sin SVG ni texto
  solo para lectores de pantalla
- Entonces ninguna supera 300, y ningún punto clave supera 15 palabras

Verificación: `npm run check:size` y `src/tests/data-integrity.test.ts`.

**CA-43: revisión completa** (R-44)

- Dado el build de producción servido con `astro preview`
- Cuando se corre `npm run check:layout`
- Entonces termina sin problemas en todos los anchos

Verificación: `npm run check:layout`.
