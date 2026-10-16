/**
 * Static content shown inside the homepage/download "phone mockup".
 *
 * It lives here rather than inside the component on purpose: the screenshot is
 * decorative marketing imagery, so we don't want its copy pulled into the
 * translation catalog. Keeping it out of the `.svelte` file means the i18n
 * extractor never sees it.
 *
 * The proverbs are real entries from the corpus so the preview matches the app.
 */
export type MockProverb = {
	/** Zero-padded id, as the app renders it */
	id: string;
	text: string;
	translation: string;
	meaning: string;
	/** Left-border accent, cycling like the app's `accentFor()` palette */
	accent: string;
	/** Quote-mark tint, a lighter shade of `accent` */
	tint: string;
};

/** Bottom-nav labels, in the app's order. The first tab is the active one. */
export const phoneMockupTabs = ['Home', 'Search', 'Random', 'Saved', 'Profile'];

export const phoneMockupProverbs: MockProverb[] = [
	{
		id: '0472',
		text: 'መራጭ ይወድቃል ከምራጭ',
		translation: 'The chooser falls from the chosen.',
		meaning: 'Being too picky can leave you worse off than before.',
		accent: '#596b38',
		tint: '#c0d3b8'
	},
	{
		id: '0990',
		text: 'ቀላዋጭ ወጥ ያውቃል',
		translation: 'The stirrer knows the stew.',
		meaning: 'Those closest to the work know it best.',
		accent: '#b45309',
		tint: '#f3d9b8'
	},
	{
		id: '0745',
		text: 'ይጥሉህ አትጥላቸው',
		translation: "Let them wrong you — don't wrong them.",
		meaning: 'Rise above revenge and keep your integrity.',
		accent: '#047857',
		tint: '#b7e0d2'
	}
];
