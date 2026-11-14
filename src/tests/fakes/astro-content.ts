// Stand-in for Astro's `astro:content` virtual module (aliased in vitest.config.ts).
// Tests register the entries a collection returns with `setEntries`.
type Entry = { data: unknown };

const store = new Map<string, Entry>();

export function setEntries(entries: Record<string, unknown>): void {
  store.clear();
  for (const [key, data] of Object.entries(entries)) store.set(key, { data });
}

export async function getEntry(collection: string, id: string): Promise<Entry | undefined> {
  return store.get(`${collection}/${id}`);
}
