import { describe, expect, it } from "vitest";
import {
  filterAndSort,
  nextActiveAfterDelete,
} from "@/service/playthroughList";
import { freshPlaythrough } from "./fixtures";

describe("playthrough list", () => {
  const a = {
    ...freshPlaythrough("a", "Alpha"),
    lastModified: "2026-01-01T00:00:00.000Z",
    createdAt: "2026-03-01T00:00:00.000Z",
  };
  const b = {
    ...freshPlaythrough("b", "beta"),
    lastModified: "2026-02-01T00:00:00.000Z",
    createdAt: "2026-01-01T00:00:00.000Z",
  };

  it("searches by name and sorts", () => {
    expect(filterAndSort([a, b], "ET", "name").map((v) => v.id)).toEqual(["b"]);
    expect(filterAndSort([a, b], "", "lastModified").map((v) => v.id)).toEqual([
      "b",
      "a",
    ]);
    expect(filterAndSort([a, b], "", "createdAt").map((v) => v.id)).toEqual([
      "a",
      "b",
    ]);
  });

  it("names the playthrough that becomes active after a delete", () => {
    expect(nextActiveAfterDelete([a, b], "b")?.id).toBe("a");
    expect(nextActiveAfterDelete([a], "a")).toBeNull();
  });
});
