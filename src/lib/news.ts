import { getCollection } from 'astro:content';
import placeholderImage from '../assets/img-placeholder-dark.jpg';
import { withBase } from './url';

type NewsImage = typeof placeholderImage;

export type NewsItem = {
	href: string;
	title: string;
	summary: string;
	author: string;
	publishedAt: string;
	image: NewsImage;
};

const publishedDateFormatter = new Intl.DateTimeFormat('en-US', {
	day: 'numeric',
	month: 'long',
	timeZone: 'UTC',
	year: 'numeric',
});

export function formatPublishedDate(publishedAt: string): string {
	const date = new Date(`${publishedAt}T00:00:00Z`);

	return Number.isNaN(date.valueOf()) ? publishedAt : publishedDateFormatter.format(date);
}

export async function getNewsItems(limit?: number): Promise<NewsItem[]> {
	const entries = await getCollection('news');

	return entries
		.slice()
		.sort((a, b) => b.data.publishedAt.localeCompare(a.data.publishedAt))
		.slice(0, limit)
		.map(({ id, data }) => ({
			href: withBase(`/news/${id}/`),
			title: data.title,
			summary: data.summary,
			author: data.author,
			publishedAt: data.publishedAt,
			image: data.image ?? placeholderImage,
		}));
}
