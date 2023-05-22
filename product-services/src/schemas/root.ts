import {z} from 'zod';
import Product from './prisma/Product';
import Category from './prisma/Category';

interface BaseSchema {
	params: Record<string, z.ZodTypeAny>;
	body: Record<string, z.ZodTypeAny>;
	response: Record<string, z.ZodTypeAny>;
}

const productParams = Product.pick({
	id: true,
});

const CategoryParams = Category.pick({
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
		GET_PRODUCTS: z.array(Product.extend({
			category: Category,
		})),
		GET_PRODUCT: Product,
		POST_PRODUCT: Product,
		PUT_PRODUCT: Product,
		DELETE_PRODUCT: z.null(),
	},
} satisfies BaseSchema;

export const CategorySchema = {
	params: {
		GET_CATEGORY: CategoryParams,
		PUT_CATEGORY: CategoryParams,
		DELETE_CATEGORY: CategoryParams,
	},
	body: {
		POST_CATEGORY: Category.pick({
			name: true,
		}),
		PUT_CATEGORY: Category.pick({
			name: true,
		}),
	},
	response: {
		GET_CATEGORIES: z.array(Category.extend({
			product: z.array(Product),
		})),
		GET_CATEGORY: Category.extend({
			product: z.array(Product),
		}),
		POST_CATEGORY: Category,
		PUT_CATEGORY: Category,
		DELETE_CATEGORY: z.null(),
	},
} satisfies BaseSchema;
