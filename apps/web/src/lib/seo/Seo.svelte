<script lang="ts">
	import { page } from '$app/state';
	import { getSiteUrl } from './site.js';
	import { localize, localeFromPathname, locales, sourceLocale } from '$lib/i18n.js';

	interface Props {
		title: string;
		description: string;
		/** Source-locale site-relative path for the canonical URL. Defaults to the current path. */
		path?: string;
		type?: string;
		/** Site-relative or absolute image URL for og:image. */
		image?: string;
		noindex?: boolean;
		jsonLd?: unknown;
	}

	let {
		title,
		description,
		path,
		type = 'website',
		image = '/logo.png',
		noindex = false,
		jsonLd
	}: Props = $props();

	const siteUrl = $derived(getSiteUrl());
	const locale = $derived(localeFromPathname(page.url.pathname));
	// Unlocalized: either the source path passed in, or the current URL with any
	// `/am` prefix stripped back off by `localize` below.
	const rawPath = $derived(path ?? page.url.pathname);
	const canonicalPath = $derived(localize(rawPath, locale));
	const canonical = $derived(`${siteUrl}${canonicalPath}`);
	const ogImage = $derived(image.startsWith('http') ? image : `${siteUrl}${image}`);
	const ogLocale = $derived(locale === 'am' ? 'am_ET' : 'en_US');
	const jsonLdHtml = $derived(
		jsonLd === undefined
			? ''
			: '<script type="application/ld+json">' +
					JSON.stringify(jsonLd).replace(/</g, '\\u003c') +
					'</scr' +
					'ipt>'
	);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={canonical} />
	<!-- Path-based locales make each page exist twice; tell search engines they
	     are the same content rather than competing duplicates. -->
	{#each locales as l (l)}
		<link rel="alternate" hreflang={l} href={`${siteUrl}${localize(rawPath, l)}`} />
	{/each}
	<link
		rel="alternate"
		hreflang="x-default"
		href={`${siteUrl}${localize(rawPath, sourceLocale)}`}
	/>
	{#if noindex}
		<meta name="robots" content="noindex,follow" />
	{/if}
	<meta property="og:site_name" content="Abbabal" />
	<meta property="og:type" content={type} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={canonical} />
	<meta property="og:image" content={ogImage} />
	<meta property="og:locale" content={ogLocale} />
	{#if locale !== sourceLocale}
		<meta property="og:locale:alternate" content="en_US" />
	{/if}
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={ogImage} />
	{#if jsonLdHtml}
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html jsonLdHtml}
	{/if}
</svelte:head>
