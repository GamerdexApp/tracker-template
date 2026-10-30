import type { AppSettings, Playthrough } from "@/types/app";

export const defaultSettings: AppSettings = {};

/** Fills the optional fields that a save written by an older version does not have. Add one step for each new field. */
export const migratePlaythrough = (playthrough: Playthrough): Playthrough => {
  if (!playthrough.data) return playthrough;
  return { ...playthrough, data: { ...playthrough.data, items: playthrough.data.items ?? [] } };
};
