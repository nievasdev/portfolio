# 4. CV descargable

## Requerimientos

- **R-25.** El CV se genera en cada build, en inglés (`/cv.pdf`) y en español (`/es/cv.pdf`), a
  partir del mismo contenido que la web.
- **R-26.** El resumen usa los años de experiencia de R-08.
- **R-27.** La experiencia muestra rol, empresa, lugar, fechas con mes («Apr 2022 – Present» /
  «abr 2022 – Actualidad»), los mismos logros que la web y las tecnologías.
- **R-28.** Incluye proyectos, formación, el mismo stack de «About», idiomas y referencias
  completas.
- **R-29.** Ninguna sección se corta entre páginas si entra completa en la siguiente.
- **R-30.** Una puntuación pegada a una métrica en negrita nunca queda sola al principio de una
  línea.

## Criterios de aceptación

**CA-25: CV válido en los dos idiomas** (R-25)

- Dado el contenido en inglés y en español
- Cuando se genera el CV
- Entonces es un PDF válido

Verificación: `src/tests/cv.test.ts`.

**CA-26: años, empresas y contacto** (R-26, R-27)

- Dado el CV generado con 12 años
- Cuando se lee su texto
- Entonces dice «12+ years», nombra Antel, Upshow y Hacknoid, y enlaza el mail

Verificación: `src/tests/cv.test.ts`.

**CA-27: meses con nombre** (R-27)

- Dado «2022-04»
- Cuando se formatea en inglés y «2021-07» en español
- Entonces da «Apr 2022» y «jul 2021»

Verificación: `src/tests/cv.test.ts`.

**CA-28: la puntuación acompaña a la negrita** (R-30)

- Dado «up to **40%**. Done»
- Cuando se separa en tramos
- Entonces el tramo en negrita es «40%.»

Verificación: `src/tests/cv.test.ts`.

**CA-29: maquetación estable** (R-27, R-28, R-29)

- Dado el contenido actual
- Cuando se arma el CV
- Entonces la secuencia de dibujo coincide con la aprobada (saltos de página incluidos)

Verificación: `src/tests/cv-layout.test.ts`.

**CA-30: el CV se sirve como PDF** (R-25)

- Dado el idioma de la página
- Cuando se pide su CV
- Entonces la respuesta es `application/pdf` con el contenido de ese idioma

Verificación: `src/tests/cv-route.test.ts`.
