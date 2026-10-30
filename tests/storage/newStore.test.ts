import { beforeEach, describe, expect, it, vi } from "vitest";
import type { AppData } from "@/types/app";
import * as appData from "@/service/appData";
import { defaultSettings } from "@/service/migrate";
import { STORAGE_KEY, storageService } from "@/service/storage";
import { freshPlaythrough, savedFixtures } from "./fixtures";

const seed = (data: unknown) =>
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
const stored = () =>
  JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null") as AppData;

beforeEach(() => localStorage.clear());

describe("reading saves", () => {
  it("starts with default settings when nothing is stored", () => {
    expect(storageService.load()).toEqual({
      playthroughs: [],
      activePlaythroughId: null,
      settings: defaultSettings,
    });
  });

  it("fills the items list of a save that has none", () => {
    seed(savedFixtures());
    const old = storageService
      .load()
      .playthroughs.find((p) => p.id === "old-1");
    expect(old?.data.items).toEqual([]);
  });

  it("returns the same object until the stored text changes", () => {
    seed(savedFixtures());
    const first = storageService.load();
    expect(storageService.load()).toBe(first);

    seed({ ...savedFixtures(), activePlaythroughId: "a" });
    expect(storageService.load()).not.toBe(first);
  });

  it("keeps fields it does not know", () => {
    seed(savedFixtures());
    const playthrough = storageService
      .load()
      .playthroughs.find((p) => p.id === "unknown-1");
    expect(playthrough).toMatchObject({ futureField: { keep: true } });
  });

  it("leaves a never set optional field absent after a save with no edit", () => {
    seed(savedFixtures());
    storageService.save(storageService.load());
    const playthrough = stored().playthroughs.find((p) => p.id === "a");
    expect(playthrough).not.toHaveProperty("description");
    expect(stored().settings).toEqual({ theme: "dark" });
  });

  it("keeps the new optional settings through a load and save", () => {
    seed({
      ...savedFixtures(),
      settings: { ...defaultSettings, theme: "dark", ui: { hideDone: true } },
    });
    storageService.save(storageService.load());
    expect(stored().settings).toMatchObject({
      theme: "dark",
      ui: { hideDone: true },
    });
  });
});

describe("editing", () => {
  it("changes lastModified only on the edited playthrough", () => {
    const now = new Date("2026-02-01T00:00:00.000Z");
    const next = appData.updatePlaythrough(
      savedFixtures(),
      "a",
      { name: "X" },
      now,
    );
    expect(next.playthroughs.map((p) => p.lastModified)).toEqual([
      now.toISOString(),
      "2026-01-05T10:00:00.000Z",
      "2026-01-05T10:00:00.000Z",
    ]);
  });

  it("makes the first playthrough active and leaves the active one alone after that", () => {
    const first = appData.addPlaythrough(
      { playthroughs: [], activePlaythroughId: null },
      freshPlaythrough("x", "X"),
    );
    expect(first.activePlaythroughId).toBe(first.playthroughs[0].id);

    const second = appData.addPlaythrough(first, freshPlaythrough("y", "Y"));
    expect(second.activePlaythroughId).toBe(first.activePlaythroughId);

    const third = appData.addPlaythrough(second, freshPlaythrough("z", "Z"), {
      makeActive: true,
    });
    expect(third.activePlaythroughId).toBe(third.playthroughs[2].id);
  });

  it("deleting the active playthrough activates the most recently updated one", () => {
    const data: AppData = {
      playthroughs: [
        {
          ...freshPlaythrough("a", "A"),
          lastModified: "2026-01-01T00:00:00.000Z",
        },
        {
          ...freshPlaythrough("b", "B"),
          lastModified: "2026-03-01T00:00:00.000Z",
        },
        {
          ...freshPlaythrough("c", "C"),
          lastModified: "2026-02-01T00:00:00.000Z",
        },
      ],
      activePlaythroughId: "c",
    };
    expect(appData.deletePlaythrough(data, "c").activePlaythroughId).toBe("b");
  });

  it("keeps settings when a playthrough is added or deleted", () => {
    const withSettings = savedFixtures();
    expect(
      appData.addPlaythrough(withSettings, freshPlaythrough("n", "N")).settings,
    ).toEqual(withSettings.settings);
    expect(appData.deletePlaythrough(withSettings, "a").settings).toEqual(
      withSettings.settings,
    );
  });
});

describe("saving", () => {
  it("reports a failed write", () => {
    const spy = vi.spyOn(localStorage, "setItem").mockImplementation(() => {
      throw new Error("quota");
    });
    expect(storageService.save(savedFixtures())).toBe(false);
    spy.mockRestore();
  });

  it("notifies subscribers after a save and a clear", () => {
    let calls = 0;
    const unsubscribe = storageService.subscribe(() => (calls += 1));
    storageService.save(savedFixtures());
    storageService.clear();
    unsubscribe();
    expect(calls).toBe(2);
  });
});
