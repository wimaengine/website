// @ts-check
import { defineConfig } from 'astro/config';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const ABSOLUTE_URL_RE = /^[a-z][a-z0-9+.-]*:/i;

function normalizeSiteUrl(value) {
	const trimmed = value.trim();

	if (!trimmed) {
		return undefined;
	}

	return ABSOLUTE_URL_RE.test(trimmed) ? trimmed : `https://${trimmed}`;
}

function getSiteUrl() {
	const fromEnv = normalizeSiteUrl(process.env.SITE_URL ?? '');

	if (fromEnv) {
		return fromEnv;
	}

	const cnamePath = resolve(process.cwd(), 'public/CNAME');

	if (existsSync(cnamePath)) {
		return normalizeSiteUrl(readFileSync(cnamePath, 'utf8'));
	}

	return undefined;
}

const siteUrl = getSiteUrl();
const basePath = siteUrl ? new URL(siteUrl).pathname : '/';
const base = basePath === '/' ? undefined : basePath.endsWith('/') ? basePath : `${basePath}/`;

// https://astro.build/config
export default defineConfig({
	site: siteUrl,
	...(base ? { base } : {}),
});
