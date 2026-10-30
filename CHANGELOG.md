# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-10-30

A new baseline that matches the rebuilt Gamerdex trackers. Trackers made from 1.x do not upgrade in place.

### Added

- A new sidebar shell with a playthrough switcher, a page header with a Saved chip, a mobile drawer, a landing page, a 404 page and an error page
- A UI kit in plain Tailwind CSS with light and dark themes
- Optional cloud sync with GitHub, Google Drive, Dropbox and OneDrive, with a Cloud sync tab in Settings
- 19 languages with ICU message catalogs, right-to-left layout for Arabic, and region settings for the language, date format and number format
- Backup import with a Merge or Replace review, Undo for delete and reset
- Overview and Items sample pages with an items service, to show how a page reads and writes progress
- Vitest tests for storage, backup, sync, items, i18n and the UI kit
- Scripts that check the catalogs of every language and find text that is not in a catalog
- A CI workflow for lint, tests and build, and issue templates

### Changed

- Styling uses Tailwind CSS only
- Playthroughs save at once. The Save button is gone
- Moved to the GamerdexApp organization

### Removed

- Flowbite React and react-toastify
- SaveFAB
