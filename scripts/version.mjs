#!/usr/bin/env node
/**
 * Set the product version across the whole workspace.
 *
 * The root package.json is the source of truth: the Android build reads it to
 * derive versionName / versionCode. Every workspace package mirrors it.
 *
 *   pnpm version:set 0.2.0
 *
 * Only strict `major.minor.patch` is accepted, because the Android versionCode
 * is computed as major * 10000 + minor * 100 + patch.
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const version = process.argv[2];
if (!version) {
	console.error('Usage: pnpm version:set <major.minor.patch>');
	process.exit(1);
}
if (!/^\d+\.\d+\.\d+$/.test(version)) {
	console.error(
		`Invalid version "${version}". Use strict semver (x.y.z) — prerelease ` +
			'suffixes are not supported because the Android versionCode is derived from it.',
	);
	process.exit(1);
}

/** @type {string[]} */
const targets = ['package.json'];
for (const base of ['apps', 'packages']) {
	const dir = join(root, base);
	if (!existsSync(dir)) continue;
	for (const entry of readdirSync(dir)) {
		const rel = join(base, entry, 'package.json');
		if (existsSync(join(root, rel))) targets.push(rel);
	}
}

let changed = 0;
for (const rel of targets) {
	const path = join(root, rel);
	const original = readFileSync(path, 'utf8');
	if (!/"version"\s*:/.test(original)) continue;
	// Replace only the value so each file keeps its own indentation.
	const updated = original.replace(/("version"\s*:\s*)"[^"]*"/, `$1"${version}"`);
	if (updated !== original) {
		writeFileSync(path, updated);
		changed += 1;
		console.log(`  ${rel} -> ${version}`);
	}
}

console.log(`\nSet version ${version} in ${changed} package(s).`);
console.log('Next: update CHANGELOG.md, commit, then tag with `git tag v' + version + '`.');
