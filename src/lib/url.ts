const ABSOLUTE_URL_RE = /^[a-z][a-z0-9+.-]*:/i;

export function withBase(href: string): string {
	if (ABSOLUTE_URL_RE.test(href) || href.startsWith('//')) {
		return href;
	}

	const base = import.meta.env.BASE_URL || '/';
	const normalizedBase = base.endsWith('/') ? base : `${base}/`;
	const bareBase = normalizedBase.slice(0, -1);

	if (href === '' || href === '/' || href === bareBase) {
		return normalizedBase;
	}

	if (href.startsWith(normalizedBase)) {
		return href;
	}

	const baseUrl = new URL(normalizedBase, 'https://example.com');
	const relativeHref = href.startsWith('/') ? href.slice(1) : href;
	const resolved = new URL(relativeHref, baseUrl);

	return `${resolved.pathname}${resolved.search}${resolved.hash}`;
}
