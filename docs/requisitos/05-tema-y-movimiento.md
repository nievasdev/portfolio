# 5. Tema y movimiento

## Requerimientos

- **R-31.** La primera visita sigue el tema claro u oscuro del sistema.
- **R-32.** Un botón en el encabezado cambia entre claro y oscuro; la elección se guarda y se
  mantiene entre páginas e idiomas, sin parpadeo al cargar. Sin JavaScript el botón no aparece.
- **R-33.** Los colores salen del logo: marino `#1E2A44`, blanco frío `#E6E9F0`, grises `#A9B0BF` y
  `#5B6478`, y un único acento dorado `#C9A227`.
- **R-34.** Al cargar, las llaves del logo se dibujan y aparece el punto dorado.
- **R-35.** Con el scroll: el punto del nombre cae, el punto de cada título de sección aterriza y su
  línea se dibuja, las palabras de la frase-momento se encienden de a una y los diagramas mueven
  sus transacciones.
- **R-36.** Con «reducir movimiento» activado nada se anima y todo el contenido queda visible.
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
- Entonces tienen animaciones activas atadas al scroll

Verificación: navegador sobre `astro preview` (el minificador de CSS debe ser esbuild).

**CA-34: reducir movimiento** (R-36)

- Dado «reducir movimiento» activado
- Cuando se recorre la home
- Entonces no hay animaciones y todo el texto está visible

Verificación: `npm run check:layout` (corre con movimiento reducido).

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
