# 7. Formulario de contacto

> **Estado: aprobado, en implementación.**

## Requerimientos

### Formulario

- **R-59.** El cierre (R-18) muestra un formulario con tres campos, cada uno con su etiqueta
  visible: nombre, correo y mensaje, y un botón «Send» / «Enviar». Funciona sin JavaScript: es un
  formulario HTML común que el navegador envía por POST.
- **R-60.** Debajo del formulario, en chico, sigue el correo como alternativa: «or write to
  mauro@nievas.dev» / «o escribime a mauro@nievas.dev», como enlace `mailto:`. El correo ya
  no va en grande.
- **R-61.** Los tres campos son obligatorios. El correo tiene que tener formato de correo; el nombre
  tiene como máximo 100 caracteres y el mensaje entre 10 y 5 000. El navegador lo controla antes de
  enviar y el servidor vuelve a controlar lo mismo, porque lo que hace el navegador se puede saltear.

### Después de enviar

- **R-62.** Si el mensaje sale bien, el visitante ve una página de agradecimiento en el idioma desde
  el que escribió (`/thanks` y `/es/thanks`): «Thanks, I'll get back to you soon.» /
  «Gracias, te respondo pronto.», con un enlace para volver al inicio.
- **R-63.** Si algo falla (datos que no pasan el control del servidor, o el correo no se pudo
  mandar), el visitante ve una página de error en su idioma (`/contact-error` y
  `/es/contact-error`) que le pide disculpas y le ofrece escribir directo al correo, con enlace para
  volver al inicio. El texto que había escrito no se conserva: por eso el correo directo está a mano.
- **R-64.** Las páginas de agradecimiento y de error no aparecen en buscadores (`noindex`) y tienen
  el mismo encabezado y pie que el resto del sitio.

### El correo que le llega a Mauro

- **R-65.** Cada envío válido le manda a Mauro un correo con asunto «nievas.dev: message from
  <nombre>», con el correo del visitante como dirección de respuesta (apretar «Responder» le escribe
  al visitante) y, en el cuerpo, en texto plano: nombre, correo, idioma de la página y mensaje.

### Spam y abuso

- **R-66.** El formulario tiene un campo trampa, invisible para las personas y para los lectores de
  pantalla, que los bots suelen completar. Si llega lleno, el visitante ve la página de
  agradecimiento como si todo hubiera salido bien, pero no se manda ningún correo.
- **R-67.** La dirección que recibe el formulario solo acepta envíos POST; cualquier otro método se
  rechaza.

## Criterios de aceptación

**CA-52: el formulario está en el cierre, sin JavaScript** (R-59, R-60, R-61)

- Dada la home en inglés y en español
- Cuando se lee su HTML
- Entonces hay un `<form method="post">` con nombre, correo y mensaje, cada uno con su etiqueta,
  obligatorios, el correo de tipo `email`, los máximos de largo de R-61, el idioma de la página y
  el campo trampa; debajo, el enlace `mailto:`; y la página no tiene ningún `<script>`

Verificación: `src/tests/contact-form.test.ts`.

**CA-53: el servidor controla los datos** (R-61)

- Dados un envío válido y envíos con un campo vacío, un correo sin formato, un nombre de 101
  caracteres, un mensaje de 9 y uno de 5 001
- Cuando el servidor los controla
- Entonces acepta el válido y rechaza cada uno de los otros

Verificación: `src/tests/contact.test.ts`.

**CA-54: envío correcto** (R-62, R-65)

- Dado un envío válido desde la página en español
- Cuando el servidor lo recibe y el correo sale bien
- Entonces manda un solo correo y lleva al visitante a `/es/thanks` (y a `/thanks` si vino desde la
  página en inglés)

Verificación: `src/tests/contact.test.ts`.

**CA-55: envío que falla** (R-63)

- Dado un envío inválido, y aparte un envío válido cuyo correo falla al mandarse
- Cuando el servidor los recibe
- Entonces el inválido no manda correo, y en los dos casos el visitante termina en la página de error
  de su idioma

Verificación: `src/tests/contact.test.ts`.

**CA-56: el correo que llega** (R-65)

- Dado un envío de «Ana» con correo `ana@example.com` y un mensaje que contiene `<b>hola</b>`
- Cuando se arma el correo
- Entonces el asunto es «nievas.dev: message from Ana», la respuesta va a `ana@example.com` y el
  cuerpo es texto plano con el nombre, el correo, el idioma y el mensaje tal cual, sin interpretar el
  HTML

Verificación: `src/tests/contact.test.ts`.

**CA-57: campo trampa** (R-66)

- Dado un envío válido con el campo trampa completo
- Cuando el servidor lo recibe
- Entonces no manda ningún correo y lleva al visitante a la página de agradecimiento

Verificación: `src/tests/contact.test.ts`.

**CA-58: solo POST** (R-67)

- Dado un pedido GET a la dirección del formulario
- Cuando el servidor lo recibe
- Entonces lo rechaza con el código 405 y no manda correo

Verificación: `src/tests/contact.test.ts`.

**CA-59: páginas de agradecimiento y de error** (R-62, R-63, R-64)

- Dadas las cuatro páginas (`/thanks`, `/es/thanks`, `/contact-error`, `/es/contact-error`)
- Cuando se arma el sitio
- Entonces cada una está en su idioma, tiene `noindex`, enlace al inicio, el encabezado y el pie, y
  las de error ofrecen el `mailto:`

Verificación: `src/tests/contact-form.test.ts`.

**CA-60: el formulario se ve bien en todos los anchos** (R-59, R-60)

- Dada la home en los anchos de referencia, en tema claro y oscuro
- Cuando se recorre el cierre
- Entonces el formulario no desborda, los campos y el botón son objetivos táctiles de tamaño
  suficiente, se lee bien sobre la banda marina y el foco del teclado se ve en cada campo

Verificación: `npm run check:layout` y navegador.
