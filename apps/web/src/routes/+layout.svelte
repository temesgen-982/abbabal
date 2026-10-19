<script lang="ts">
	import { onMount } from 'svelte';
	import './layout.css';
	import Nav from '$lib/components/Nav.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { initSaved } from '$lib/stores/saved.svelte';

	let { children, data } = $props();

	// SSR sets <html lang> through `transformPageChunk`; keep it in sync after
	// client-side navigations (SvelteKit doesn't touch it).
	$effect(() => {
		document.documentElement.lang = data.locale;
	});

	// Read the saved list from `localStorage` after hydration (see `initSaved`).
	onMount(initSaved);
</script>

<svelte:head>
	<link rel="icon" type="image/png" href="/logo.png" />
	<link rel="apple-touch-icon" href="/logo.png" />
</svelte:head>

<Nav locale={data.locale} />

{@render children()}

<Footer locale={data.locale} />
