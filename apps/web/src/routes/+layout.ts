import type { LayoutLoad } from './$types';
import { browser, dev } from '$app/environment';
import { injectAnalytics } from '@vercel/analytics/sveltekit';
import { loadLocale } from 'wuchale/load-utils';
import { localeFromPathname } from '$lib/i18n';

import '../locales/main.loader.svelte.js';
import '../locales/js.loader.js';

// Vercel Web Analytics. `injectAnalytics` is a no-op during SSR and installs the
// tracking script plus SvelteKit route support in the browser.
injectAnalytics({ mode: dev ? 'development' : 'production' });

export const load: LayoutLoad = async ({ url }) => {
	// The path is the locale: `reroute` (src/hooks.ts) strips the prefix before
	// picking a route, but load functions still get the original URL, so SSR,
	// client navigation and a pasted link all resolve to the same language.
	const locale = localeFromPathname(url.pathname);

	if (browser) {
		// NOTE: SvelteKit runs this on hover-prefetch too (`_preload_data` →
		// `load_route` → `load_node`), and `loadLocale()` commits the locale
		// GLOBALLY into the catalog every rendered component reads. That's
		// harmless here — every link on the page points at the *same* locale, so
		// prefetching re-commits what's already active. The one cross-locale
		// link, the language toggle in Nav.svelte, opts out of preload.
		// Keep this function free of other user-visible side effects.
		await loadLocale(locale);
	}
	return { locale };
};
