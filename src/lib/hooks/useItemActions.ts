"use client";

import { usePlaythrough } from "@/lib/contexts/PlaythroughContext";
import { updatePlaythrough } from "@/service/appData";
import { setItemLevel } from "@/service/items";

/** Writes one change on the latest saved data, never a copy of the playthrough from render time. */
export const useItemActions = () => {
  const { updateData } = usePlaythrough();

  const setLevel = (playthroughId: string, itemId: string, level: number) =>
    updateData((current) => {
      const target = current.playthroughs.find((playthrough) => playthrough.id === playthroughId);
      return target ? updatePlaythrough(current, playthroughId, { data: setItemLevel(target, itemId, level).data }) : current;
    });

  return { setLevel };
};
