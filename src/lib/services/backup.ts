import { BACKUP_FILE_PREFIX } from "@/data/site";
import type { AppData, Playthrough } from "@/types/app";

export interface ParseStats {
  read: number;
  skipped: number;
}

export type BackupError = "notJson" | "playthroughsMissing";

type ParseResult =
  | { ok: true; data: AppData; stats: ParseStats }
  | { ok: false; error: BackupError };

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const hasGameData = (value: unknown) => isRecord(value);

const isPlaythrough = (value: unknown): value is Playthrough =>
  isRecord(value) &&
  typeof value.id === "string" &&
  value.id.trim() !== "" &&
  typeof value.name === "string" &&
  hasGameData(value.data);

const timestamp = (iso: unknown) => (typeof iso === "string" ? Date.parse(iso) || 0 : 0);

const mostRecentlyModified = (playthroughs: Playthrough[]): Playthrough | null =>
  playthroughs.reduce<Playthrough | null>(
    (latest, playthrough) =>
      latest === null || timestamp(playthrough.lastModified) > timestamp(latest.lastModified)
        ? playthrough
        : latest,
    null,
  );

const rejected = (error: BackupError): ParseResult => ({ ok: false, error });

/**
 * Checks the content of a backup file and saves nothing. A playthrough without an id, a name or a data object is skipped, and a repeated id keeps its first entry. Unknown fields stay,
 * so a file from a later version loads unchanged. A missing active id falls back to the most
 * recently updated playthrough.
 */
export const parseBackupData = (raw: unknown): ParseResult => {
  if (!isRecord(raw) || !Array.isArray(raw.playthroughs)) return rejected("playthroughsMissing");

  const seen = new Set<string>();
  const playthroughs = raw.playthroughs.filter(isPlaythrough).filter((playthrough) => {
    if (seen.has(playthrough.id)) return false;
    seen.add(playthrough.id);
    return true;
  });

  const requestedActive = typeof raw.activePlaythroughId === "string" ? raw.activePlaythroughId : null;
  const activePlaythroughId = seen.has(requestedActive ?? "")
    ? requestedActive
    : (mostRecentlyModified(playthroughs)?.id ?? null);

  return {
    ok: true,
    data: { ...raw, playthroughs: playthroughs, activePlaythroughId } as AppData,
    stats: { read: raw.playthroughs.length, skipped: raw.playthroughs.length - playthroughs.length },
  };
};

export const parseBackup = (text: string): ParseResult => {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return rejected("notJson");
  }
  return parseBackupData(raw);
};

export type ImportMode = "merge" | "replace";

export type ImportRowResult = "added" | "updated" | "kept" | "replaced" | "removed";

export interface ImportRow {
  name: string;
  fileModified?: string;
  deviceModified?: string;
  result: ImportRowResult;
}

export const planImport = (current: AppData, incoming: AppData, mode: ImportMode): ImportRow[] => {
  const onDevice = new Map(current.playthroughs.map((playthrough) => [playthrough.id, playthrough]));

  const rows: ImportRow[] = incoming.playthroughs.map((playthrough) => {
    const existing = onDevice.get(playthrough.id);
    const base = { name: playthrough.name, fileModified: playthrough.lastModified };
    if (mode === "replace") {
      return { ...base, deviceModified: existing?.lastModified, result: "replaced" };
    }
    if (!existing) return { ...base, result: "added" };
    return {
      ...base,
      deviceModified: existing.lastModified,
      result: timestamp(playthrough.lastModified) > timestamp(existing.lastModified) ? "updated" : "kept",
    };
  });

  const incomingIds = new Set(incoming.playthroughs.map((playthrough) => playthrough.id));
  current.playthroughs
    .filter((playthrough) => !incomingIds.has(playthrough.id))
    .forEach((playthrough) =>
      rows.push({
        name: playthrough.name,
        deviceModified: playthrough.lastModified,
        result: mode === "replace" ? "removed" : "kept",
      }),
    );
  return rows;
};

/**
 * Replace uses the file as it is. Merge adds playthroughs with new ids and keeps the later
 * `lastModified` for a matching id. Settings and the active playthrough on this device stay.
 */
export const applyImport = (current: AppData, incoming: AppData, mode: ImportMode): AppData => {
  if (mode === "replace") return incoming;

  const incomingById = new Map(incoming.playthroughs.map((playthrough) => [playthrough.id, playthrough]));
  const merged = current.playthroughs.map((playthrough) => {
    const fromFile = incomingById.get(playthrough.id);
    return fromFile && timestamp(fromFile.lastModified) > timestamp(playthrough.lastModified)
      ? fromFile
      : playthrough;
  });
  const knownIds = new Set(current.playthroughs.map((playthrough) => playthrough.id));
  const playthroughs = [...merged, ...incoming.playthroughs.filter((playthrough) => !knownIds.has(playthrough.id))];

  const activeStillExists = playthroughs.some((playthrough) => playthrough.id === current.activePlaythroughId);

  return {
    ...incoming,
    ...current,
    playthroughs,
    activePlaythroughId: activeStillExists
      ? current.activePlaythroughId
      : (mostRecentlyModified(playthroughs)?.id ?? null),
  };
};

export interface ImportResultCount {
  result: ImportRowResult;
  count: number;
}

export const summarizeImport = (rows: ImportRow[]): ImportResultCount[] =>
  (["added", "updated", "kept", "replaced", "removed"] as ImportRowResult[])
    .map((result) => ({ result, count: rows.filter((row) => row.result === result).length }))
    .filter(({ count }) => count > 0);

const pad = (value: number) => String(value).padStart(2, "0");

export const backupFileName = (date = new Date()) =>
  `${BACKUP_FILE_PREFIX}-${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}.json`;

export const backupText = (data: AppData) => JSON.stringify(data, null, 2);

export const downloadBackup = (data: AppData): string => {
  const fileName = backupFileName();
  const blob = new Blob([backupText(data)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  return fileName;
};
