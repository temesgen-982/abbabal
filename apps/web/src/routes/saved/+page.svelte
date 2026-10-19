<script lang="ts">
  import { onMount } from "svelte";
  import { Bookmark, ArrowRight, Trash2 } from "@lucide/svelte";
  import { resolve } from "$app/paths";
  import Seo from "$lib/seo/Seo.svelte";
  import { localize } from "$lib/i18n.js";
  import { getSavedState } from "$lib/stores/saved.svelte";
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();

  const saved = getSavedState();
  const locale = $derived(data.locale);

  // The list lives in `localStorage` and is read after mount (see `initSaved`),
  // so render the real list only then — otherwise the first client render would
  // disagree with the empty server output and log a hydration mismatch.
  let mounted = $state(false);
  onMount(() => (mounted = true));
</script>

<Seo
  title="Saved Proverbs — Abbabal"
  description="The Amharic proverbs you've bookmarked, kept locally in your browser."
  path="/saved"
  noindex
/>

<div class="mx-auto max-w-4xl px-6">
  <div class="py-8">
    <div class="flex items-center gap-3">
      <div class="h-7 w-1 rounded-full bg-primary"></div>
      <div>
        <h1 class="text-3xl font-extrabold tracking-tight">Saved Proverbs</h1>
        <p class="mt-0.5 text-sm text-muted-foreground">
          Proverbs you've bookmarked, kept on this device.
        </p>
      </div>
    </div>
  </div>

  {#if !mounted}
    <div class="py-20"></div>
  {:else if saved.items.length === 0}
    <div
      class="flex flex-col items-center justify-center rounded-2xl border border-border bg-card py-20 text-center"
    >
      <Bookmark size={40} class="text-muted-foreground/40" />
      <p class="mt-4 text-sm font-semibold">No saved proverbs yet</p>
      <p class="mt-1 max-w-xs text-xs text-muted-foreground">
        Tap the bookmark on a proverb to save it here for later.
      </p>
      <a
        href={localize(resolve("/proverbs"), locale)}
        class="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
      >
        <span>Browse proverbs</span>
        <ArrowRight size={14} />
      </a>
    </div>
  {:else}
    <div class="pb-16">
      <div class="mb-4 flex items-center justify-between">
        <p class="text-xs text-muted-foreground">{saved.items.length} saved</p>
        <button
          onclick={() => saved.clear()}
          class="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-destructive"
        >
          <Trash2 size={13} />
          <span>Clear all</span>
        </button>
      </div>

      <div class="flex flex-col gap-4">
        {#each saved.items as item (item.id)}
          <div
            class="grid items-start gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md md:grid-cols-[1fr_auto]"
          >
            <a href={localize(resolve("/proverbs/[id]", { id: String(item.id) }), locale)} class="block">
              <p class="font-ethiopic text-lg font-bold leading-relaxed">{item.text}</p>
              {#if item.translation}
                <p class="mt-2 text-sm italic leading-relaxed text-muted-foreground">
                  &ldquo;{item.translation}&rdquo;
                </p>
              {/if}
              {#if item.source}
                <span
                  class="mt-3 inline-block rounded-full bg-muted px-3 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  {item.source}
                </span>
              {/if}
            </a>
            <button
              onclick={() => saved.remove(item.id)}
              class="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-primary transition-colors hover:border-primary hover:bg-primary hover:text-white"
              aria-label="Remove from saved"
            >
              <Bookmark size={14} class="fill-current" />
            </button>
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>
