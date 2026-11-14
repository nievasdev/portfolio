import { describe, it, expect } from 'vitest';
import { rich, plain } from '../lib/rich';

describe('rich: métricas en negrita (CA-13)', () => {
  it('convierte **texto** en <b>texto</b>', () => {
    expect(rich('hasta **3.5M** por día')).toBe('hasta <b>3.5M</b> por día');
  });

  it('cierra cada negrita en su propio par de asteriscos', () => {
    expect(rich('**50%** y **85%**')).toBe('<b>50%</b> y <b>85%</b>');
  });

  it('escapa el HTML del contenido', () => {
    expect(rich(`<a href="x">'&'</a>`)).toBe('&lt;a href=&quot;x&quot;&gt;&#39;&amp;&#39;&lt;/a&gt;');
  });

  it('deja el texto sin marcas tal cual', () => {
    expect(rich('sin marcas')).toBe('sin marcas');
  });

  it('no toma un asterisco suelto como negrita', () => {
    expect(rich('**sin cerrar')).toBe('**sin cerrar');
  });
});

describe('plain: descripción sin marcas (CA-24)', () => {
  it('quita los asteriscos y deja el texto', () => {
    expect(plain('hasta **3.5M** y **85%**')).toBe('hasta 3.5M y 85%');
  });

  it('no escapa HTML, porque va a un atributo que Astro ya escapa', () => {
    expect(plain('a & b')).toBe('a & b');
  });
});
