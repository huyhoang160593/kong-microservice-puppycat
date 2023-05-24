import {z} from 'zod';

const imageSchema = z.object({
	filename: z.string(),
	name: z.string(),
	mime: z.string(),
	extension: z.string(),
	url: z.string(),
});

const thumbSchema = z.object({
	filename: z.string(),
	name: z.string(),
	mime: z.string(),
	extension: z.string(),
	url: z.string(),
});

const mediumSchema = z.object({
	filename: z.string(),
	name: z.string(),
	mime: z.string(),
	extension: z.string(),
	url: z.string(),
});

const dataSchema = z.object({
	id: z.string(),
	title: z.string(),
	url_viewer: z.string(),
	url: z.string(),
	display_url: z.string(),
	width: z.number(),
	height: z.number(),
	size: z.number(),
	time: z.number(),
	expiration: z.number(),
	image: imageSchema.optional(),
	thumb: thumbSchema.optional(),
	medium: mediumSchema.optional(),
	delete_url: z.string(),
});

export const imgbbResponse = z.object({
	data: dataSchema,
	success: z.boolean(),
	status: z.number(),
});
