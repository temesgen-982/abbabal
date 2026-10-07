import { env } from '$env/dynamic/public';
import type { RequestHandler } from './$types';
import { getSiteUrl } from '$lib/seo/site.js';

const PAGE_SIZE = 20;
const CACHE_TTL_MS = 60 * 60 * 1000;

const STATIC_PATHS = [
	{ path: '/', priority: '1.0' },
	{ path: '/proverbs', priority: '0.9' },
	{ path: '/about', priority: '0.6' },
	{ path: '/documentation', priority: '0.6' },
	{ path: '/download', priority: '0.6' },
	{ path: '/playground', priority: '0.5' }
];

let cache: { at: number; xml: string } | null = null;

function escapeXml(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

function urlEntry(loc: string, opts: { lastmod?: string; priority?: string } = {}): string {
	const parts = [`<loc>${escapeXml(loc)}</loc>`];
	if (opts.lastmod) parts.push(`<lastmod>${escapeXml(opts.lastmod)}</lastmod>`);
	if (opts.priority) parts.push(`<priority>${opts.priority}</priority>`);
	return `<url>${parts.join('')}</url>`;
}

async function buildSitemap(fetch: typeof globalThis.fetch): Promise<string> {
	const siteUrl = getSiteUrl();
	const base = (env.PUBLIC_API_BASE_URL || 'http://localhost:3000').replace(/\/+$/, '');

	let total = 0;
	let ids: Array<{ id: number; updatedAt: string | null }> = [];

	try {
		const [statsRes, idsRes] = await Promise.all([
			fetch(`${base}/stats`),
			fetch(`${base}/proverbs/ids`)
		]);
		if (statsRes.ok) {
			const stats = await statsRes.json();
			total = Number(stats?.proverbs) || 0;
		}
		if (idsRes.ok) {
			const data = await idsRes.json();
			ids = Array.isArray(data?.ids) ? data.ids : [];
		}
	} catch {
		// API unreachable — fall back to whatever we could fetch
	}

	const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
	const urls: string[] = [];

	for (const entry of STATIC_PATHS) {
		urls.push(urlEntry(`${siteUrl}${entry.path}`, { priority: entry.priority }));
	}

	for (let page = 2; page <= totalPages; page++) {
		urls.push(urlEntry(`${siteUrl}/proverbs?page=${page}`, { priority: '0.6' }));
	}

	for (const { id, updatedAt } of ids) {
		const lastmod = updatedAt ? new Date(updatedAt) : null;
		urls.push(
			urlEntry(`${siteUrl}/proverbs/${id}`, {
				lastmod:
					lastmod && !Number.isNaN(lastmod.getTime())
						? lastmod.toISOString().slice(0, 10)
						: undefined,
				priority: '0.8'
			})
		);
	}

	return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;
}

export const GET: RequestHandler = async ({ fetch }) => {
	if (!cache || Date.now() - cache.at > CACHE_TTL_MS) {
		const xml = await buildSitemap(fetch);
		cache = { at: Date.now(), xml };
	}

	return new Response(cache.xml, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'Cache-Control': 'public, max-age=0, s-maxage=3600'
		}
	});
};
