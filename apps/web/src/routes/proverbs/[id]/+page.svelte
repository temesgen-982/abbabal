<script lang="ts">
  import { ArrowLeft, Copy, Share2, Shuffle, Check, BookOpenText, Calendar, Eye, Tag } from "@lucide/svelte";
  import { Badge } from "$lib/components/ui/badge";
  import { Button } from "$lib/components/ui/button";
  import { goto } from "$app/navigation";
  import Seo from "$lib/seo/Seo.svelte";
  import { getSiteUrl } from "$lib/seo/site.js";
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();

  const p = $derived(data.proverb);
  const baseUrl = $derived(data.baseUrl);

  function trim(text: string, max = 155) {
    return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
  }

  const amharicText = $derived(p?.text ?? "");

  const englishTranslation = $derived(
    p?.interpretations?.find(
      (i: { type: string; language: string }) => i.type === "translation" && i.language === "en",
    )?.content,
  );

  const englishMeaning = $derived(
    p?.interpretations?.find(
      (i: { type: string; language: string }) => i.type === "meaning" && i.language === "en",
    )?.content,
  );

  const amharicMeaning = $derived(
    p?.interpretations?.find(
      (i: { type: string; language: string }) => i.type === "meaning" && i.language === "am",
    )?.content,
  );

  const viewCount = $derived(
    p?.latestStats?.views ? p.latestStats.views.toLocaleString() : null,
  );

  const formattedDate = $derived(
    p?.createdAt
      ? new Date(p.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : null,
  );

  const sourceLabel = $derived(
    p?.source === "admin_import"
      ? "Admin Archive"
      : p?.source === "telegram"
        ? "Telegram Collection"
        : p?.source === "user"
          ? "User Submission"
          : "Unknown",
  );

  const statusBadge = $derived(
    p?.status === "approved"
      ? { label: "Verified", class: "text-green-600 dark:text-green-400 border-green-200 dark:border-green-900" }
      : p?.status === "pending"
        ? { label: "Pending Review", class: "text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900" }
        : p?.status === "rejected"
          ? { label: "Rejected", class: "text-red-600 dark:text-red-400 border-red-200 dark:border-red-900" }
          : null,
  );

  let copied = $state(false);
  let shared = $state(false);

  const proverbUrl = $derived(p ? `${getSiteUrl()}/proverbs/${p.id}` : getSiteUrl());

  const seoTitle = $derived(p ? `${amharicText} — Amharic Proverb | Abbabal` : "Proverb | Abbabal");

  const seoDescription = $derived(
    trim(
      englishTranslation
        ? `${englishTranslation} — meaning, explanation, and cultural context of the Amharic proverb “${amharicText}”.`
        : `Meaning and explanation of the Amharic proverb “${amharicText}” from the Abbabal archive.`
    )
  );

  const proverbJsonLd = $derived(
    p
      ? {
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "DefinedTerm",
              "@id": `${proverbUrl}#term`,
              name: amharicText,
              description: englishMeaning ?? englishTranslation ?? seoDescription,
              url: proverbUrl,
              inLanguage: "am",
              alternateName: englishTranslation ?? undefined,
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: `${getSiteUrl()}/` },
                { "@type": "ListItem", position: 2, name: "Proverbs", item: `${getSiteUrl()}/proverbs` },
                { "@type": "ListItem", position: 3, name: amharicText, item: proverbUrl },
              ],
            },
          ],
        }
      : undefined
  );

  async function copyText() {
    const parts = [amharicText];
    if (englishTranslation) parts.push(`"${englishTranslation}"`);
    if (englishMeaning) parts.push(englishMeaning);
    await navigator.clipboard.writeText(parts.join("\n\n"));
    copied = true;
    setTimeout(() => (copied = false), 2000);
  }

  async function shareLink() {
    const url = window.location.href;
    const title = amharicText;
    const text = englishTranslation ? `"${englishTranslation}"` : "Amharic Proverb";

    if (navigator.share) {
      await navigator.share({ title, text, url });
      shared = true;
      setTimeout(() => (shared = false), 2000);
    } else {
      await navigator.clipboard.writeText(url);
      copied = true;
      setTimeout(() => (copied = false), 2000);
    }
  }

  async function goToRandom() {
    try {
      const res = await fetch(`${baseUrl}/proverbs/random`, {
        headers: { accept: "application/json" },
      });
      if (res.ok) {
        const random = await res.json();
        goto(`/proverbs/${random.id}`);
      }
    } catch {
      // silently fail
    }
  }
</script>

<Seo title={seoTitle} description={seoDescription} path={`/proverbs/${p.id}`} jsonLd={proverbJsonLd} />

<main class="text-foreground">
  {#if p}
    <div class="mx-auto max-w-4xl px-4 py-12 md:py-20">
      <a
        href="/proverbs"
        class="text-muted-foreground hover:text-foreground mb-10 inline-flex items-center gap-1.5 text-xs uppercase tracking-widest transition-colors"
      >
        <ArrowLeft size={14} />
        All Proverbs
      </a>

      <div class="mx-auto max-w-2xl">
        <article class="relative">
          <div class="relative overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-sm md:p-14">
            {#if statusBadge}
              <Badge
                variant="outline"
                class={`mb-8 text-[0.6rem] font-semibold uppercase tracking-[0.25em] ${statusBadge.class}`}
              >
                {statusBadge.label}
              </Badge>
            {/if}

            <h1 class="font-serif text-4xl font-bold leading-tight md:text-5xl lg:text-6xl" dir="auto">
              {amharicText}
            </h1>

            <div class="my-8 flex items-center justify-center gap-2">
              <span class="h-px w-12 bg-primary/30"></span>
              <span class="text-xs text-primary/40">✦</span>
              <span class="h-px w-12 bg-primary/30"></span>
            </div>

            {#if englishTranslation}
              <p class="font-serif text-xl italic leading-relaxed text-muted-foreground md:text-2xl">
                &ldquo;{englishTranslation}&rdquo;
              </p>
            {/if}

            {#if englishMeaning}
              <div class="mt-8 border-t border-border/50 pt-8">
                <p class="text-xs uppercase tracking-[0.25em] text-muted-foreground/60">Meaning</p>
                <p class="text-muted-foreground mt-3 leading-relaxed">{englishMeaning}</p>
              </div>
            {/if}

            {#if amharicMeaning}
              <div class="mt-6 border-t border-border/50 pt-6">
                <p class="text-xs uppercase tracking-[0.25em] text-muted-foreground/60">ትርጉም</p>
                <p class="text-muted-foreground mt-3 leading-relaxed" dir="auto">{amharicMeaning}</p>
              </div>
            {/if}

            <div class="mt-10 flex flex-wrap items-center justify-center gap-2">
              {#if viewCount}
                <Badge variant="outline" class="flex items-center gap-1.5 text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground/60">
                  <Eye size={12} />
                  {viewCount} views
                </Badge>
              {/if}
              {#if sourceLabel}
                <Badge variant="outline" class="flex items-center gap-1.5 text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground/60">
                  <BookOpenText size={12} />
                  {sourceLabel}
                </Badge>
              {/if}
            </div>
          </div>

          <div class="mt-6 flex flex-wrap items-center justify-center gap-2">
            <Button variant="outline" class="gap-2" onclick={shareLink}>
              {#if shared}
                <Check size={16} />
                Link copied
              {:else}
                <Share2 size={16} />
                Share
              {/if}
            </Button>

            <Button variant="outline" class="gap-2" onclick={copyText}>
              {#if copied}
                <Check size={16} />
                Copied
              {:else}
                <Copy size={16} />
                Copy
              {/if}
            </Button>

            <Button variant="outline" class="gap-2" onclick={goToRandom}>
              <Shuffle size={16} />
              Random
            </Button>
          </div>
        </article>

        <section class="mt-16">
          <h2 class="text-xs uppercase tracking-[0.3em] text-muted-foreground/60">Details</h2>
          <div class="mt-4 grid gap-px overflow-hidden rounded-2xl border border-border bg-border">
            {#if formattedDate}
              <div class="flex items-center justify-between bg-card px-5 py-3.5 text-sm">
                <span class="flex items-center gap-2 text-muted-foreground">
                  <Calendar size={14} />
                  Added
                </span>
                <span class="font-medium">{formattedDate}</span>
              </div>
            {/if}
            {#if sourceLabel}
              <div class="flex items-center justify-between bg-card px-5 py-3.5 text-sm">
                <span class="flex items-center gap-2 text-muted-foreground">
                  <BookOpenText size={14} />
                  Source
                </span>
                <span class="font-medium">{sourceLabel}</span>
              </div>
            {/if}
            {#if viewCount}
              <div class="flex items-center justify-between bg-card px-5 py-3.5 text-sm">
                <span class="flex items-center gap-2 text-muted-foreground">
                  <Eye size={14} />
                  Views
                </span>
                <span class="font-medium">{viewCount}</span>
              </div>
            {/if}
            {#if p?.id}
              <div class="flex items-center justify-between bg-card px-5 py-3.5 text-sm">
                <span class="flex items-center gap-2 text-muted-foreground">
                  <Tag size={14} />
                  ID
                </span>
                <span class="font-medium">#{p.id}</span>
              </div>
            {/if}
          </div>
        </section>
      </div>
    </div>
  {/if}
</main>
