import { getCollection } from 'astro:content';
import placeholderImage from '../assets/img-placeholder-dark.jpg';

type NewsImage = typeof placeholderImage;

export type NewsItem = {
	href: string;
	title: string;
	summary: string;
	author: string;
	publishedAt: string;
	publishedLabel: string;
	image: NewsImage;
};

export async function getNewsItems(limit?: number): Promise<NewsItem[]> {
	const entries = await getCollection('news');

	return entries
		.slice()
		.sort((a, b) => b.data.publishedAt.localeCompare(a.data.publishedAt))
		.slice(0, limit)
		.map(({ data }) => ({
			href: data.href,
			title: data.title,
			summary: data.summary,
			author: data.author,
			publishedAt: data.publishedAt,
			publishedLabel: data.publishedLabel,
			image: data.image ?? placeholderImage,
		}));
}
