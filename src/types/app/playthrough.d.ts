import type { GameData } from "./game";

export interface Playthrough {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  lastModified: string;
  data: GameData;
}

export type ThemeChoice = "light" | "dark" | "system";

export interface UiSettings {
  /** Hides items that reached their top level. */
  hideDone?: boolean;
}

export interface AppSettings {
  theme?: ThemeChoice;
  ui?: UiSettings;
}

export interface AppData {
  playthroughs: Playthrough[];
  activePlaythroughId: string | null;
  settings?: AppSettings;
}

export type SortOption = "lastModified" | "name" | "createdAt";
