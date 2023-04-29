import {z} from 'zod';

const Product = z.object({
	id: z.string().uuid(),
	name: z.string().nullable(),
	prices: z.number().int(),
	description: z.string().nullable(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export default Product;
