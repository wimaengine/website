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
			title: z.string().min(1),
			summary: z.string().min(1),
			author: z.string().min(1),
			publishedAt: z.string().min(1),
			image: image().optional(),
		}),
});

export const collections = {
	news,
};
