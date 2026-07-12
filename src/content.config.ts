import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const news = defineCollection({
	loader: glob({
		base: './src/content/news',
		pattern: '**/*.md',
	}),
	schema: ({ image }) =>
		z.object({
			href: z.string().min(1),
			title: z.string().min(1),
			summary: z.string().min(1),
			author: z.string().min(1),
			publishedAt: z.string().min(1),
			publishedLabel: z.string().min(1),
			image: image().optional(),
		}),
});

export const collections = {
	news,
};
