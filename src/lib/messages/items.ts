import { messages } from "@/i18n/text";

export const itemsText = messages<{
  title: string;
  subline: (done: number, total: number) => string;
  levelLabel: (name: string) => string;
  levelOf: (level: number, max: number) => string;
  hideDone: string;
  topLevel: string;
  empty: {
    title: string;
    description: string;
  };
}>("items", {
  fns: {
    subline: ["done:number", "total:number"],
    levelLabel: ["name"],
    levelOf: ["level:number", "max:number"],
  },
  arrays: [],
});
