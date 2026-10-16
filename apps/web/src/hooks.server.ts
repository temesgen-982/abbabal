import type { Handle } from '@sveltejs/kit';
import * as main from './locales/main.loader.server.svelte.js';
import * as js from './locales/js.loader.server.js';
import { runWithLocale, loadLocales } from 'wuchale/load-utils/server';
import { locales } from './locales/data.js';
import { isLocale, localeFromPathname, localize } from '$lib/i18n';

await loadLocales(main.key, main.loadCount, main.loadCatalog, locales);
await loadLocales(js.key, js.loadCount, js.loadCatalog, locales);

export const handle: Handle = async ({ event, resolve }) => {
	// READ-ONLY on purpose: this hook sees every request that could carry
	// `?locale=`, including SvelteKit's hover-prefetch and the browser's own
	// NoStatePrefetch, which are navigation-shaped and can't be told apart from
	// real visits. Writing anything here (a cookie, a redirect) used to change
	// the site language on hover. The language now lives in the path itself, so
	// there is nothing left to persist.
	const locale = localeFromPathname(event.url.pathname);

	// Backwards compatibility: `?locale=am` links (bookmarks, search results,
	// anything shared before the switch to `/am/...`) become a real redirect.
	const requested = event.url.searchParams.get('locale');
	if (isLocale(requested) && requested !== locale) {
		const target = new URL(event.url);
		target.searchParams.delete('locale');
		return new Response(null, {
			status: 307,
			headers: { location: localize(target.pathname, requested) + target.search }
		});
	}

	return await runWithLocale(locale, async () => {
		return await resolve(event, {
			transformPageChunk: ({ html }) => html.replace('%sveltekit.lang%', locale)
		});
	});
};
