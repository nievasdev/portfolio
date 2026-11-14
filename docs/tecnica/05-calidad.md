# 5. Calidad

## Comandos

| Comando | Qué verifica |
| --- | --- |
| `npm test` | Vitest (entorno node): contenido, esquemas, rutas, textos, lógica de `lib/`, CV |
| `npm run typecheck` | `tsc` sobre todo el proyecto (sin errores) |
| `npm run mutation` | Stryker sobre `src/lib`, `src/i18n` y `src/content/schemas.ts`; umbral **100 %** |
| `npm run check:layout` | El build en el navegador, en los 9 anchos de referencia |
| `npm run build` | El sitio y los dos PDF |

## Mutación (Stryker)

Configuración en `stryker.config.json`, con el runner de Vitest y cobertura por test. Reporte HTML
en `reports/mutation/` (no se versiona).

Lecciones de llevarlo al 100 %:

- **Calcular dentro de cada `it`**, no a nivel del `describe`: Stryker no puede atribuirle al test
  una ejecución que pasó durante la carga del archivo, y el mutante queda vivo.
- **Un mutante equivalente se resuelve reescribiendo el código**, nunca aceptándolo. Ejemplos: el
  `- 1` del contador de meses de `timeline.ts` (solo se usaban diferencias) y las variantes de la
  regex de `logos.ts` (todos los archivos empiezan con `<svg`).
- **Valores exactos** en los tests (posiciones de la línea de tiempo, el símbolo de un logo) matan
  mucho más que comparaciones del tipo «mayor que».
- Los archivos `.astro` no se pueden mutar: lo visual se cubre con criterios de aceptación
  revisados en el navegador.

## Revisión en el navegador (`scripts/check-layout.mjs`)

Necesita el build servido: `npm run build && npx astro preview --port 4329`. Abre Chrome headless
por DevTools, **emula cada ancho** (360, 390, 420, 769, 1080, 1200, 1400, 1440, 1920; Chrome
headless no baja de 500 px sin emulación) con movimiento reducido, y en la home y una página de
empresa en los dos idiomas falla si:

- el documento es más ancho que la pantalla (R-38), o
- un enlace o botón fuera de un párrafo mide menos de 24 × 24 px (R-39).

Guarda una captura de página completa por página y ancho en `.layout-check/` (no se versiona) para
comparar antes/después. Las imágenes con carga diferida salen grises en esas capturas: es la
herramienta, no el sitio.

## Fakes de test

- `fakes/astro-content.ts`: `getEntry` falso con `setEntries`, por el alias de `vitest.config.ts`.
- `fakes/recording-document.ts`: documento PDFKit que graba llamadas (ver 04-cv-pdf.md).
