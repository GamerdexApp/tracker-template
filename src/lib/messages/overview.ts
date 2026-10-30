import { messages } from "@/i18n/text";

export const overviewText = messages<{
  title: string;
  subline: (name: string) => string;
  progress: {
    title: string;
    label: (done: number, total: number) => string;
  };
  tiles: {
    done: string;
    levels: string;
    playthroughs: string;
  };
  of: (total: number) => string;
  open: string;
}>("overview", {
  fns: {
    subline: ["name"],
    "progress.label": ["done:number", "total:number"],
    of: ["total:number"],
  },
  arrays: [],
});
