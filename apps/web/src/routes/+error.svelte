<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { ArrowLeft, RefreshCw } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import Seo from '$lib/seo/Seo.svelte';

	const status = $derived(page.status ?? 500);
	const message = $derived(
		typeof page.error?.message === 'string' && page.error.message
			? page.error.message
			: 'Something went wrong'
	);
	const notFound = $derived(status === 404);
	const title = $derived(notFound ? 'Page not found — Abbabal' : `Error ${status} — Abbabal`);
	const description = $derived(
		notFound
			? "This page doesn't exist in the Abbabal archive. Browse the collection of Amharic proverbs instead."
			: 'The page could not be loaded. Browse the Abbabal collection of Amharic proverbs instead.'
	);
</script>

<Seo {title} {description} noindex={status !== 404} />

<div
	class="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 text-center"
>
	<div class="rounded-2xl border border-border bg-card/80 p-12 shadow-sm">
		<div class="mb-6 text-6xl">
			<span class="font-serif text-7xl text-muted-foreground/30">{status}</span>
		</div>

		<h1 class="font-serif text-3xl font-bold">
			{notFound ? 'Page not found' : 'Something went wrong'}
		</h1>

		<p class="mx-auto mt-3 max-w-sm text-sm leading-6 text-muted-foreground">{message}</p>

		<div class="mt-8 flex flex-wrap justify-center gap-3">
			<a href={resolve('/proverbs')}>
				<Button variant="outline" class="gap-2">
					<ArrowLeft size={16} />
					Browse proverbs
				</Button>
			</a>
			<Button onclick={() => window.location.reload()} class="gap-2">
				<RefreshCw size={16} />
				Try again
			</Button>
		</div>
	</div>
</div>
