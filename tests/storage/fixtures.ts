import type { AppData, Playthrough } from "@/types/app";
import { createDefaultGameData } from "@/service/items";

const timestamp = "2026-01-05T10:00:00.000Z";

export const freshPlaythrough = (id: string, name: string): Playthrough => ({
  id,
  name,
  createdAt: timestamp,
  lastModified: timestamp,
  data: createDefaultGameData(),
});

/** A save written before the items list existed. */
export const oldPlaythroughWithoutItems = (): Playthrough =>
  ({
    ...freshPlaythrough("old-1", "Old playthrough"),
    data: {},
  }) as unknown as Playthrough;

export const playthroughWithUnknownFields = (): Playthrough =>
  ({
    ...freshPlaythrough("unknown-1", "Has extras"),
    futureField: { keep: true },
    description: "kept",
  }) as Playthrough;

export const savedFixtures = (): AppData => ({
  playthroughs: [
    freshPlaythrough("a", "First"),
    oldPlaythroughWithoutItems(),
    playthroughWithUnknownFields(),
  ],
  activePlaythroughId: "old-1",
  settings: { theme: "dark" },
});
