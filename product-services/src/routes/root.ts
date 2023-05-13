import type {FastifyPluginAsync} from 'fastify';
import {ProductSchema} from '../schemas/root';
import {errorResponse} from '../schemas/base/TypeErrorResponse';
import {type ZodTypeProvider} from 'fastify-type-provider-zod';

const root: FastifyPluginAsync = async (fastify, _opts): Promise<void> => {
	/**
	 * @deprecated fastify.get('/', async (_request, _reply) => ({status: true}));
	 * */
	fastify.get('/health/check', async (_request, _reply) => ({status: 'online'}));

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
		const products = await fastify.prisma.product.findMany({});
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
		const {name, description, prices} = request.body;
		const productUpdated = await fastify.prisma.product.update({
			where: {
				id,
			}, data: {
				name, prices, description,
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
