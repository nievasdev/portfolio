# Documentación técnica de nievas.dev

**Cómo está hecho** el portfolio. **Qué hace** está en [../requisitos/](../requisitos/README.md).

Regla: un cambio de código actualiza en el mismo commit el documento que lo describe.

| Archivo | Tema |
| --- | --- |
| [01-arquitectura.md](01-arquitectura.md) | Stack, carpetas, rutas por idioma, cero JS |
| [02-contenido.md](02-contenido.md) | Colecciones, esquemas Zod, diccionario de textos |
| [03-estilos-y-movimiento.md](03-estilos-y-movimiento.md) | Tokens, bandas, tema, animaciones con CSS, View Transitions |
| [04-cv-pdf.md](04-cv-pdf.md) | Generación del CV: Facade + lista de secciones |
| [05-calidad.md](05-calidad.md) | Tests, Stryker, revisión en el navegador, tipos |

## Decisiones que no hay que deshacer sin leer el porqué

- **Minificador de CSS: esbuild, no lightningcss.** lightningcss mete `animation-timeline` dentro del
  atajo `animation`; el navegador descarta esa regla y todas las animaciones atadas al scroll
  desaparecen solo en producción. Ver [03-estilos-y-movimiento.md](03-estilos-y-movimiento.md).
- **Las bandas a todo el ancho no usan `100vw`.** `100vw` incluye la barra de scroll y las corría
  7 px. Ver [03-estilos-y-movimiento.md](03-estilos-y-movimiento.md).
- **Las fuentes del PDF son WOFF, no WOFF2.** fontkit no puede recortar WOFF2 al incrustarla
  (`ERR_BUFFER_OUT_OF_BOUNDS`). Ver [04-cv-pdf.md](04-cv-pdf.md).
- **Tocar `src/content/schemas.ts` exige limpiar la caché de contenido en desarrollo.** Astro solo
  revalida si cambia `config.ts`. Ver [02-contenido.md](02-contenido.md).
