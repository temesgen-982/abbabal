declare global {
	namespace App {
		// Nothing is put on `event.locals` in this app, but the alias has to exist
		// for SvelteKit's generated `App.Locals` type. A type alias is used instead
		// of an empty `interface Locals {}` (which `@typescript-eslint` rejects).
		type Locals = Record<string, never>;
	}
}

export {};
