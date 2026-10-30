import { ITEM_DEFINITIONS, type ItemDefinition } from "@/data/items";
import type { GameData, Playthrough } from "@/types/app";

export interface ItemEntry {
  definition: ItemDefinition;
  level: number;
}

export interface ItemProgress {
  done: number;
  total: number;
  levels: number;
  maxLevels: number;
}

export const createDefaultGameData = (): GameData => ({
  items: ITEM_DEFINITIONS.map(({ id }) => ({ id, level: 0 })),
});

/** Every item of the game data, with the saved level. An item that is not saved yet is at level 0. */
export const itemsOf = (playthrough: Playthrough): ItemEntry[] => {
  const saved = new Map(playthrough.data.items.map((item) => [item.id, item.level]));
  return ITEM_DEFINITIONS.map((definition) => ({ definition, level: saved.get(definition.id) ?? 0 }));
};

export const isAtTopLevel = ({ definition, level }: ItemEntry): boolean => level >= definition.maxLevel;

export const itemProgress = (playthrough: Playthrough): ItemProgress => {
  const entries = itemsOf(playthrough);
  return {
    done: entries.filter(isAtTopLevel).length,
    total: entries.length,
    levels: entries.reduce((sum, { level }) => sum + level, 0),
    maxLevels: entries.reduce((sum, { definition }) => sum + definition.maxLevel, 0),
  };
};

/** Returns the playthrough with the level set, kept between 0 and the top level of the item. */
export const setItemLevel = (playthrough: Playthrough, id: string, level: number): Playthrough => {
  const definition = ITEM_DEFINITIONS.find((item) => item.id === id);
  if (!definition) return playthrough;
  const next = Math.min(definition.maxLevel, Math.max(0, Math.round(level)));
  const items = itemsOf(playthrough).map((entry) => ({
    id: entry.definition.id,
    level: entry.definition.id === id ? next : entry.level,
  }));
  return { ...playthrough, data: { ...playthrough.data, items } };
};
