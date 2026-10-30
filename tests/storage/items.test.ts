import { describe, expect, it } from "vitest";
import {
  createDefaultGameData,
  isAtTopLevel,
  itemProgress,
  itemsOf,
  setItemLevel,
} from "@/service/items";
import { ITEM_DEFINITIONS } from "@/data/items";
import { freshPlaythrough } from "./fixtures";

const alpha = ITEM_DEFINITIONS.find((item) => item.id === "alpha")!;

describe("items", () => {
  it("starts every item at level 0", () => {
    expect(createDefaultGameData().items).toHaveLength(ITEM_DEFINITIONS.length);
    expect(
      createDefaultGameData().items.every((item) => item.level === 0),
    ).toBe(true);
  });

  it("reads a missing item as level 0", () => {
    const playthrough = { ...freshPlaythrough("a", "A"), data: { items: [] } };
    expect(itemsOf(playthrough).every((entry) => entry.level === 0)).toBe(true);
  });

  it("keeps a level between 0 and the top level", () => {
    const playthrough = freshPlaythrough("a", "A");
    const level = (value: number) =>
      itemsOf(setItemLevel(playthrough, "alpha", value)).find(
        (entry) => entry.definition.id === "alpha",
      )!.level;
    expect(level(-3)).toBe(0);
    expect(level(2.4)).toBe(2);
    expect(level(99)).toBe(alpha.maxLevel);
  });

  it("changes only the item that was set and ignores an unknown id", () => {
    const playthrough = freshPlaythrough("a", "A");
    const next = setItemLevel(playthrough, "bravo", 2);
    expect(
      itemsOf(next)
        .filter((entry) => entry.level > 0)
        .map((entry) => entry.definition.id),
    ).toEqual(["bravo"]);
    expect(setItemLevel(playthrough, "nope", 1)).toBe(playthrough);
  });

  it("counts items at the top level and the levels reached", () => {
    let playthrough = freshPlaythrough("a", "A");
    playthrough = setItemLevel(playthrough, "alpha", alpha.maxLevel);
    playthrough = setItemLevel(playthrough, "bravo", 1);
    const progress = itemProgress(playthrough);
    expect(progress.done).toBe(1);
    expect(progress.total).toBe(ITEM_DEFINITIONS.length);
    expect(progress.levels).toBe(alpha.maxLevel + 1);
    expect(isAtTopLevel(itemsOf(playthrough)[0])).toBe(true);
  });
});
