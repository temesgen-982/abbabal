<script lang="ts">
	import { Sparkles } from '@lucide/svelte';
	import RequestControls from '$lib/components/playground/RequestControls.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';

	let {
		endpointOptions,
		apiKeyOptions,
		selectedEndpoint = $bindable(),
		selectedApiKey = $bindable(),
		limit = $bindable(1),
		apiKey = $bindable(''),
		query = $bindable(''),
		id = $bindable(''),
		page = $bindable(1),
		showQuery = false,
		showId = false,
		showPage = false,
		latencyLabel,
		isLoading = false,
		onSubmit
	} = $props();
</script>

<aside
	class="flex flex-col gap-6 rounded-3xl border border-border bg-card/90 p-6 text-card-foreground shadow-sm backdrop-blur"
>
	<div class="flex items-center justify-between">
		<div>
			<p class="text-xs tracking-[0.3em] text-muted-foreground uppercase">Request builder</p>
			<h2 class="text-2xl font-semibold">Send a request</h2>
		</div>
		<div class="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
			<Sparkles class="size-5" />
		</div>
	</div>

	<form class="flex flex-1 flex-col gap-6" onsubmit={onSubmit}>
		<RequestControls
			{endpointOptions}
			{apiKeyOptions}
			bind:selectedEndpoint
			bind:selectedApiKey
			bind:limit
			apiKeyLabel="Environment"
		/>

		<label class="grid gap-2 text-sm font-medium">
			API key
			<Input type="password" placeholder="x-api-key header" bind:value={apiKey} />
		</label>

		{#if showQuery}
			<label class="grid gap-2 text-sm font-medium">
				Search query
				<Input type="text" placeholder="wisdom" bind:value={query} />
			</label>
		{/if}

		{#if showId}
			<label class="grid gap-2 text-sm font-medium">
				Proverb ID
				<Input type="text" placeholder="1" bind:value={id} />
			</label>
		{/if}

		{#if showPage}
			<label class="grid gap-2 text-sm font-medium">
				Page
				<Input type="number" min="1" bind:value={page} />
			</label>
		{/if}

		<div class="mt-auto grid gap-2">
			<Button size="lg" class="w-full" type="submit" disabled={isLoading}>
				<Sparkles />
				{isLoading ? 'Fetching...' : 'Fetch response'}
			</Button>
			{#if latencyLabel}
				<p class="text-center text-xs text-muted-foreground">
					Estimated latency: <span class="font-semibold text-primary">{latencyLabel}</span>
				</p>
			{/if}
		</div>
	</form>
</aside>
