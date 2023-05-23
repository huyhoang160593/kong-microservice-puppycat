import type {FastifyPluginAsync} from 'fastify';
import * as FormData from 'form-data';
import {ProductSchema, UploadSchema} from '../schemas/root';
import {errorResponse} from '../schemas/base/TypeErrorResponse';
import {type ZodTypeProvider} from 'fastify-type-provider-zod';
import {type imgbbResponse} from '../schemas/base/imgbbResponse';

const root: FastifyPluginAsync = async (fastify, _opts): Promise<void> => {
	/**
	 * @deprecated fastify.get('/', async (_request, _reply) => ({status: true}));
	 * */
	fastify.get('/health/check', async (_request, _reply) => ({status: 'online'}));
	fastify.withTypeProvider<ZodTypeProvider>().post('/upload/image', {
		schema: {
			consumes: ['multipart/form-data'],
			body: UploadSchema.body.POST_FILE,
			response: {
				200: UploadSchema.response.POST_FILE,
			},
		},
	}, async (request, response) => {
		const {file} = request.body;
		const buffer = await file.toBuffer() as Buffer;
		const base64Image = Buffer.from(buffer).toString('base64');

		const imgbbURL = new URL('https://api.imgbb.com/1/upload');
		imgbbURL.searchParams.append('key', process.env.IMGBB_KEY!);
		const formData = new FormData.default();
		formData.append('image', base64Image);
		const uploadResponse = await fastify.got.post(imgbbURL.toString(), {body: formData}).json();
		return response.send(uploadResponse as Zod.infer<typeof imgbbResponse>);
	});

	const TAGS = {
		tags: ['product'],
	};

	fastify.withTypeProvider<ZodTypeProvider>().get('/', {
		schema: {
			response: {
				200: ProductSchema.response.GET_PRODUCTS,
				400: errorResponse(400),
			},
			...TAGS,
		},
	}, async (_request, response) => {
		const products = await fastify.prisma.product.findMany({
			include: {
				category: true,
			}});
		return response.send(products);
	});

	fastify.withTypeProvider<ZodTypeProvider>().get('/:id', {
		schema: {
			params: ProductSchema.params.GET_PRODUCT,
			response: {
				200: ProductSchema.response.GET_PRODUCT,
				400: errorResponse(400),
			},
			...TAGS,
		},
	}, async (request, response) => {
		const {id} = request.params;
		const productFound = await fastify.prisma.product.findFirst({
			where: {
				id,
			},
			include: {
				category: true,
			},
		});
		if (!productFound) {
			throw fastify.httpErrors.badRequest(`the product with id ${id} didn't exist`);
		}

		return response.send(productFound);
	});

	fastify.withTypeProvider<ZodTypeProvider>().post('/', {
		schema: {
			body: ProductSchema.body.POST_PRODUCT,
			response: {
				201: ProductSchema.response.POST_PRODUCT,
				400: errorResponse(400),
			},
			...TAGS,
		},
	}, async (request, response) => {
		const {name, description, prices, categoryId} = request.body;
		const productCreated = await fastify.prisma.product.create({
			data: {
				name, prices, description, categoryId,
			},
		});
		return response.status(201).send(productCreated);
	});

	fastify.withTypeProvider<ZodTypeProvider>().put('/:id', {
		schema: {
			params: ProductSchema.params.PUT_PRODUCT,
			body: ProductSchema.body.PUT_PRODUCT,
			response: {
				200: ProductSchema.response.PUT_PRODUCT,
				400: errorResponse(400),
			},
			...TAGS,
		},
	}, async (request, response) => {
		const {id} = request.params;
		const {name, description, prices, categoryId} = request.body;
		const productUpdated = await fastify.prisma.product.update({
			where: {
				id,
			}, data: {
				name, prices, description, categoryId,
			},
		});
		return response.send(productUpdated);
	});

	fastify.withTypeProvider<ZodTypeProvider>().delete('/:id', {
		schema: {
			params: ProductSchema.params.DELETE_PRODUCT,
			response: {
				204: ProductSchema.response.DELETE_PRODUCT,
				400: errorResponse(400),
			},
			...TAGS,
		},
	}, async (request, response) => {
		const {id} = request.params;
		const deletedProduct = await fastify.prisma.product.delete({where: {id}});
		if (!deletedProduct) {
			throw fastify.httpErrors.badRequest(`The product with id ${id} is not exist in the database`);
		}

		return response.status(204);
	});
};

export default root;
