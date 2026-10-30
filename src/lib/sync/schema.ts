import type { Schema } from "@gamerdexapp/gamerdex-sync";

const dateOrder = (value: unknown) => (typeof value === "string" ? Date.parse(value) || 0 : 0);
const numberOrder = (value: unknown) => Number(value) || 0;

const level: Schema = { type: "max", order: numberOrder };
const latest: Schema = { type: "max", order: dateOrder };

const trackedItem: Schema = { type: "object", fields: { level } };

const playthrough: Schema = {
  type: "object",
  fields: {
    lastModified: latest,
    data: { type: "object", fields: { items: { type: "keyed", key: "id", item: trackedItem } } },
  },
};

/**
 * The data file is the saved data of the app in the shape of `shape.ts`. Levels take the higher
 * side, because a level only goes up in the game. Lists of things with an id merge by id. A value
 * that cannot merge, such as a name, reports a conflict when both devices changed it, and the
 * player picks. The active playthrough belongs to each device and never syncs.
 * Add each new field of the game data here, with the rule that fits it.
 */
export const syncSchema: Schema = {
  type: "object",
  fields: {
    playthroughs: { type: "keyed", key: "id", item: playthrough },
    activePlaythroughId: { type: "local" },
    settings: { type: "object" },
  },
};
