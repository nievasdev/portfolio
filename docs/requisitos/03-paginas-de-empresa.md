# 3. Página de cada empresa

## Requerimientos

- **R-21.** La página de una empresa muestra su logo grande, «← All experience», las fechas, el
  nombre, el rol y una introducción.
- **R-22.** Tiene tres bloques: **overview** (logros y contexto), **projects** (cada proyecto con su
  título en el margen) y un pie con el stack y enlaces a las otras empresas.
- **R-23.** Si la empresa tiene diagrama (Antel), se muestra debajo de los logros.
- **R-24.** Al ir de la home a una empresa, el nombre de la empresa se transforma en el título de la
  página (en los navegadores que lo soportan).

## Criterios de aceptación

**CA-21: otras empresas, nunca la propia** (R-22)

- Dada la página de una empresa
- Cuando se arma la lista de otras empresas
- Entonces están todas menos ella

Verificación: `src/tests/static-paths.test.ts`.

**CA-22: una página por empresa** (R-21)

- Dadas las empresas de un idioma
- Cuando se generan las páginas
- Entonces hay una por empresa, con su identificador

Verificación: `src/tests/static-paths.test.ts`.

**CA-23: logo de la empresa** (R-21)

- Dada una empresa con logo en `public/`
- Cuando se arma su página
- Entonces el logo va incrustado en el HTML, sin pedir otro archivo

Verificación: `src/tests/logos.test.ts`.

**CA-24: descripción para buscadores** (R-21)

- Dado un logro con métricas en negrita
- Cuando se usa como descripción de la página
- Entonces va sin las marcas de negrita

Verificación: `src/tests/rich.test.ts`.
