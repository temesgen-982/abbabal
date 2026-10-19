<script lang="ts">
	import { Bookmark, House, Languages, Menu, Moon, Search, Shuffle, User } from '@lucide/svelte';
	import { phoneMockupProverbs, phoneMockupTabs } from '$lib/data/phoneMockup.js';

	// Icon per bottom-nav tab, following the app's order (Home … Profile).
	const tabIcons = [House, Search, Shuffle, Bookmark, User];
	const tabs = phoneMockupTabs.map((label, i) => ({
		label,
		icon: tabIcons[i],
		active: i === 0
	}));
</script>

<div class="relative mx-auto w-[270px] shrink-0 select-none" aria-hidden="true">
	<div class="absolute -inset-6 -z-10 rounded-[3rem] bg-primary/15 blur-2xl"></div>

	<!-- Device frame -->
	<div class="rounded-[2.7rem] bg-[#0f1110] p-[10px] shadow-2xl ring-1 ring-black/20">
		<div class="relative h-[520px] overflow-hidden rounded-[2.15rem] bg-[#f7f6f2]">
			<!-- Notch -->
			<div
				class="absolute top-2 left-1/2 z-20 h-[18px] w-[86px] -translate-x-1/2 rounded-full bg-[#0f1110]"
			></div>

			<!-- Status bar -->
			<div
				class="flex items-center justify-between px-5 pt-2.5 pb-1 text-[9px] font-semibold text-[#1f241a]"
			>
				<span class="ml-1">9:41</span>
				<span class="flex items-center gap-1">
					<span class="inline-block h-2 w-2 rounded-[2px] bg-[#1f241a]/70"></span>
					<span class="inline-block h-2 w-2.5 rounded-[2px] bg-[#1f241a]/70"></span>
					<span class="inline-block h-2 w-3.5 rounded-[2px] bg-[#1f241a]/70"></span>
				</span>
			</div>

			<!-- App header -->
			<div class="flex items-center justify-between border-b border-[#e5e3da] px-3 pt-1.5 pb-2">
				<div
					class="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#1f241a] shadow-sm"
				>
					<Menu size={13} />
				</div>
				<div class="text-center leading-none">
					<p class="font-ethiopic text-[15px] font-bold">አባባል</p>
					<p class="mt-0.5 text-[8px] font-medium text-[#596b38]">Amharic Proverbs</p>
				</div>
				<div class="flex gap-1">
					<div
						class="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#62675d] shadow-sm"
					>
						<Languages size={12} />
					</div>
					<div
						class="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#62675d] shadow-sm"
					>
						<Moon size={12} />
					</div>
				</div>
			</div>

			<!-- Feed -->
			<div class="flex flex-col gap-2.5 px-3 pt-3">
				{#each phoneMockupProverbs as card (card.id)}
					<article
						class="rounded-r-xl bg-white p-3.5 pl-3 shadow-[0_4px_16px_rgba(0,0,0,0.05)]"
						style="border-left: 3px solid {card.accent}"
					>
						<div class="flex items-center justify-between">
							<span class="text-[7px] font-bold tracking-[0.12em] uppercase">
								<span style="color: {card.accent}">{card.id}</span>
								<span class="text-[#b0b0b0]"> • </span>
								<span class="text-[#62675d]">Proverb</span>
							</span>
							<Bookmark size={12} class="text-[#62675d]" />
						</div>
						<p class="mt-2 font-ethiopic text-[15px] leading-snug font-bold text-[#1f241a]">
							{card.text}
						</p>
						<div class="my-2 h-[3px] w-6 rounded-full" style="background: {card.accent}"></div>
						<div class="mb-2 flex items-start gap-2 border-b border-[#e5e3da] pb-2">
							<span class="font-serif text-[22px] leading-[0.45]" style="color: {card.tint}"
								>&ldquo;</span
							>
							<p class="text-[10px] leading-snug text-[#62675d] italic">{card.translation}</p>
						</div>
						<p
							class="text-[7px] font-bold tracking-[0.12em] uppercase"
							style="color: {card.accent}"
						>
							Meaning
						</p>
						<p class="mt-1 line-clamp-2 text-[9.5px] leading-snug text-[#62675d]">
							{card.meaning}
						</p>
					</article>
				{/each}
			</div>

			<!-- Bottom nav -->
			<nav
				class="absolute inset-x-3 bottom-3 flex items-stretch overflow-hidden rounded-2xl border border-[#e5e3da] bg-white shadow-lg"
			>
				{#each tabs as tab (tab.label)}
					<div
						class="relative flex flex-1 flex-col items-center justify-center gap-0.5 py-2"
						style="color: {tab.active ? '#596b38' : '#9a9f8e'}"
					>
						<tab.icon size={15} />
						<span class="text-[7px] font-medium">{tab.label}</span>
						{#if tab.active}
							<span class="absolute bottom-0 h-0.5 w-6 rounded-full bg-[#596b38]"></span>
						{/if}
					</div>
				{/each}
			</nav>
		</div>
	</div>
</div>
