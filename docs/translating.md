# Translating

Each language is a folder `src/i18n/messages/<code>/` with one JSON file for each English file in `src/i18n/messages/en/`. The folder name is the language code. English is the source. A missing key reads as English, but every message must have a translation.

## Catalog files

- Same file names, same nesting and same keys as the English file. Translate only the values. Keep the key order.
- Lists are stored as `item1`, `item2` and so on. Keep every item.
- UTF-8 JSON, 2 spaces, no trailing commas.
- Run `node scripts/check-catalogs.mjs <code>` until it reports 0 missing and 0 problems.

## Message syntax (ICU)

- Variables are written `{name}`. Copy them exactly. Never translate, rename, add or remove a variable.
- Plurals look like `{count, plural, one {{amount} item} other {{amount} items}}`. `count` chooses the form and `{amount}` is the already formatted number. Keep both variables and always write `{amount}`, never `#`. Give the language the plural forms it needs (CLDR categories). The `other` form is always present.
  - Arabic: zero, one, two, few, many, other.
  - Russian: one, few, many, other.
  - Spanish, French, Italian, Portuguese, German, Turkish: one, other.
  - Chinese, Japanese, Korean, Vietnamese, Thai, Indonesian, Malay: other only.
  - A message that has one plural in English has exactly one plural in the translation.
- `select` messages keep the same selector and the same branches. Translate only the text inside the branches.
- Follow the English message for apostrophes next to a variable.
- Never format a number yourself. The app formats it.
- Duration units (`duration.json`) are short: `{count}d` is days, `h` hours, `m` minutes, `s` seconds. Keep each one short.

## What to translate and what to keep

- Translate every word of the interface: labels, buttons, titles, descriptions, hints, empty states, toast text, error text and accessibility labels.
- Keep as they are: the game name, "Gamerdex", "GitHub", "Google Drive", "Dropbox", "OneDrive", file names and URLs.
- Names that come from the game data stay in the language of the data package. The app inserts them as variables or shows them in lists.

## Voice

- Plain, direct and friendly. Short sentences. A tool for players, not marketing.
- No em dashes. Use a comma, a colon, a period or parentheses as the language does.
- Keep buttons and labels about as short as the English.
- Address the player the way a game tool in that language normally does, and use the spelling and vocabulary of the region (pt-BR against pt-PT, es against es-419, zh-CN against zh-TW).

## Adding a language

1. Add the code to `SUPPORTED_LOCALES` in `src/i18n/locales.ts` and give it a region tag in `REGION_TAG` in the same file.
2. Add the folder `src/i18n/messages/<code>/` with a file for each English file.
3. Run `node scripts/gen-locale-indexes.mjs`.
4. Run `node scripts/check-catalogs.mjs <code>`.
