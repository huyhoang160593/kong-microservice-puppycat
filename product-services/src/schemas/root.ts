import {z} from 'zod';
import Product from './prisma/Product';
import Category from './prisma/Category';
import {imgbbResponse} from './base/imgbbResponse';

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

const fileSchema = z.object({
	filename: z.string().optional(),
	mimetype: z.string().regex(/^image\/\w+$/, 'the file must be an image').optional(),
	encoding: z.string().optional(),
}).catchall(z.any());

export const UploadSchema = {
	params: {},
	body: {
		POST_FILE: z.object({
			file: fileSchema,
		}),
	},
	response: {
		POST_FILE: imgbbResponse,
	},
} satisfies BaseSchema;

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
			imageURL: true,
			categoryId: true,
		}),
		PUT_PRODUCT: Product.pick({
			name: true,
			prices: true,
			imageURL: true,
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
			imageURL: true,
		}),
		PUT_CATEGORY: Category.pick({
			name: true,
			imageURL: true,
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
