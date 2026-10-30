import type { Playthrough, SortOption } from "@/types/app";

const timestamp = (iso: string) => Date.parse(iso) || 0;

const SORTERS: Record<SortOption, (a: Playthrough, b: Playthrough) => number> = {
  lastModified: (a, b) => timestamp(b.lastModified) - timestamp(a.lastModified),
  name: (a, b) => a.name.localeCompare(b.name),
  createdAt: (a, b) => timestamp(b.createdAt) - timestamp(a.createdAt),
};

export const filterAndSort = (
  playthroughs: Playthrough[],
  search: string,
  sort: SortOption,
): Playthrough[] => {
  const needle = search.trim().toLowerCase();
  return playthroughs.filter((playthrough) => playthrough.name.toLowerCase().includes(needle)).sort(SORTERS[sort]);
};

/** The playthrough that becomes active when the active `deletingId` is deleted, as `deletePlaythrough` picks it. */
export const nextActiveAfterDelete = (playthroughs: Playthrough[], deletingId: string): Playthrough | null =>
  playthroughs.filter((playthrough) => playthrough.id !== deletingId).sort(SORTERS.lastModified)[0] ?? null;

const DAY_MS = 86_400_000;

/** Whole days from `since` to `now`, or null when the date was never set. */
export const daysSince = (since: string | undefined, now = new Date()): number | null => {
  if (!since) return null;
  const start = Date.parse(since);
  return Number.isNaN(start) ? null : Math.max(0, Math.floor((now.getTime() - start) / DAY_MS));
};
