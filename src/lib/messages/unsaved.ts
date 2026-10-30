import { messages } from "@/i18n/text";

export const unsavedText = messages<{
  chip: string;
  leave: {
    title: (count: number) => string;
    body: string;
    save: string;
    discard: string;
    keep: string;
  };
}>("unsaved", {
  fns: {
    "leave.title": ["count:plural"],
  },
  arrays: [],
});
