# Changelog

All notable changes to Abbabal are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

The version is shared by every workspace package: it lives in the root
`package.json` and is mirrored by the apps, as well as the Android
`versionName` / `versionCode`. See the README for the release process.

## [0.2.0] - 2026-10-25

### Added

- **Web — save proverbs.** The bookmark button on the proverb list now actually
  works, the detail page has a Save button, and there's a new `/saved` page
  (linked from the header) listing everything you've bookmarked. Like the
  Android app, the list lives in the browser's `localStorage`, so there's no
  account and nothing leaves the device.

### Changed

- **Web — app download experience.** The landing page's app card now shows a
  phone mockup of the app and links straight to the latest signed APK
  (`…/releases/latest/download/abbabal.apk`). The download page's app tab is
  deep-linkable (`/download?tab=mobile`).
- **Web — shorter search placeholder.** The search fields now read
  "Search Amharic or English…" (matching the Android app) instead of the longer
  "Search proverbs in Amharic or English…", so the text no longer truncates on
  small screens.

### Fixed

- **Web — the app download link landed on the wrong tab.** The landing page's
  "Get the app" button opened the download page on its Database tab, hiding the
  Android app. It now opens the app tab directly, and the card itself downloads
  the APK.
- **Web — the search fields felt unresponsive.** The homepage button gave no
  feedback while its full-page search navigation was in flight, and the
  `/proverbs` field had no submit button at all (Enter only). Both now show a
  spinner and a pressed/disabled state the moment they're submitted, plus a
  keyboard focus ring.
- **Mobile — feed refresh.** The homepage now refreshes after background or
  manual database syncs, responds when the app returns to the foreground, and
  supports pull-to-refresh from the top of the feed.

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
  public API playground, and proverb browsing and detail views. Localized
  (Amharic / English) routes.
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
- **Mobile could not reach the JSON API.** The API's CORS allowlist replaced its
  built-in defaults with `CORS_ORIGIN`, which omitted the Capacitor app-shell
  origins (`https://localhost`, `capacitor://localhost`). The API now always
  allows those origins alongside any configured ones.

[0.1.0]: https://github.com/temesgen-982/abbabal/releases/tag/v0.1.0
