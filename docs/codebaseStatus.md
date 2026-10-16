# Abbabal — Codebase Status

> Last updated: October 16, 2026
> Branch: `main`

A `pnpm` monorepo sharing a single Amharic-proverb dataset across an API, a web
app, and an offline-capable Android app.

```
apps/api       NestJS API over SQLite (Drizzle), serves the dataset + JSON API
apps/web       SvelteKit marketing / docs / browsing site
apps/mobile    SvelteKit app wrapped with Capacitor for Android (offline-first)
packages/shared  Shared API contracts and brand assets
scripts/       Data pipeline (fetch → dedupe → AI-process) and version tooling
data/          proverbs.db — the single source of truth for proverbs
```

## Data flow

1. `scripts/fetch-proverbs.ts` pulls new proverbs from the source Telegram
   channel into `data/proverbs.db` (scheduled, commits back to the repo).
2. `scripts/process-proverbs.ts` fills in translations/meanings with an AI model
   and publishes them into the same DB (scheduled).
3. The API serves the DB directly (`GET /proverbs.db`, `GET /download`) and as a
   JSON API. The web app calls the JSON API; the mobile app bundles the DB and
   refreshes it incrementally from the JSON API.

## API (`apps/api`)

| Feature | Status | Notes |
|---------|--------|-------|
| Health endpoint | ✅ | `GET /` |
| Stats | ✅ | `GET /stats` — proverb/interpretation counts, DB size/updated-at |
| Full DB download | ✅ | `GET /download` and `GET /proverbs.db` |
| List proverbs | ✅ | `GET /proverbs?page&limit` |
| Search | ✅ | `GET /proverbs/search?q&limit` (text + translations) |
| Proverb IDs | ✅ | `GET /proverbs/ids` (id + `updatedAt`, used to diff for incremental sync) |
| Proverb batch | ✅ | `GET /proverbs/batch?ids=1,2,3` (with interpretations, max 200) |
| Random proverb | ✅ | `GET /proverbs/random` |
| Proverb detail | ✅ | `GET /proverbs/:id` |
| Swagger docs | ✅ | `/docs` |
| Auth / users / API keys | ❌ | Not on `main` (see the archived `features-dump` branch) |
| Automated tests | ❌ | Jest is configured, but no `*.spec.ts` / e2e specs are present on `main` |

Data access is raw SQLite via a thin Drizzle wrapper. `apps/api/src/db/schema.ts`
holds row types for the two tables: `proverbs` and `interpretations`.

## Web (`apps/web`)

| Feature | Status | Notes |
|---------|--------|-------|
| Landing page | ✅ | Hero, stats, features, API showcase, FAQ |
| About page | ✅ | Mission + Telegram build-log timeline |
| Documentation | ✅ | API reference and examples |
| Download page | ✅ | Database + Android app cards (links to latest APK) |
| Playground | ✅ | Public API request builder |
| Proverbs listing | ✅ | `/proverbs` |
| Proverb detail | ✅ | `/proverbs/[id]` — translations, meanings, share/copy, SEO |
| i18n (Amharic / English) | ✅ | Locale in the URL path (`/am/…`), wuchale |
| Dark mode | ✅ | Theme persisted, no flash on load |
| Error page | ✅ | `+error.svelte` |
| SEO | ✅ | `robots.txt`, `sitemap.xml`, per-page meta |
| Auth / dashboard | ❌ | Not on `main` (archived branch has a richer, unmerged version) |

Deployed on Vercel via `@sveltejs/adapter-auto`.

## Mobile (`apps/mobile`, Android)

| Feature | Status | Notes |
|---------|--------|-------|
| Home feed | ✅ | Infinite-scroll proverb cards |
| Search | ✅ | Debounced, searches proverb text + translations |
| Random proverb | ✅ | Fetch and display |
| Proverb detail | ✅ | Full detail view with share |
| Saved proverbs | ✅ | Persisted to `localStorage` |
| Profile page | ✅ | App version, manual sync, data source info |
| Offline support | ✅ | Bundled SQLite + incremental sync from the JSON API (24h cadence) |
| Native share sheet | ✅ | `@capacitor/share` |
| Home-screen widget | ✅ | `ProverbWidget` reads the SQLite DB, shows a random proverb |
| Icons / splash | ✅ | Generated from `packages/shared/assets` |
| Single version + release builds | ✅ | Version from root `package.json`; signed APK via GitHub Actions |
| Authentication | ❌ | No login yet |
| Push notifications | ❌ | Not started |

`applicationId` / namespace is `et.com.abbabal`.

## Shared (`packages/shared`)

| Feature | Status | Notes |
|---------|--------|-------|
| Type contracts | ✅ | `contracts.*`, `index.*` declaration files |
| Runtime code | ❌ | `.js` files are stubs — consumers rely on the types only |
| Brand assets | ✅ | Source logos used to generate mobile icons/splash |

## Infrastructure & tooling

| Area | Status | Notes |
|------|--------|-------|
| Data workflows | ✅ | `fetch-proverbs`, `process-proverbs` (scheduled) |
| Android release | ✅ | `release-android` builds a signed APK and publishes a GitHub Release on `v*` tags |
| Versioning | ✅ | `pnpm version:set x.y.z` updates root + all packages |
| Changelog | ✅ | `CHANGELOG.md` |
| Docker / staging / monitoring | ❌ | Not set up |

## Deployment

| App | Adapter / runtime | Platform |
|-----|-------------------|----------|
| API | NestJS | Render.com — https://abbabal-api.onrender.com |
| Web | `@sveltejs/adapter-auto` | Vercel |
| Mobile | `@sveltejs/adapter-static` | GitHub Releases (APK) now; Google Play planned |

## Known issues & technical debt

1. **No automated tests on `main`.** Jest/e2e config exists but no specs.
2. **Auth/dashboard lives only on an archived branch.** The richer web
   dashboard + auth surface is on `archive/features-dump`, not merged.
3. **Mobile has no auth or push notifications.**
4. **`applicationId` is now `et.com.abbabal`.** It was `abbabal.com.et`; any
   device that installed a pre-change build will treat this as a new app.
5. **No staging environment, containerization, or error monitoring.**
6. **Mobile API base URL is effectively hardcoded.**
   `apps/mobile/src/lib/api.ts` reads `process.env.PUBLIC_API_BASE_URL`, but no
   env file or type declaration exists, so it always falls back to
   `https://abbabal-api.onrender.com`. Wire it through SvelteKit's `$env` if it
   needs to be configurable per environment.

## Route maps

### Web

```
/                 Landing
/about            About
/documentation    API docs
/download         Dataset + Android app
/playground       Public API playground
/proverbs         Proverb listing
/proverbs/[id]    Proverb detail
/robots.txt        SEO
/sitemap.xml       SEO
```

### Mobile

```
/                 Proverb feed (infinite scroll)
/search           Search
/random           Random proverb
/saved            Saved proverbs
/profile          Profile & sync
/proverb-detail   Proverb detail (?id=)
```
