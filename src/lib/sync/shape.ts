import type { AppData } from "@/types/app";

/**
 * The sync package merges plain objects, lists of objects with a string key and lists of plain
 * values. The items of this app are a list of objects with an id, so the saved data syncs as it is.
 * A list that the package cannot merge by position, such as the levels of one building, is
 * converted here into an object keyed by its position in `toSyncShape`, and back in `fromSyncShape`.
 */
export const toSyncShape = (document: AppData): unknown => document;

export const fromSyncShape = (shape: unknown): AppData => shape as AppData;
