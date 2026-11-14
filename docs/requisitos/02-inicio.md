# 2. Página de inicio

## Requerimientos

### Hero

- **R-07.** El hero muestra `mauro.nievas` con el punto dorado, el rol, la frase principal y los
  datos: años de experiencia, transacciones por día, industrias (Telecom · SaaS) y el acceso a
  Uruleyes.
- **R-08.** Los años de experiencia son los años completos desde el **1 de abril de 2017** a la
  fecha del build; el número sube con el primer build posterior a cada 1 de abril.
- **R-09.** «3.5M transactions/day» lleva al diagrama de transacciones de Antel y «Uruleyes · try
  it live» lleva al proyecto Uruleyes.
- **R-10.** Las acciones del hero son: *Contact me* (a la sección de contacto), *Download CV (PDF)*
  (el CV del idioma de la página), GitHub (`github.com/nievasdev`) y LinkedIn
  (`linkedin.com/in/mauronievasdev`).

### Frase-momento

- **R-11.** Debajo del hero, una banda marina muestra la frase «Every day, up to 3.5 million
  transactions run through Node.js services I built and maintain.» (y su versión en español) y,
  debajo, su prueba: el diagrama del flujo de transacciones de Antel, con los colores de la banda.

### Proyectos

- **R-12.** La sección de experiencia va antes que la de proyectos (la banda termina en Antel y la
  experiencia empieza por Antel; el reclutador ve primero los empleos). Uruleyes es el proyecto
  destacado: logo, descripción de una línea, diagrama de su arquitectura (que es el que muestra la
  prueba de carga), buscador «Try it», captura, stack y «Visit site». El rediseño de AntelTV es el
  caso de estudio: rol y qué construí en una línea cada uno, dos capturas y «Visit site». No hay
  otros proyectos: solo se muestra trabajo propio y verificable.
- **R-13.** El buscador «Try it» viene cargado con «inquilino que no paga el alquiler», la
  captura muestra los resultados de esa misma búsqueda y, al enviarlo, abre en
  otra pestaña `https://uruleyes.com/?q=<texto>`.
- **R-14.** Un dato que falta no se muestra: nunca aparece un `[placeholder]` ni el dato no
  verificable «99.9 %».

### Experiencia

- **R-15.** Arriba de la experiencia, una línea de tiempo de 2017 a hoy muestra cada empresa con un
  ancho proporcional a su duración, su logo y el punto dorado en «hoy». Cada segmento lleva a la
  entrada de esa empresa.
- **R-16.** Cada empresa muestra fechas, logo, nombre (enlace a su página, con una flecha que
  indica que se puede tocar), rol, uno o dos puntos clave que empiezan por la métrica en negrita y
  sus tres tecnologías principales. La lista completa de logros y tecnologías está en la página de
  la empresa y en el CV. El diagrama de Antel está en la banda (R-11) y en su página, no en su
  entrada de la home, y sus puntos clave no repiten los 3,5M.

### Sobre mí y contacto

- **R-17.** «About» tiene un párrafo, que no repite los años del hero, y el stack agrupado
  (Backend, Frontend, Data, DevOps & tools, Also).
- **R-18.** El cierre, en banda marina junto con el pie, muestra la invitación, el mail en grande,
  el CV, GitHub y LinkedIn.

### Contenido

- **R-19.** Cada tecnología se escribe siempre igual (Node.js, Next.js, GitLab CI/CD, Python…).
- **R-20.** La home no presenta la ciberseguridad como industria propia.

## Criterios de aceptación

**CA-07: años de experiencia antes y después del 1 de abril** (R-08)

- Dado el inicio de carrera el 1/4/2017
- Cuando se calcula el 31/3/2026 y el 1/4/2026
- Entonces da 8 y 9

Verificación: `src/tests/experience.test.ts`.

**CA-08: los años aparecen solo en el hero** (R-07, R-08, R-17)

- Dado el cálculo de años
- Cuando se arma el texto en inglés y en español
- Entonces el hero dice «N+» / «+N» y about no vuelve a nombrar los años

Verificación: `src/tests/experience.test.ts`.

**CA-09: accesos del hero** (R-09)

- Dado el hero
- Cuando el visitante toca «3.5M transactions/day» o «Uruleyes · try it live»
- Entonces la página baja al diagrama de la banda o al proyecto Uruleyes

Verificación: `src/tests/i18n.test.ts` (destinos) y navegador.

**CA-10: buscador de Uruleyes** (R-13)

- Dado el proyecto Uruleyes
- Cuando se lee su configuración de búsqueda
- Entonces apunta a `https://uruleyes.com/` con el parámetro `q` y el ejemplo «inquilino que no paga
  el alquiler», y el texto alternativo de la captura nombra esa búsqueda

Verificación: `src/tests/data-integrity.test.ts`, `src/tests/content-schema.test.ts`.

**CA-11: sin datos inventados** (R-14)

- Dado todo el contenido y los textos
- Cuando se buscan corchetes o «99.9»
- Entonces no aparece ninguno

Verificación: `src/tests/data-integrity.test.ts`.

**CA-12: línea de tiempo proporcional** (R-15)

- Dadas las cuatro empresas y la fecha 14/11/2026
- Cuando se calcula la línea de tiempo
- Entonces arranca en 2017, ningún segmento se superpone, Hacknoid es más ancho que Gestión Total y
  éste que Upshow, y Antel llega hasta hoy

Verificación: `src/tests/timeline.test.ts`.

**CA-13: métricas en negrita** (R-16)

- Dado un logro con `**3.5M transactions**`
- Cuando se muestra
- Entonces la cifra va en negrita y cualquier HTML del texto se escapa

Verificación: `src/tests/rich.test.ts`.

**CA-14: logos de las empresas** (R-15, R-16)

- Dado el logo de una empresa
- Cuando se arma la página
- Entonces se define una sola vez y se reutiliza en la línea de tiempo y en la entrada

Verificación: `src/tests/logos.test.ts`.

**CA-15: tecnologías con su nombre oficial** (R-19)

- Dadas todas las tecnologías de experiencia, proyectos y stack
- Cuando se comparan con la lista oficial
- Entonces todas están en la lista

Verificación: `src/tests/data-integrity.test.ts`.

**CA-16: sin ciberseguridad como industria** (R-20)

- Dados el hero, about y la meta description
- Cuando se buscan «cyber» o «ciber»
- Entonces no aparecen

Verificación: `src/tests/experience.test.ts`.

**CA-17: paridad de contenido entre idiomas** (R-12, R-16)

- Dadas las empresas y proyectos en inglés y en español
- Cuando se comparan
- Entonces tienen el mismo orden, logos, tecnologías, diagramas y búsqueda

Verificación: `src/tests/data-integrity.test.ts`.

**CA-18: experiencia antes que proyectos** (R-12)

- Dada la home y su menú
- Cuando se recorren de arriba hacia abajo o de izquierda a derecha
- Entonces aparece primero «experience» y después «projects»

Verificación: `src/tests/i18n.test.ts` (menú) y navegador.

**CA-46: la banda trae su prueba** (R-11, R-16)

- Dada la home
- Cuando se ve la banda marina
- Entonces debajo de la frase está el diagrama de transacciones, legible sobre el marino, y la
  entrada de Antel ya no lo repite

Verificación: navegador.

**CA-19: esquema del contenido** (R-12, R-16)

- Dado un proyecto o una empresa con un campo mal formado (diagrama desconocido, URL sin https,
  fecha que no es año-mes)
- Cuando se valida
- Entonces se rechaza

Verificación: `src/tests/content-schema.test.ts`.

**CA-20: archivos de logos e imágenes** (R-12, R-16)

- Dado el contenido
- Cuando se buscan sus logos y capturas
- Entonces todos existen en `public/`, las capturas en sus dos tamaños

Verificación: `src/tests/data-integrity.test.ts`, `src/tests/cv.test.ts`.
