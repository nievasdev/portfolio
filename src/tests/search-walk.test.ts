import { describe, it, expect } from 'vitest';
import { SEARCH_WALK, walkOffsets } from '../lib/search-walk';

// Stages of Uruleyes' diagram, left to right: sources, scraping, PostgreSQL, search API, app.
const [POSTGRES, API, APP] = [2, 3, 4];

describe('SEARCH_WALK: el camino de una búsqueda en el diagrama de Uruleyes (R-56)', () => {
  it('sale de la app, llega a PostgreSQL por la API y vuelve por el mismo camino', () => {
    expect(SEARCH_WALK).toEqual([APP, API, POSTGRES, API, APP]);
  });
});

describe('walkOffsets: cuánto se corre la píldora en cada parada (R-56)', () => {
  it('mide desde la app, a la izquierda y de vuelta, con las etapas del diagrama ancho', () => {
    const stageX = [1, 154, 306, 459, 611];

    expect(walkOffsets(stageX)).toEqual([0, -152, -305, -152, 0]);
  });
});
