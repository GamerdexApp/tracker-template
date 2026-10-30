export interface ItemDefinition {
  id: string;
  name: string;
  maxLevel: number;
}

/** Sample game data. Replace it with the real things the tracker follows. Names are game data, so they stay in English. */
export const ITEM_DEFINITIONS: ItemDefinition[] = [
  { id: "alpha", name: "Alpha", maxLevel: 5 },
  { id: "bravo", name: "Bravo", maxLevel: 3 },
  { id: "charlie", name: "Charlie", maxLevel: 10 },
  { id: "delta", name: "Delta", maxLevel: 1 },
  { id: "echo", name: "Echo", maxLevel: 8 },
  { id: "foxtrot", name: "Foxtrot", maxLevel: 4 },
];
