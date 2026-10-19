// @ts-check
import { defineConfig } from 'wuchale';
import { adapter as svelte } from '@wuchale/svelte';
import { adapter as js } from 'wuchale/adapter-vanilla';

export default defineConfig({
  locales: ['en', 'am'],
  adapters: {
    main: svelte({
      loader: 'sveltekit',
      url: {
        // Patterns are matched in this order (no specificity sorting), so the
        // broadest one is last. Paths that don't match stay locale-free.
        patterns: [
          '/',
          '/proverbs/**',
          '/about',
          '/download',
          '/documentation',
          '/playground',
          '/saved',
        ],
        // Not `true`: the built-in `localizeDefault` prefixes *every* locale
        // (`/en/about`). We keep the source locale unprefixed and only prefix
        // the others, so English URLs — the ones already shared and indexed —
        // don't move. `deLocalizeDefault` (used by `reroute`) is the inverse.
        localize: 'src/lib/url.js',
      },
    }),
    js: js({
      loader: 'vite',
      files: [
        'src/**/+{page,layout}.{js,ts}',
        'src/**/+{page,layout}.server.{js,ts}',
      ],
    }),
  },
});
