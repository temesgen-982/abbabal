import type { Reroute } from '@sveltejs/kit';
import { deLocalizeDefault } from 'wuchale/url';
import { locales } from './locales/data.js';
import { matchUrl } from './locales/main.url.js';

/**
 * Turns a localized URL into the route SvelteKit should render:
 * `/am/proverbs/2` → `/proverbs/2` (loaded and SSR'd in Amharic).
 *
 * Runs on the server *and* in the client router, so address-bar navigation,
 * `goto()` and hover-prefetch all resolve the same way. It only rewrites the
 * path — the original `url` is still what load functions see, which is how
 * `+layout.ts` recovers the locale.
 *
 * A path that matches no pattern (a 404, or something outside
 * `url.patterns`) still loses its prefix: that keeps the error page routable
 * while `localeFromPathname` reads the locale off the *original* URL.
 */
export const reroute: Reroute = ({ url }) => {
	const [path, locale] = deLocalizeDefault(url.pathname, locales);
	if (locale === null) return url.pathname;
	return matchUrl(path, locale).path ?? path;
};
