<script lang="ts">
	import { ArrowUpRight, Send } from '@lucide/svelte';
	import { storyMessages, storyPostUrl, type StoryMessage } from '$lib/data/telegramStory';
	import type { Locale } from '../../locales/data.js';

	let { locale = 'en' }: { locale?: Locale } = $props();

	type Part = { text: string; href?: string };

	/** Turns `[label](url)` and bare urls into renderable parts */
	function parts(line: string): Part[] {
		const found: Part[] = [];
		const pattern = /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)|(https?:\/\/[^\s)]+)/g;
		let last = 0;
		let match: RegExpExecArray | null;

		while ((match = pattern.exec(line)) !== null) {
			if (match.index > last) found.push({ text: line.slice(last, match.index) });
			if (match[1]) {
				found.push({ text: match[1], href: match[2] });
			} else {
				found.push({ text: match[3], href: match[3] });
			}
			last = pattern.lastIndex;
		}
		if (last < line.length) found.push({ text: line.slice(last) });

		return found;
	}

	/**
	 * "11 Mar 2026" / "11 ማርች 2026" — the month name comes from the platform so
	 * new locales need no catalog entries. Built from `Date.UTC` so server and
	 * client always agree on the day regardless of timezone.
	 */
	function dayLabel(iso: string): string {
		const [year, month, day] = iso.slice(0, 10).split('-').map(Number);
		const monthName = new Intl.DateTimeFormat(locale, { month: 'short', timeZone: 'UTC' }).format(
			new Date(Date.UTC(year, month - 1, day))
		);
		return `${day} ${monthName} ${year}`;
	}

	function timeLabel(iso: string): string {
		return iso.slice(11, 16);
	}

	function isSameDay(a: StoryMessage, b: StoryMessage): boolean {
		return a.date.slice(0, 10) === b.date.slice(0, 10);
	}
</script>

<ol class="mx-auto max-w-2xl space-y-4">
	{#each storyMessages as msg, i (msg.id)}
		{#if i === 0 || !isSameDay(storyMessages[i - 1], msg)}
			<li class="flex items-center gap-4 pt-3 first:pt-0">
				<span class="hidden h-px flex-1 bg-border sm:block"></span>
				<span
					class="rounded-full border border-border bg-muted px-3 py-1 text-[11px] font-bold tracking-[0.06em] text-muted-foreground uppercase"
				>
					{dayLabel(msg.date)}
				</span>
				<span class="h-px flex-1 bg-border"></span>
			</li>
		{/if}

		<li class="flex gap-4">
			<div class="hidden w-6 shrink-0 flex-col items-center gap-2 pt-6 sm:flex">
				<span class="h-2.5 w-2.5 rounded-full border-2 border-primary bg-background"></span>
				{#if i < storyMessages.length - 1}
					<span class="w-px flex-1 bg-border"></span>
				{/if}
			</div>

			<article
				class="group flex-1 rounded-2xl border border-border bg-card p-5 shadow-sm transition-colors hover:border-primary/40"
			>
				<header class="flex items-center gap-3">
					<span
						class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary"
					>
						<Send size={14} />
					</span>
					<div class="min-w-0 leading-tight">
						<p class="truncate text-xs font-bold"><!-- @wc-ignore -->code and whatnot</p>
						<p class="truncate text-[10px] text-muted-foreground"><!-- @wc-ignore -->@codenshii</p>
					</div>
				</header>

				{#if msg.forwardedFrom}
					<p class="mt-3 text-[11px] font-semibold text-muted-foreground">
						Forwarded from {msg.forwardedFrom}
					</p>
				{/if}

				{#if msg.quote}
					<p
						class="mt-3 line-clamp-2 border-l-2 border-primary/50 bg-muted/70 py-1.5 pr-2 pl-3 text-xs leading-relaxed text-muted-foreground italic"
					>
						{msg.quote}
					</p>
				{/if}

				{#if msg.lines.length}
					<div class="mt-3 space-y-2 text-sm leading-relaxed">
						{#each msg.lines as line, lineIndex (lineIndex)}
							<p>
								{#each parts(line) as part, partIndex (partIndex)}
									{#if part.href}
										<a
											href={part.href}
											target="_blank"
											rel="noreferrer"
											class="font-medium break-words text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
										>
											{part.text}
										</a>
									{:else}
										{part.text}
									{/if}
								{/each}
							</p>
						{/each}
					</div>
				{/if}

				{#if msg.image}
					<a
						href={storyPostUrl(msg.id)}
						target="_blank"
						rel="noreferrer"
						class="mt-3 block overflow-hidden rounded-xl border border-border"
					>
						<img
							src={msg.image.src}
							alt={msg.image.alt}
							loading="lazy"
							decoding="async"
							class="max-h-96 w-full bg-muted object-contain"
						/>
					</a>
				{/if}

				<footer class="mt-4 flex items-center justify-between gap-3">
					<span class="text-[11px] text-muted-foreground">
						<time datetime={msg.date}>{timeLabel(msg.date)}</time>
						<!-- @wc-ignore -->UTC
					</span>
					<a
						href={storyPostUrl(msg.id)}
						target="_blank"
						rel="noreferrer"
						class="inline-flex items-center gap-1 text-[11px] font-bold text-primary transition-opacity group-hover:opacity-100 sm:opacity-60 sm:hover:opacity-100"
					>
						View on Telegram
						<ArrowUpRight size={12} />
					</a>
				</footer>
			</article>
		</li>
	{/each}
</ol>
