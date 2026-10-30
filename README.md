# Tracker Template

A Next.js template for Gamerdex game progress trackers. It gives a new tracker the whole shared base: playthroughs, saved progress in the browser, optional cloud sync, 19 languages, a themed shell and a test suite. Replace the sample game data with the real game and ship.

## What is in the base

- **Playthroughs.** Create, edit, delete and switch, with Undo. Every change saves at once.
- **Browser storage.** One key, no account. A save written by an older version still loads, because new fields are optional.
- **Backup.** Export, import with a Merge or Replace review, and reset with Undo.
- **Cloud sync.** Optional sync with GitHub, Google Drive, Dropbox and OneDrive through [`@gamerdexapp/gamerdex-sync`](https://github.com/GamerdexApp/gamerdex-sync), with merge rules, conflicts and a callback page.
- **19 languages.** English plus Arabic (right to left), Chinese (Simplified and Traditional), French, German, Indonesian, Italian, Japanese, Korean, Malay, Portuguese (Brazil and Portugal), Russian, Spanish (Spain and Latin America), Thai, Turkish and Vietnamese. Messages are ICU catalogs, and dates, numbers, lists and durations follow the chosen language.
- **UI kit in plain Tailwind CSS 4.** Light and dark themes from tokens in `src/app/globals.css`, a sidebar shell with a mobile drawer, dialogs, flyouts, tabs, steppers, toasts with Undo, empty states and skeletons.
- **Two sample pages.** Overview and Items show the pattern for a page that reads and writes progress.
- **Checks.** Unit tests, a catalog check for every language, a check for text that is not in a catalog, ESLint, and a CI workflow.

## Tech stack

Next.js 16 (App Router), React 19, TypeScript 6 (strict), Tailwind CSS 4, next-intl for ICU messages, Vitest, pnpm, Node 24 or later.

## Start a new tracker

Use this repository as a GitHub template, then follow [TRACKER_TEMPLATE.md](TRACKER_TEMPLATE.md). It lists every file to change, in order.

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

```bash
pnpm dev             # Dev server
pnpm build           # Production build
pnpm lint            # ESLint
pnpm test            # Unit tests
pnpm format          # Prettier

pnpm check:i18n      # Find text that is not in a message catalog
pnpm check:catalogs  # Compare every language with English
pnpm gen:locales     # Rewrite the language index files after a catalog folder changes
```

## Project layout

```
src/app           Routes: landing page, (app) pages, settings, sync callback
src/components    ui (kit), shell, settings, sync, playthroughs, items, overview
src/data          Site settings, navigation and the sample game data
src/i18n          Language runtime and the message catalogs
src/lib           Contexts, hooks, services, sync and typed message modules
src/types         Saved data and component types
tests             Storage, sync, items, i18n and UI kit tests
scripts           Catalog and text checks
docs              Guide to translating
```

## Translating

Messages live in `src/i18n/messages/<code>/`, one JSON file for each area. English is the source. See [docs/translating.md](docs/translating.md).

## License

MIT
