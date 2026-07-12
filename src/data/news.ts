import previewImage from '../assets/img-placeholder-dark.jpg';

export type NewsItem = {
	href: string;
	title: string;
	summary: string;
	author: string;
	publishedAt: string;
	publishedLabel: string;
	image: typeof previewImage;
};

export const newsItems: NewsItem[] = [
	{
		href: '/releases/',
		title: 'Wima 0.3.0 keeps the public surface small.',
		summary: 'A short release note on keeping the engine boundary narrow and the package layout easy to follow.',
		author: 'Wima Team',
		publishedAt: '2026-07-03',
		publishedLabel: 'July 3, 2026',
		image: previewImage,
	},
	{
		href: '/architecture/',
		title: 'Hierarchy and scene graph work stay explicit.',
		summary: 'A preview of how the scene tree stays visible through the hierarchy layer instead of hiding inside a larger runtime object.',
		author: 'Mina Patel',
		publishedAt: '2026-06-24',
		publishedLabel: 'June 24, 2026',
		image: previewImage,
	},
	{
		href: '/examples/',
		title: 'Examples now live on the docs site.',
		summary: 'A quick update on where the sample scenes live and how the docs site now carries the longer walkthroughs.',
		author: 'Avery Chen',
		publishedAt: '2026-06-15',
		publishedLabel: 'June 15, 2026',
		image: previewImage,
	},
	{
		href: 'https://github.com/wimaengine/wima/discussions',
		title: 'Discussion threads collect follow-up questions.',
		summary: 'A community note on discussion threads, implementation feedback, and the parts that need back-and-forth.',
		author: 'Wima Maintainers',
		publishedAt: '2026-06-06',
		publishedLabel: 'June 6, 2026',
		image: previewImage,
	},
];
