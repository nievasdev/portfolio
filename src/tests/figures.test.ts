import { describe, it, expect } from 'vitest';
import { figureParts } from '../lib/figures';

describe('figureParts: las partes de una cifra del hero, para contarla (R-55)', () => {
  it('separa el número del signo que lo sigue: «9+»', () => {
    expect(figureParts('9+')).toEqual({ prefix: '', integer: 9, separator: '', fraction: undefined, suffix: '+' });
  });

  it('o del que lo precede, como en español: «+9»', () => {
    expect(figureParts('+9')).toEqual({ prefix: '+', integer: 9, separator: '', fraction: undefined, suffix: '' });
  });

  it('separa entero, decimal y unidad: «3.5M»', () => {
    expect(figureParts('3.5M')).toEqual({ prefix: '', integer: 3, separator: '.', fraction: 5, suffix: 'M' });
  });

  it('respeta la coma decimal del español: «3,5M»', () => {
    expect(figureParts('3,5M')).toEqual({ prefix: '', integer: 3, separator: ',', fraction: 5, suffix: 'M' });
  });

  it('lee enteros de más de un dígito: «12»', () => {
    expect(figureParts('12')).toEqual({ prefix: '', integer: 12, separator: '', fraction: undefined, suffix: '' });
  });

  it('una palabra no es una cifra: «Uruleyes» no se cuenta', () => {
    expect(figureParts('Uruleyes')).toBeUndefined();
  });

  it('con dos decimales no se cuenta, porque el contador perdería el cero de «1.05»', () => {
    expect(figureParts('1.05M')).toBeUndefined();
  });

  it('con dos números sueltos tampoco: «3.5M2»', () => {
    expect(figureParts('3.5M2')).toBeUndefined();
  });
});
