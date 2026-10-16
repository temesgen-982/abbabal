# Changelog

All notable changes to Abbabal are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

The version is shared by every workspace package: it lives in the root
`package.json` and is mirrored by the apps, as well as the Android
`versionName` / `versionCode`. See the README for the release process.

## [0.1.0] - 2026-10-16

First public version of the Abbabal monorepo: a NestJS API, a SvelteKit web
app, and a Capacitor Android app built on a shared Amharic proverb dataset.

### Added

- **Dataset**: SQLite database of Amharic proverbs with translations and
  meanings, refreshed from the source Telegram channel by scheduled workflows.
- **API** (`apps/api`): proverb listing, search, random, detail, a
  `GET /proverbs.db` endpoint that serves the whole database, and a
  `GET /proverbs/batch` endpoint that returns many proverbs with their
  interpretations for incremental client sync.
- **Web** (`apps/web`): landing, about, documentation and download pages, a
  public API playground, proverb browsing and detail views, and a dashboard for
  API keys, usage, and admin management. Localized (Amharic / English) routes.
- **Mobile** (`apps/mobile`, Android):
  - Offline-first feed with infinite scroll, search, random proverb, detail,
    and saved proverbs.
  - Bundled SQLite database with a 24-hour incremental sync from the JSON API
    (`/proverbs/ids` + `/proverbs/batch`).
  - Native home-screen widget that shows a random proverb.
  - Native share sheet, launcher icons and splash screens generated from the
    shared brand assets.
- **Shared** (`packages/shared`): common API contracts and assets.
- **Tooling**: `pnpm version:set` to bump the product version everywhere,
  Android release signing support, and a GitHub Actions workflow that builds a
  signed APK and publishes it to a GitHub Release.

### Fixed

- **Mobile startup hang.** The app refreshed its offline database by downloading
  the whole 8.9 MB `proverbs.db` through the SQLite plugin, whose Android
  implementation busy-waits on Capacitor's single plugin thread — blocking the
  first feed query (and every other plugin call) for the duration of the
  download. Sync is now incremental: it diffs `GET /proverbs/ids` against the
  bundled database and fetches only what changed via `GET /proverbs/batch`.

[0.1.0]: https://github.com/temesgen-982/abbabal/releases/tag/v0.1.0
