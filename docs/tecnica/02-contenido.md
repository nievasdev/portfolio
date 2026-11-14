# 2. Contenido

## Colecciones

| Colección | Archivos | Qué tiene |
| --- | --- | --- |
| `works` | `src/content/works/{en,es}.json` | Empresas: slug, fechas año-mes, rol, `keyPoints` (1–2, para la home), `highlights` (todos, para la página de la empresa y el CV) con `**métricas**`, tecnologías, logo, diagrama opcional |
| `projects` | `src/content/projects/{en,es}.json` | Proyectos: tipo (`featured`, `case`, `earlier`), logo, capturas, búsqueda «Try it», diagrama |
| `cv` | `src/content/cv/{en,es}.json` | Lo que solo usa el CV: titular, resumen con `{years}`, formación, idiomas, referencias |

Los esquemas viven en `src/content/schemas.ts` (Zod) y los importan tanto `config.ts` como los
tests, así los tests validan el esquema real.

Los dos idiomas tienen la misma forma: mismos slugs, orden, logos, tecnologías, diagramas y
búsqueda (lo controla `data-integrity.test.ts`).

## Textos fijos

`src/i18n/ui.ts` tiene los textos de la interfaz por idioma; el tipo del español es el del inglés,
y `i18n.test.ts` exige las mismas claves y ninguna vacía. Los años de experiencia se interpolan
desde `lib/experience.ts`.

## Reglas de contenido que controlan los tests

- Ningún `[placeholder]` ni «99.9».
- Cada tecnología con su nombre oficial (lista en `data-integrity.test.ts`).
- Logos y capturas existen en `public/`; los logos están recortados a su dibujo.
- Cada punto clave tiene 15 palabras o menos, y `npm run check:size` corta la home en 300 palabras
  visibles por idioma (R-46). Si un texto nuevo no entra, va a `highlights`, que se ven en la
  página de la empresa.

## Gotcha: caché de contenido en desarrollo

Astro decide si revalidar el contenido mirando solo `config.ts`. Si cambia `schemas.ts`, el
servidor de desarrollo sigue usando datos validados con el esquema viejo y **descarta en silencio
los campos nuevos**, incluso reiniciando. Solución:

```bash
rm .astro/data-store.json   # y reiniciar `npm run dev`
```

El build de producción no tiene el problema.
