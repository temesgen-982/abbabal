import { deLocalizeDefault, localizeDefault } from 'wuchale/url';
import { locales } from '../locales/data.js';

export const sourceLocale = locales[0];

/**
 * URL *localization* — `wuchale.config.js` points `url.localize` at this file,
 * so every URL the extractor recognised in the source is rewritten to
 * `localize(path, locale)` and re-evaluated on each render.
 *
 * Two rules, both required for routing to round-trip:
 *
 * 1. Only non-source locales get a prefix: `/about` (en) and `/am/about` (am),
 *    never `/en/about`. The default `localizeDefault` prefixes everything.
 * 2. It is idempotent — `deLocalizeDefault` strips the prefix before adding
 *    one, so a path that is already localized can't become `/am/am/about`.
 *
 * `deLocalizeDefault` is the inverse used by `reroute` in `src/hooks.ts`.
 */
export function localize(path: string, locale: string): string {
	const [plain] = deLocalizeDefault(path, locales);
	return locale === sourceLocale ? plain : localizeDefault(plain, locale);
}
