<script lang="ts">
  import { page } from '$app/stores';
  import { Sun, Moon, Languages, Bookmark } from '@lucide/svelte';
  import type { Locale } from '../../locales/data.js';
  import { switchLocaleUrl } from '../i18n.js';
  import { getSavedState } from '../stores/saved.svelte';

  let { locale = 'en' }: { locale?: Locale } = $props();

  const saved = getSavedState();

  let dark = $state(false);

  // The inline script in app.html applies the stored theme before hydration, so
  // adopt it after mount instead of guessing (avoids a hydration mismatch).
  $effect(() => {
    dark = document.documentElement.classList.contains('dark');
  });

  function toggleTheme() {
    dark = !dark;
    document.documentElement.classList.toggle('dark', dark);
    try {
      localStorage.setItem('theme', dark ? 'dark' : 'light');
    } catch {
      /* storage unavailable (private mode) — theme just won't persist */
    }
  }

  // `href` is localized by wuchale: the extractor recognised these as URL
  // patterns (`url.patterns` in wuchale.config.js) and rewrites each literal to
  // `localize(href, locale)` at render time. Don't wrap them again.
  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Proverbs', href: '/proverbs' },
    { label: 'Saved', href: '/saved' },
    { label: 'Download', href: '/download' },
    { label: 'About', href: '/about' },
    { label: 'API', href: '/documentation' },
  ];

  // The only link that points at a *different* locale than the current one.
  //
  // `data-sveltekit-preload-data="off"` is load-bearing, not cosmetic: hovering
  // a link makes SvelteKit run the target's universal load (`_preload_data` →
  // `load_route` → `load_node`), and `wuchale`'s `loadLocale()` commits the
  // catalog GLOBALLY — so prefetching a link that points at the other locale
  // re-renders the whole page in that language without any click. This is the
  // bug documented in docs/i18nLocaleHoverBug.md; it would come straight back
  // if this attribute were dropped.
  const target = $derived<Locale>(locale === 'am' ? 'en' : 'am');
  const switchHref = $derived(switchLocaleUrl($page.url.pathname, target, $page.url.search));
</script>

<header class="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
  <div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
    <a href="/" class="flex items-center gap-3">
      <img src="/logo.png" alt="Abbabal logo" class="h-8 w-8 rounded-lg object-cover" />
      <div class="leading-tight">
        <div class="text-lg font-bold tracking-tight">Abbabal</div>
        <div class="text-[10px] font-medium text-muted-foreground -mt-0.5">የእውቀት ቃላት</div>
      </div>
    </a>

    <nav class="hidden items-center gap-8 md:flex">
      {#each navItems as item}
        <a
          href={item.href}
          class="text-sm font-medium transition-colors {$page.url.pathname === item.href ? 'text-foreground font-semibold border-b-2 border-foreground pb-0.5' : 'text-muted-foreground hover:text-foreground'}"
        >
          {item.label}
        </a>
      {/each}
    </nav>

    <div class="flex items-center gap-3">
      <a
        href="/saved"
        class="relative flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:hidden"
        aria-label="Saved proverbs"
      >
        <Bookmark size={16} class={saved.items.length ? 'fill-primary text-primary' : ''} />
        {#if saved.items.length > 0}
          <span
            class="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground"
          >
            {saved.items.length}
          </span>
        {/if}
      </a>
      <a
        href={switchHref}
        hreflang={target}
        data-sveltekit-preload-data="off"
        class="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        aria-label={target === 'am' ? 'Switch to Amharic' : 'Switch to English'}
      >
        <Languages size={16} />
      </a>
      <button
        onclick={toggleTheme}
        aria-pressed={dark}
        aria-label="Toggle theme"
        class="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
      >
        {#if dark}
          <Sun size={16} />
        {:else}
          <Moon size={16} />
        {/if}
      </button>
    </div>
  </div>
</header>
