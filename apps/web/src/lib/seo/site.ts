import { env } from '$env/dynamic/public';

const FALLBACK_SITE_URL = 'https://abbabal-api-web.vercel.app';

/** Absolute site origin without a trailing slash. Drives canonicals, OG and sitemaps. */
export function getSiteUrl(): string {
	return (env.PUBLIC_SITE_URL || FALLBACK_SITE_URL).replace(/\/+$/, '');
}
