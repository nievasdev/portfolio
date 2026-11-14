import type { Work } from '../content/schemas';

// getStaticPaths entries for the work detail pages of one language.
export function workPaths(works: Work[]) {
  return works.map((work) => ({
    params: { slug: work.slug },
    props: {
      work,
      others: works
        .filter((w) => w.slug !== work.slug)
        .map(({ slug, name }) => ({ slug, name })),
    },
  }));
}
