# 5. Tema y movimiento

## Requerimientos

- **R-31.** La primera visita sigue el tema claro u oscuro del sistema.
- **R-32.** Un botón en el encabezado cambia entre claro y oscuro; la elección se guarda y se
  mantiene entre páginas e idiomas, sin parpadeo al cargar. Sin JavaScript el botón no aparece.
- **R-33.** Los colores salen del logo: marino `#1E2A44`, blanco frío `#E6E9F0`, grises `#A9B0BF` y
  `#5B6478`, y un único acento dorado `#C9A227`.
- **R-34.** Al cargar, las llaves del logo se dibujan y aparece el punto dorado.
- **R-35.** Con el scroll: el punto del nombre cae, el punto de cada título de sección aterriza y su
  línea se dibuja y las palabras de la frase-momento se encienden de a una. Los diagramas mueven
  sus transacciones todo el tiempo, sin depender del scroll ni del navegador: un sistema en
  marcha.
- **R-36.** Con «reducir movimiento» activado nada se anima y todo el contenido queda visible.
- **R-56.** En el diagrama de Uruleyes, una consulta («query» / «consulta») recorre las cinco
  etapas en un bucle de 8 s y se detiene arriba de cada una mientras esa etapa se ilumina en
  dorado; en pantallas chicas solo se iluminan las etapas, una tras otra.
- **R-55.** Al cargar, las cifras del hero que son número («9+», «3.5M»; «+9», «3,5M» en español)
  cuentan desde 0 hasta su valor en ~1,4 s, respetando el formato de cada idioma; las palabras
  («Uruleyes») se ven desde el principio. Solo se cuentan números con un decimal como máximo. El
  valor real está siempre en el texto: es lo que leen los lectores de pantalla y lo que se ve sin
  movimiento.
- **R-37.** Fuera del botón de tema, el sitio no usa JavaScript.

## Criterios de aceptación

**CA-31: tema elegido en otra página** (R-32)

- Dado que el visitante eligió el tema claro en la home
- Cuando abre `/es/work/antel`
- Entonces la página carga directamente en claro

Verificación: navegador.

**CA-32: botón accesible** (R-32)

- Dado el tema oscuro activo
- Cuando un lector de pantalla lee el botón
- Entonces anuncia «Switch to light theme» / «Cambiar a tema claro»

Verificación: navegador.

**CA-33: animaciones en producción** (R-35)

- Dado el build de producción
- Cuando se inspecciona la frase-momento, los títulos y los diagramas
- Entonces la frase y los títulos tienen animaciones atadas al scroll, y las transacciones de los
  diagramas se mueven solas: sin scroll, cambian de posición de un segundo al siguiente

Verificación: navegador sobre `astro preview` (el minificador de CSS debe ser esbuild);
`npm run check:motion` para los diagramas.

**CA-34: reducir movimiento** (R-36)

- Dado «reducir movimiento» activado
- Cuando se recorre la home
- Entonces no hay animaciones y todo el texto está visible

Verificación: `npm run check:layout` (corre con movimiento reducido) y `npm run check:motion`
(con movimiento reducido los diagramas quedan quietos).

**CA-48: las cifras cuentan** (R-55)

- Dada la home en inglés y en español
- Cuando carga con movimiento, y cuando carga con «reducir movimiento»
- Entonces con movimiento, a los 0,35 s las cifras muestran un valor menor al final, «Uruleyes»
  está visible y a los 2,3 s queda el texto real; con movimiento reducido el texto real se ve desde
  el principio

Verificación: `src/tests/figures.test.ts` (`figureParts`) y `npm run check:motion`.

**CA-49: una búsqueda recorre Uruleyes** (R-56, R-36)

- Dada la home en escritorio, con las animaciones congeladas en la mitad de cada parada
- Cuando se mira el diagrama de Uruleyes
- Entonces la consulta está sobre la etapa 1, 2, 3, 4 y 5 en orden y solo esa etapa está
  iluminada; con «reducir movimiento» no se ilumina ninguna

Verificación: `npm run check:motion`.

**CA-35: sin scripts de más** (R-37)

- Dado el HTML de la home
- Cuando se cuentan sus `<script>`
- Entonces son solo los dos del tema

Verificación: revisión del build.

**CA-36: paleta** (R-33)

- Dado el CSS
- Cuando se listan los colores de marca
- Entonces son solo los de R-33

Verificación: revisión de `src/styles/global.css`.
