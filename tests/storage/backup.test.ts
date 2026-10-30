import { describe, expect, it } from "vitest";
import type { AppData } from "@/types/app";
import {
  applyImport,
  backupFileName,
  parseBackup,
  parseBackupData,
  planImport,
} from "@/service/backup";
import { freshPlaythrough, savedFixtures } from "./fixtures";

const playthrough = (id: string, lastModified: string) => ({
  ...freshPlaythrough(id, id),
  lastModified,
});

describe("parseBackup", () => {
  it("rejects text that is not JSON", () => {
    expect(parseBackup("nope")).toEqual({ ok: false, error: "notJson" });
  });

  it("rejects a file without a playthroughs list", () => {
    expect(parseBackupData({ other: [] })).toEqual({
      ok: false,
      error: "playthroughsMissing",
    });
  });

  it("accepts what the app exports, unchanged", () => {
    const saved = savedFixtures();
    const result = parseBackupData(JSON.parse(JSON.stringify(saved)));
    expect(result).toMatchObject({ ok: true, stats: { read: 3, skipped: 0 } });
    expect(result.ok && result.data).toEqual(saved);
  });

  it("skips playthroughs without an id, a name or a data object, and repeated ids", () => {
    const good = freshPlaythrough("a", "A");
    const result = parseBackupData({
      playthroughs: [
        good,
        { ...good, id: "" },
        { ...good, id: "b", data: null },
        good,
        "x",
      ],
      activePlaythroughId: "a",
    });
    expect(result.ok && result.data.playthroughs).toHaveLength(1);
    expect(result.ok && result.stats).toEqual({ read: 5, skipped: 4 });
  });

  it("falls back to the most recently updated playthrough when the active id is missing", () => {
    const result = parseBackupData({
      playthroughs: [
        playthrough("old", "2026-01-01T00:00:00.000Z"),
        playthrough("new", "2026-03-01T00:00:00.000Z"),
      ],
      activePlaythroughId: "gone",
    });
    expect(result.ok && result.data.activePlaythroughId).toBe("new");
  });

  it("keeps fields it does not know", () => {
    const result = parseBackupData({ ...savedFixtures(), future: 1 });
    expect(result.ok && result.data).toMatchObject({ future: 1 });
  });
});

describe("import", () => {
  const current: AppData = {
    playthroughs: [
      playthrough("a", "2026-02-01T00:00:00.000Z"),
      playthrough("b", "2026-01-01T00:00:00.000Z"),
    ],
    activePlaythroughId: "b",
    settings: { theme: "dark" },
  };
  const incoming: AppData = {
    playthroughs: [
      playthrough("a", "2026-01-01T00:00:00.000Z"),
      playthrough("b", "2026-03-01T00:00:00.000Z"),
      playthrough("c", "2026-01-01T00:00:00.000Z"),
    ],
    activePlaythroughId: "c",
    settings: { theme: "light" },
  };

  it("plans merge rows", () => {
    expect(
      planImport(current, incoming, "merge").map((row) => row.result),
    ).toEqual(["kept", "updated", "added"]);
  });

  it("merge keeps the later copy, adds new ids and leaves settings and active alone", () => {
    const merged = applyImport(current, incoming, "merge");
    expect(merged.playthroughs.map((p) => [p.id, p.lastModified])).toEqual([
      ["a", "2026-02-01T00:00:00.000Z"],
      ["b", "2026-03-01T00:00:00.000Z"],
      ["c", "2026-01-01T00:00:00.000Z"],
    ]);
    expect(merged.settings).toEqual(current.settings);
    expect(merged.activePlaythroughId).toBe("b");
  });

  it("replace uses the file and marks playthroughs missing from it as removed", () => {
    expect(applyImport(current, incoming, "replace")).toBe(incoming);
    const rows = planImport(
      current,
      { ...incoming, playthroughs: [incoming.playthroughs[2]] },
      "replace",
    );
    expect(rows.map((row) => row.result)).toEqual([
      "replaced",
      "removed",
      "removed",
    ]);
  });
});

describe("backupFileName", () => {
  it("uses the local day", () => {
    expect(backupFileName(new Date(2026, 0, 5, 23, 59))).toBe(
      "tracker-backup-2026-01-05.json",
    );
  });
});
