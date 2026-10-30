import {
  type FirstSyncChoice,
  MemoryProvider,
  sync,
  type SyncResult,
  type SyncState,
} from "@gamerdexapp/gamerdex-sync";
import { describe, expect, it } from "vitest";
import type { AppData, Playthrough } from "@/types/app";
import { isSyncDocument } from "@/lib/sync/document";
import { syncSchema } from "@/lib/sync/schema";
import { fromSyncShape, toSyncShape } from "@/lib/sync/shape";
import { setItemLevel } from "@/service/items";
import { APP_ID } from "@/data/site";
import { freshPlaythrough } from "./fixtures";

const populated = (id: string, name: string): Playthrough =>
  setItemLevel(
    setItemLevel(freshPlaythrough(id, name), "alpha", 3),
    "bravo",
    1,
  );

const level = (playthrough: Playthrough, itemId: string) =>
  playthrough.data.items.find((item) => item.id === itemId)?.level;

class Device {
  state: SyncState | null = null;
  constructor(
    readonly id: string,
    public playthroughs: Playthrough[],
    public activePlaythroughId: string | null = playthroughs[0]?.id ?? null,
  ) {}

  document(): AppData {
    // Saved data always passes through JSON, which drops undefined fields.
    return JSON.parse(
      JSON.stringify({
        playthroughs: this.playthroughs,
        activePlaythroughId: this.activePlaythroughId,
      }),
    );
  }

  async sync(
    cloud: MemoryProvider,
    firstSync?: FirstSyncChoice,
  ): Promise<SyncResult> {
    const result = await sync({
      appId: APP_ID,
      deviceId: this.id,
      deviceName: this.id,
      provider: cloud,
      schema: syncSchema,
      local: toSyncShape(this.document()),
      state: this.state,
      firstSync,
      validate: isSyncDocument,
      now: () => "2026-01-02T00:00:00.000Z",
    });
    if (result.status === "synced") {
      this.playthroughs = fromSyncShape(result.data).playthroughs;
      this.state = structuredClone(result.state);
    }
    return result;
  }

  get(id: string) {
    return this.playthroughs.find((playthrough) => playthrough.id === id)!;
  }
}

const synced = async (result: Promise<SyncResult>) => {
  const outcome = await result;
  if (outcome.status !== "synced") throw new Error("expected a finished sync");
  return outcome;
};

const twoDevices = async () => {
  const cloud = new MemoryProvider();
  const a = new Device("a", [populated("p1", "Main")]);
  await a.sync(cloud);
  const b = new Device("b", []);
  await synced(b.sync(cloud, "keep-cloud"));
  return { cloud, a, b };
};

/** Saved data goes through JSON like in the browser, so a change never touches another device's copy. */
const edit = (
  device: Device,
  id: string,
  change: (playthrough: Playthrough) => void,
) => change(device.get(id));

describe("The sync shape", () => {
  it("round trips the saved data without losing anything", () => {
    const document: AppData = {
      playthroughs: [populated("p1", "Main")],
      activePlaythroughId: "p1",
    };
    expect(fromSyncShape(toSyncShape(document))).toEqual(document);
  });

  it("accepts a whole document and refuses a broken one", () => {
    expect(
      isSyncDocument(
        toSyncShape({
          playthroughs: [populated("p1", "Main")],
          activePlaythroughId: null,
        }),
      ),
    ).toBe(true);
    expect(isSyncDocument({ playthroughs: "no" })).toBe(false);
  });
});

describe("Sync between two devices", () => {
  it("copies the playthroughs to a second device", async () => {
    const { b } = await twoDevices();
    expect(level(b.get("p1"), "alpha")).toBe(3);
  });

  it("keeps the changes of two devices that edited different items", async () => {
    const { cloud, a, b } = await twoDevices();
    a.playthroughs = [setItemLevel(a.get("p1"), "alpha", 4)];
    b.playthroughs = [setItemLevel(b.get("p1"), "bravo", 2)];
    await synced(a.sync(cloud));
    await synced(b.sync(cloud));
    await synced(a.sync(cloud));
    for (const device of [a, b]) {
      expect(level(device.get("p1"), "alpha")).toBe(4);
      expect(level(device.get("p1"), "bravo")).toBe(2);
    }
  });

  it("takes the higher level when both devices raised the same item", async () => {
    const { cloud, a, b } = await twoDevices();
    a.playthroughs = [setItemLevel(a.get("p1"), "alpha", 4)];
    b.playthroughs = [setItemLevel(b.get("p1"), "alpha", 5)];
    await synced(a.sync(cloud));
    const result = await synced(b.sync(cloud));
    expect(result.conflicts).toEqual([]);
    expect(level(b.get("p1"), "alpha")).toBe(5);
  });

  it("carries a reset to the other device when it did not change that level", async () => {
    const { cloud, a, b } = await twoDevices();
    a.playthroughs = [setItemLevel(a.get("p1"), "alpha", 0)];
    await synced(a.sync(cloud));
    await synced(b.sync(cloud));
    expect(level(b.get("p1"), "alpha")).toBe(0);
  });

  it("adds an item that only one device has", async () => {
    const { cloud, a, b } = await twoDevices();
    edit(a, "p1", (playthrough) =>
      playthrough.data.items.push({ id: "future", level: 2 }),
    );
    await synced(a.sync(cloud));
    await synced(b.sync(cloud));
    expect(level(b.get("p1"), "future")).toBe(2);
  });

  it("reports a conflict when both devices renamed the playthrough", async () => {
    const { cloud, a, b } = await twoDevices();
    edit(a, "p1", (playthrough) => (playthrough.name = "Alpha"));
    edit(b, "p1", (playthrough) => (playthrough.name = "Beta"));
    await synced(a.sync(cloud));
    const result = await synced(b.sync(cloud));
    expect(
      result.conflicts.map((conflict) => conflict.path.join(".")),
    ).toContain("playthroughs.p1.name");
  });

  it("never changes the active playthrough of a device", async () => {
    const { cloud, a, b } = await twoDevices();
    b.activePlaythroughId = "p1";
    a.activePlaythroughId = null;
    edit(a, "p1", (playthrough) => (playthrough.name = "Renamed"));
    await synced(a.sync(cloud));
    await synced(b.sync(cloud));
    expect(b.activePlaythroughId).toBe("p1");
    expect(a.activePlaythroughId).toBeNull();
  });

  it("deletes a playthrough on the other device when nothing there changed it", async () => {
    const { cloud, a, b } = await twoDevices();
    a.playthroughs = [];
    await synced(a.sync(cloud));
    await synced(b.sync(cloud));
    expect(b.playthroughs).toEqual([]);
  });

  it("keeps a playthrough that one device deleted and the other edited, and reports it", async () => {
    const { cloud, a, b } = await twoDevices();
    a.playthroughs = [];
    b.playthroughs = [setItemLevel(b.get("p1"), "alpha", 5)];
    await synced(a.sync(cloud));
    const result = await synced(b.sync(cloud));
    expect(b.playthroughs).toHaveLength(1);
    expect(result.conflicts.map((conflict) => conflict.kind)).toContain(
      "delete-edit",
    );
  });

  it("asks before replacing anything on a first sync when both sides have data", async () => {
    const cloud = new MemoryProvider();
    await new Device("a", [populated("p1", "Main")]).sync(cloud);
    const result = await new Device("b", [populated("p2", "Other")]).sync(
      cloud,
    );
    expect(result.status).toBe("needs-choice");
  });
});
