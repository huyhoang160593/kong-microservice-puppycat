import {z} from 'zod';
import Product from './prisma/Product';

const productParams = Product.pick({
	id: true,
});

export const ProductSchema = {
	params: {
		GET_PRODUCT: productParams,
		PUT_PRODUCT: productParams,
		DELETE_PRODUCT: productParams,
	},
	body: {
		POST_PRODUCT: Product.pick({
			name: true,
			prices: true,
			description: true,
			categoryId: true,
		}),
		PUT_PRODUCT: Product.pick({
			name: true,
			prices: true,
			description: true,
			categoryId: true,
		}),
	},
	response: {
		GET_PRODUCTS: z.array(Product),
		GET_PRODUCT: Product,
		POST_PRODUCT: Product,
		PUT_PRODUCT: Product,
		DELETE_PRODUCT: z.null(),
	},
} as const;
