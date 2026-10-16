<script lang="ts">
	import {
		BookOpen,
		Download,
		Leaf,
		ArrowRight,
		ArrowDown,
		ArrowUpRight,
		Send
	} from '@lucide/svelte';
	import DataSource from '$lib/components/DataSource.svelte';
	import StoryTimeline from '$lib/components/StoryTimeline.svelte';
	import Seo from '$lib/seo/Seo.svelte';
	import { page } from '$app/state';
</script>

<Seo
	title="About Abbabal — Preserving Amharic Proverb Heritage"
	description="Learn how Abbabal collects, verifies, and shares Amharic proverbs (አባባሎች) as an open, CC BY 4.0 dataset for everyone."
	path="/about"
/>

<div class="mx-auto max-w-7xl px-6">
	<!-- Hero -->
	<section class="grid items-center gap-10 py-10 md:grid-cols-[1fr_1.1fr] md:py-14">
		<div>
			<p class="mb-3 text-xs font-bold tracking-[0.08em] text-primary uppercase">ABOUT ABBABAL</p>
			<h1 class="text-[2.4rem] leading-[1.15] font-extrabold tracking-tight md:text-[2.75rem]">
				Preserving <span class="text-primary">wisdom</span>.<br />
				Sharing <span class="text-primary">culture</span>.
			</h1>
			<p class="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
				Abbabal is a digital home for Amharic proverbs and the wisdom they carry. We collect,
				verify, and organize proverbs and their interpretations, then make them open and accessible
				for everyone — today and for generations to come.
			</p>
			<div class="mt-6 flex gap-3">
				<a
					href="/proverbs"
					class="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
				>
					<BookOpen size={14} />
					Explore Proverbs
				</a>
				<a
					href="/download"
					class="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-2.5 text-xs font-semibold transition-colors hover:bg-muted"
				>
					<Download size={14} />
					Download Database
				</a>
			</div>
		</div>

		<!-- Tree SVG -->
		<div class="flex justify-center">
			<svg
				width="240"
				height="240"
				viewBox="0 0 100 100"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<circle cx="50" cy="40" r="30" fill="#596b38" opacity="0.15" />
				<circle cx="35" cy="35" r="20" fill="#596b38" opacity="0.2" />
				<circle cx="65" cy="35" r="20" fill="#596b38" opacity="0.2" />
				<path
					d="M48 85V55C48 50 42 45 40 40M52 85V55C52 50 58 45 60 40M45 50C48 48 50 44 50 40"
					stroke="#3f4e28"
					stroke-width="4"
					stroke-linecap="round"
				/>
				<path
					d="M50 35C40 25 25 35 30 45C20 45 20 60 35 60C35 65 50 68 50 60C55 68 70 65 70 60C85 60 85 45 75 45C80 35 65 25 50 35Z"
					fill="#596b38"
				/>
			</svg>
		</div>
	</section>

	<!-- Story Grid -->
	<section class="mb-6 grid gap-8 md:grid-cols-2">
		<div class="rounded-2xl border border-border bg-card p-8 shadow-sm">
			<div class="mb-4 flex items-center gap-2.5">
				<Leaf size={20} class="text-primary" />
				<h3 class="text-xl font-extrabold">Our Story</h3>
			</div>
			<p class="mb-3 text-sm leading-relaxed text-muted-foreground">
				Abbabal started as a simple idea: What if thousands of Amharic proverbs, scattered across
				everywhere could live in one open place — for everyone to read, learn, and build with?
			</p>
			<p class="mb-3 text-sm leading-relaxed text-muted-foreground">
				We gathered the proverbs, verified them carefully, and paired each one with clear
				interpretations. Then we built the tools — a website, an API, and a mobile app — to make
				this wisdom easy to access and use.
			</p>
			<p class="text-sm leading-relaxed text-muted-foreground">
				Today, Abbabal is an open platform for learning, research, and creativity.
			</p>
		</div>

		<div
			class="relative flex flex-col justify-center rounded-2xl border border-border bg-muted/60 bg-[radial-gradient(circle_at_right_bottom,rgba(89,107,56,0.08),transparent_70%)] p-9"
		>
			<p class="text-4xl leading-none text-primary">Built by</p>
			<div
				class="h-[100px] w-[100px] shrink-0 overflow-hidden rounded-full border-2 border-border bg-muted"
			>
				<img
					src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
					alt="Temesgen Adane"
					class="h-full w-full object-cover"
				/>
			</div>
			<div>
				<h4 class="text-base font-bold">Temesgen Adane</h4>
				<p class="text-[11px] font-semibold text-primary">Developer & Founder</p>
				<p class="mt-2 text-[11px] leading-relaxed text-muted-foreground">
					Based in Ethiopia. Passionate about open data, culture, and tools that empower people.
				</p>
				<p class="mt-2 text-[11px] leading-relaxed text-muted-foreground">
					I believe that preserving our wisdom is one of the best ways to build a better future.
				</p>
				<a
					href="https://temesgen.com.et"
					target="_blank"
					rel="noreferrer"
					class="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-primary"
				>
					Personal site <ArrowRight size={11} />
				</a>
			</div>
		</div>
	</section>

	<!-- Data Source -->
	<section class="mb-12 grid gap-8 md:grid-cols-2">
		<DataSource />
	</section>

	<!-- Full Story -->
	<section id="full-story" class="mb-14 scroll-mt-24">
		<div class="mb-6 flex flex-wrap items-end justify-between gap-5">
			<div>
				<p class="mb-2 text-xs font-bold tracking-[0.08em] text-primary uppercase">
					The Full Story
				</p>
				<h2 class="text-2xl font-extrabold tracking-tight md:text-3xl">
					How Abbabal was <span class="text-primary">actually</span> built
				</h2>
				<p class="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
					Every milestone, dead end, and facepalm — posted as it happened on my Telegram channel.
					From scraping the first 7,000 proverbs to shipping the mobile app, in my own words.
				</p>
			</div>
			<a
				href="https://t.me/codenshii"
				target="_blank"
				rel="noreferrer"
				class="inline-flex shrink-0 items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
			>
				<Send size={14} />
				Follow @codenshii
				<ArrowUpRight size={13} />
			</a>
		</div>

		<StoryTimeline locale={page.data.locale} />
	</section>
</div>
