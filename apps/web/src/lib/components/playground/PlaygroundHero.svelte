<script lang="ts">
	import { Sparkles, Wand2 } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';

	let {
		header,
		title,
		subtitle,
		runLabel = 'Run a sample request',
		docsLabel = 'View docs',
		snapshotTitle = 'Production rhythm',
		snapshotLabel = 'Live snapshot',
		snapshotStatus = 'Stable',
		snapshotRows = [],
		latencyLabel,
		isLoading = false,
		onRun
	} = $props();
</script>

<header class="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
	<div class="space-y-6">
		{#if header}
			<p class="text-xs tracking-[0.4em] text-muted-foreground uppercase">
				{header}
			</p>
		{/if}
		<h1 class="font-display text-5xl leading-tight md:text-6xl">{title}</h1>
		<p class="max-w-xl text-lg text-muted-foreground">{subtitle}</p>
		<div class="flex flex-wrap gap-3">
			<Button size="lg" onclick={onRun} disabled={isLoading}>
				<Sparkles />
				{runLabel}
			</Button>
			<Button variant="outline" size="lg">{docsLabel}</Button>
		</div>
	</div>

	<div
		class="grid gap-6 rounded-3xl border border-border bg-card/80 p-6 text-card-foreground shadow-sm backdrop-blur"
	>
		<div class="flex items-center justify-between">
			<div>
				<p class="text-xs tracking-[0.3em] text-muted-foreground uppercase">
					{snapshotLabel}
				</p>
				<p class="text-2xl font-semibold">{snapshotTitle}</p>
			</div>
			<div class="flex items-center gap-2 text-primary">
				<Wand2 class="size-5" />
				<span class="text-sm font-medium">{snapshotStatus}</span>
			</div>
		</div>
		<div class="grid gap-4 text-sm">
			{#each snapshotRows as row (row.label)}
				<div class="flex items-center justify-between">
					<span class="text-muted-foreground">{row.label}</span>
					<span class="font-medium">{row.value}</span>
				</div>
			{/each}
			{#if latencyLabel}
				<div class="flex items-center justify-between">
					<span class="text-muted-foreground">Latency</span>
					<span class="font-medium">{latencyLabel}</span>
				</div>
			{/if}
		</div>
	</div>
</header>
