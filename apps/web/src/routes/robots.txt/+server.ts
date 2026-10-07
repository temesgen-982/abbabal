import type { RequestHandler } from './$types';
import { getSiteUrl } from '$lib/seo/site.js';

export const GET: RequestHandler = () => {
	const siteUrl = getSiteUrl();

	const body = [
		'# allow crawling everything by default',
		'User-agent: *',
		'Disallow: /*?search=',
		'Disallow: /*?q=',
		'Disallow: /*?locale=',
		'',
		`Sitemap: ${siteUrl}/sitemap.xml`,
		''
	].join('\n');

	return new Response(body, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 'public, max-age=0, s-maxage=3600'
		}
	});
};
