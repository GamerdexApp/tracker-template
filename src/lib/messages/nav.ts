import { messages } from "@/i18n/text";

export const navText = messages<{
  items: {
    overview: string;
    items: string;
    settings: string;
  };
  playthroughs: string;
}>("nav", {
  fns: {},
  arrays: [],
});
