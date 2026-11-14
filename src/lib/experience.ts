// First day of professional work (Gestión Total).
export const CAREER_START = new Date(2017, 3, 1); // April 1, 2017

// Completed years between `start` and `now`. Evaluated at build time:
// the site shows the new number after the first deploy past each April 1.
export function yearsSince(start: Date, now: Date = new Date()): number {
  let years = now.getFullYear() - start.getFullYear();
  const beforeAnniversary =
    now.getMonth() < start.getMonth() ||
    (now.getMonth() === start.getMonth() && now.getDate() < start.getDate());
  if (beforeAnniversary) years--;
  return Math.max(0, years);
}

export const yearsOfExperience = yearsSince(CAREER_START);
