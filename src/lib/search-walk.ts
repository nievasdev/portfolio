// Uruleyes' diagram, left to right: sources, scraping, PostgreSQL, search API, app. Sources and
// scraping only load data; a search goes app → API → PostgreSQL and its results come back the
// same way (R-56). Each entry is a stop: the index of the stage the query sits on.
export const SEARCH_WALK: readonly number[] = [4, 3, 2, 3, 4];

// How far the query moves from its first stop to each stop, given each stage's x.
export function walkOffsets(stageX: readonly number[]): number[] {
  const start = stageX[SEARCH_WALK[0]];
  return SEARCH_WALK.map((stage) => stageX[stage] - start);
}
