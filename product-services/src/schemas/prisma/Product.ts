import {z} from 'zod';
import Category from './Category';

const Product = z.object({
	id: z.string().uuid(),
	name: z.string().max(255, {message: 'Must be 255 or fewer characters long'}).nullable(),
	prices: z.number().int(),
	description: z.string().nullable(),
	categoryId: z.string().uuid(),
	category: Category.optional(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export default Product;
