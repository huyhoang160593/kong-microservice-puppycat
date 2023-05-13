import {z} from 'zod';

const Category = z.object({
	id: z.string().uuid(),
	name: z.string().max(255, {message: 'Must be 255 or fewer characters long'}).nullable(),
});

export default Category;
