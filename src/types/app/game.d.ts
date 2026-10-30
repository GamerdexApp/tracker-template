/** One thing the player tracks, such as a collectible or an upgrade. */
export interface TrackedItem {
  id: string;
  level: number;
}

/**
 * The saved progress of one playthrough. This is the part of the data model that each game replaces.
 * Add new fields as optional so that saves and sync files written by an older version stay valid.
 */
export interface GameData {
  items: TrackedItem[];
}
