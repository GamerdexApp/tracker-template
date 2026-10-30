import { messages } from "@/i18n/text";

export const playthroughsText = messages<{
  title: string;
  subline: (count: number) => string;
  sublineActive: (count: number, name: string) => string;
  newPlaythrough: string;
  empty: {
    title: string;
    deletedTitle: string;
    description: string;
    restore: string;
  };
  filters: {
    search: string;
    sortLabel: string;
    sort: {
      lastModified: string;
      createdAt: string;
      name: string;
    };
    showing: (shown: number, total: number) => string;
    clear: string;
  };
  noMatch: {
    title: (query: string) => string;
    description: string;
  };
  card: {
    active: string;
    openOverview: string;
    setActive: string;
    edit: string;
    delete: string;
    created: (date: string) => string;
    lastModified: (date: string) => string;
    progress: (done: number, total: number) => string;
    switched: (name: string) => string;
  };
  fields: {
    name: string;
    namePlaceholder: string;
    nameRequired: string;
    description: string;
    descriptionPlaceholder: string;
    cancel: string;
  };
  create: {
    title: string;
    submit: string;
    makeActive: string;
    done: (name: string) => string;
  };
  edit: {
    title: string;
    submit: string;
    done: (name: string) => string;
  };
  delete: {
    title: string;
    description: string;
    question: (name: string) => string;
    activeNext: (next: string) => string;
    activeLast: string;
    exportFirst: string;
    cancel: string;
    confirm: string;
    done: (name: string) => string;
    doneMessage: string;
    undo: string;
  };
}>("playthroughs", {
  fns: {
    subline: ["count:plural"],
    sublineActive: ["count:plural", "name"],
    "filters.showing": ["shown", "total"],
    "noMatch.title": ["query"],
    "card.progress": ["done:number", "total:number"],
    "card.created": ["date"],
    "card.lastModified": ["date"],
    "card.switched": ["name"],
    "create.done": ["name"],
    "edit.done": ["name"],
    "delete.question": ["name"],
    "delete.activeNext": ["next"],
    "delete.done": ["name"],
  },
  arrays: [],
});
