import { messages } from "@/i18n/text";

export const commonText = messages<{
  gate: {
    title: string;
    description: string;
    newPlaythrough: string;
    choosePlaythrough: string;
  };
  progressLabel: (name: string) => string;
}>("common", {
  fns: {
    progressLabel: ["name"],
  },
  arrays: [],
});
