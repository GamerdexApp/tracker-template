# Tracker Template Guide

This guide turns the template into a tracker for one game. Do the steps in order. Run `pnpm test`, `pnpm lint` and `pnpm check:catalogs` after each part.

## 1. Name the tracker

| File | What to change |
| --- | --- |
| `package.json` | `name`, `description`, `keywords`, `author` |
| `src/data/site.ts` | `APP_ID`, `SITE_URL`, `GITHUB_URL`, `GAME_URL`, `BACKUP_FILE_PREFIX` |
| `src/data/nav.ts` | `APP_NAME` |
| `src/app/layout.tsx` | Title, description, keywords and the Open Graph image |
| `public/site.webmanifest` | Name, short name, colours |
| `public/` | Replace `game-icon.svg`, the favicons and the Android and Apple icons |
| `src/app/globals.css` | The colour tokens at the top, for both themes |

`APP_ID` names the browser storage key, the sync file folder and the device key. Choose it once. Changing it later hides the saved data of existing players.

Search for the text "Game Name" in `src/i18n/messages/en/`. It stands for the game name in the footer, the About card, the landing page and the not found page. Replace it in English, then update the other languages.

## 2. Describe the game data

The sample game has six items with a level. Replace it with the real things the tracker follows.

1. `src/types/app/game.d.ts`: change `GameData` to the shape of the progress you save. Add new fields as optional, so a save written by an older version stays valid.
2. `src/data/items.ts`: the definitions of the game data. Names are game data and stay in English.
3. `src/lib/services/items.ts`: pure functions that read and change progress. Keep them free of React, and give them `now` as an argument when they need the time, so tests can fix it.
4. `src/lib/services/migrate.ts`: add a step for each new optional field, so an old save gets a default.

Write the edit on the latest saved data, never on a copy of the playthrough from render time. `src/lib/hooks/useItemActions.ts` shows the pattern with `updateData`.

## 3. Build the pages

1. Add a route in `src/app/(app)/<page>/page.tsx` and a page component in `src/components/<page>/`. Wrap the page in `PlaythroughGate` so it shows a clear panel when no playthrough is active.
2. Add the page to `navItems` in `src/data/nav.ts` and to the `nav` catalog.
3. Use the UI kit in `src/components/ui` before you write a new control.
4. Put every visible word in a catalog. The next part explains how.

`pnpm check:i18n` lists text that is still hard coded. Mark a word that is not interface text, such as a brand name, with an `i18n-ignore` comment.

## 4. Messages and languages

Messages are ICU strings in `src/i18n/messages/<code>/<namespace>.json`. A typed module in `src/lib/messages/<namespace>.ts` gives pages a call such as `itemsText.levelOf(level, max)`.

To add a message:

1. Add the key to the English file.
2. Add it to the typed module. A message with variables is listed in `fns` with the names of its parameters. `name:number` formats a number, and `name:plural` picks the plural form and also gives `{amount}`.
3. Add the translation to every language folder.
4. Run `pnpm check:catalogs`. It compares every language with English: missing keys, variables, tags and plurals.

To add a namespace, add `en/<namespace>.json` and the same file in each language, then run `pnpm gen:locales`.

Read the module level rule in `src/i18n/text.ts`: a message must be read while rendering, never kept in a module constant, or it will not follow a language change.

Read [docs/translating.md](docs/translating.md) before you translate or review a language.

## 5. Sync

Sync works once the app has a live address.

1. Set `SITE_URL` and register the callback address `https://<your domain>/sync/callback` with the GitHub App and the Google, Dropbox and Microsoft apps of Gamerdex.
2. Add the origin to `ALLOWED_ORIGINS` on the `gamerdex-auth` service.
3. Describe how each field merges in `src/lib/sync/schema.ts`. Levels take the higher value. Lists of things with an id merge by id. A list that merges by position needs a conversion in `src/lib/sync/shape.ts`.
4. Run the sync tests in `tests/storage/sync.test.ts` and add a case for each new field.
5. Sign in once with each provider on the live site.

## 6. Check before release

```bash
pnpm lint
pnpm test
pnpm check:i18n
pnpm check:catalogs
pnpm build
```

Then open the app in a browser, in light and dark, at desktop and phone width, in English and in one right to left language, and read every page.

## 7. Release

Update `CHANGELOG.md`, set the version in `package.json`, and add the privacy and terms links in the footer if the live domain changes. The footer links to the shared pages on `gamerdex.app`.
