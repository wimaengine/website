const GITHUB_RELEASES_URL = 'https://api.github.com/repos/wimaengine/wima/releases?per_page=100';
const GITHUB_RELEASES_TIMEOUT = 8000;

interface GithubAsset {
	name: string;
	browser_download_url: string;
	size: number;
	download_count: number;
}

interface GithubRelease {
	tag_name: string;
	html_url: string;
	draft: boolean;
	prerelease: boolean;
	created_at: string;
	published_at: string | null;
	assets: GithubAsset[];
}

export type ReleaseAsset = {
	name: string;
	url: string;
	size: number;
	downloadCount: number;
};

export type Release = {
	tag: string;
	href: string;
	publishedAt: string;
	isPrerelease: boolean;
	assets: ReleaseAsset[];
};

const releaseDateFormatter = new Intl.DateTimeFormat('en-US', {
	day: 'numeric',
	month: 'long',
	timeZone: 'UTC',
	year: 'numeric',
});

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null;
}

function isGithubRelease(value: unknown): value is GithubRelease {
	if (!isRecord(value)) {
		return false;
	}

	return (
		typeof value.tag_name === 'string' &&
		typeof value.html_url === 'string' &&
		typeof value.draft === 'boolean' &&
		typeof value.prerelease === 'boolean' &&
		typeof value.created_at === 'string' &&
		(value.published_at === null || typeof value.published_at === 'string') &&
		Array.isArray(value.assets)
	);
}

function isGithubAsset(value: unknown): value is GithubAsset {
	return (
		isRecord(value) &&
		typeof value.name === 'string' &&
		typeof value.browser_download_url === 'string' &&
		typeof value.size === 'number' &&
		Number.isFinite(value.size) &&
		typeof value.download_count === 'number' &&
		Number.isFinite(value.download_count)
	);
}

function normalizeRelease(release: GithubRelease): Release {
	const tag = release.tag_name.trim();

	return {
		tag,
		href: release.html_url,
		publishedAt: release.published_at ?? release.created_at,
		isPrerelease: release.prerelease,
		assets: release.assets.filter(isGithubAsset).map((asset) => ({
			name: asset.name,
			url: asset.browser_download_url,
			size: asset.size,
			downloadCount: asset.download_count,
		})),
	};
}

export function formatReleaseDate(publishedAt: string): string {
	const date = new Date(publishedAt);

	return Number.isNaN(date.valueOf()) ? publishedAt : releaseDateFormatter.format(date);
}

export function formatAssetSize(bytes: number): string {
	if (!Number.isFinite(bytes) || bytes < 0) {
		return 'Size unavailable';
	}

	if (bytes < 1024) {
		return `${bytes} B`;
	}

	const units = ['KB', 'MB', 'GB'];
	let value = bytes / 1024;
	let unitIndex = 0;

	while (value >= 1024 && unitIndex < units.length - 1) {
		value /= 1024;
		unitIndex += 1;
	}

	return `${value.toFixed(value >= 10 ? 0 : 1)} ${units[unitIndex]}`;
}

export async function getReleases(): Promise<Release[]> {
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), GITHUB_RELEASES_TIMEOUT);

	try {
		const response = await fetch(GITHUB_RELEASES_URL, {
			headers: {
				Accept: 'application/vnd.github+json',
				'User-Agent': 'wima-website',
				'X-GitHub-Api-Version': '2022-11-28',
			},
			signal: controller.signal,
		});

		if (!response.ok) {
			throw new Error(`GitHub responded with ${response.status}`);
		}

		const payload: unknown = await response.json();

		if (!Array.isArray(payload)) {
			throw new Error('GitHub returned an unexpected release payload');
		}

		return payload
			.filter(isGithubRelease)
			.filter((release) => !release.draft)
			.map(normalizeRelease)
			.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Unknown error';
		console.warn(`[releases] Unable to load GitHub releases: ${message}`);
		return [];
	} finally {
		clearTimeout(timeout);
	}
}
