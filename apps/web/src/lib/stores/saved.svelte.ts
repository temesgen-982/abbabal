import { browser } from '$app/environment';

/**
 * A proverb saved to the browser's `localStorage`.
 *
 * The list page only knows the Amharic text and the source, whereas the detail
 * page also has the English translation and meaning, so those fields are
 * optional. Whichever page saves first decides how rich the entry is; opening
 * the detail page for a list-saved proverb fills in the rest (see the effect in
 * `routes/proverbs/[id]/+page.svelte`).
 */
export type SavedProverb = {
	id: number;
	text: string;
	source?: string | null;
	translation?: string | null;
	meaning?: string | null;
	/** Epoch ms of when it was saved; newest first. */
	savedAt?: number;
};

const STORAGE_KEY = 'abbabal.saved';

let items = $state<SavedProverb[]>([]);
let loaded = false;

function isSavedProverb(value: unknown): value is SavedProverb {
	if (!value || typeof value !== 'object') return false;
	const v = value as Record<string, unknown>;
	return typeof v.id === 'number' && typeof v.text === 'string';
}

/**
 * Read the saved list from `localStorage`.
 *
 * Called once from the root layout *after mount*: loading at module-eval time
 * would let the first client render disagree with the SSR'd HTML (the server
 * always sees an empty list) and logs a hydration mismatch on every bookmark
 * icon and on the saved page.
 */
export function initSaved() {
	if (loaded || !browser) return;
	loaded = true;
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		const parsed = raw ? JSON.parse(raw) : [];
		items = Array.isArray(parsed) ? parsed.filter(isSavedProverb) : [];
	} catch {
		items = [];
	}
}

function persist() {
	if (!browser) return;
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
	} catch {
		/* storage unavailable (private mode) — the list just won't persist */
	}
}

/** True when the richer detail-page fields are already present and identical. */
function unchanged(a: SavedProverb, b: SavedProverb): boolean {
	return (
		a.text === b.text &&
		(a.source ?? null) === (b.source ?? null) &&
		(a.translation ?? null) === (b.translation ?? null) &&
		(a.meaning ?? null) === (b.meaning ?? null)
	);
}

/**
 * The saved-proverbs state, shared by every component that imports it (the
 * list, the detail page, the header and the saved page all read the same list).
 */
export function getSavedState() {
	return {
		get items() {
			return items;
		},
		has(id: number) {
			return items.some((p) => p.id === id);
		},
		/**
		 * Add or update an entry. A no-op when nothing changed, so the detail
		 * page can call it on every load to enrich list-saved entries without
		 * looping through the effect that watches this state.
		 */
		save(proverb: SavedProverb) {
			const idx = items.findIndex((p) => p.id === proverb.id);
			if (idx >= 0) {
				const existing = items[idx];
				if (unchanged(existing, proverb)) return;
				items[idx] = { ...existing, ...proverb, savedAt: existing.savedAt ?? Date.now() };
			} else {
				items = [{ ...proverb, savedAt: Date.now() }, ...items];
			}
			persist();
		},
		toggle(proverb: SavedProverb) {
			if (items.some((p) => p.id === proverb.id)) {
				items = items.filter((p) => p.id !== proverb.id);
				persist();
			} else {
				items = [{ ...proverb, savedAt: Date.now() }, ...items];
				persist();
			}
		},
		remove(id: number) {
			if (!items.some((p) => p.id === id)) return;
			items = items.filter((p) => p.id !== id);
			persist();
		},
		clear() {
			if (items.length === 0) return;
			items = [];
			persist();
		}
	};
}
