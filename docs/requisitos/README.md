# Requisitos de nievas.dev

Esta carpeta describe **qué hace** el portfolio, sin entrar en cómo está hecho. Es la fuente de
verdad: cada cambio empieza acá y recién después se programa (ver el flujo en `CLAUDE.md`).

## Cómo leer estos documentos

Cada archivo es un área del sitio y tiene dos partes:

- **Requerimientos (R-xx):** reglas de lo que hace el sitio. Por ejemplo, «R-01. El sitio en
  inglés vive en `/` y el español en `/es`».
- **Criterios de aceptación (CA-xx):** casos concretos, escritos como «Dado… Cuando… Entonces…»,
  que comprueban uno o más requerimientos (entre paréntesis). Debajo de cada uno se indica cómo se
  verifica: un test automático (`src/tests/…`) o la revisión en el navegador
  (`npm run check:layout`, en los anchos de [06-diseno-y-anchos.md](06-diseno-y-anchos.md)).

Los números son únicos en toda la carpeta y no se reutilizan: si un requerimiento se elimina, su
número queda libre para siempre.

## Estado

Todo lo descrito acá está implementado. Esta versión es la **base aprobada**: los próximos cambios
se expresan como requerimientos y criterios nuevos, modificados o eliminados sobre esta base.

## Áreas

| Archivo | Área | Requerimientos | Criterios |
| --- | --- | --- | --- |
| [01-estructura-e-idiomas.md](01-estructura-e-idiomas.md) | Rutas, idiomas, encabezado | R-01 a R-06 | CA-01 a CA-06 |
| [02-inicio.md](02-inicio.md) | Página de inicio | R-07 a R-20 | CA-07 a CA-20, CA-46 |
| [03-paginas-de-empresa.md](03-paginas-de-empresa.md) | Página de cada empresa | R-21 a R-24 | CA-21 a CA-24 |
| [04-cv-pdf.md](04-cv-pdf.md) | CV descargable | R-25 a R-30 | CA-25 a CA-30 |
| [05-tema-y-movimiento.md](05-tema-y-movimiento.md) | Tema claro/oscuro, animaciones | R-31 a R-37 | CA-31 a CA-36 |
| [06-diseno-y-anchos.md](06-diseno-y-anchos.md) | Diseño en todos los anchos, peso y lectura | R-38 a R-46 | CA-37 a CA-45 |
