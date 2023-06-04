import {type FastifyPluginAsync} from 'fastify';
import {type ZodTypeProvider} from 'fastify-type-provider-zod';
import {CategorySchema} from '../../schemas/root';
import {errorResponse} from '../../schemas/base/TypeErrorResponse';

const category: FastifyPluginAsync = async (fastify, _otps): Promise<void> => {
	const fastifyWithZod = fastify.withTypeProvider<ZodTypeProvider>();
	const TAGS = {
		tags: ['category'],
	};

	fastifyWithZod.get('/', {
		schema: {
			response: {
				200: CategorySchema.response.GET_CATEGORIES,
			},
			...TAGS,
		},
	}, async (_request, response) => {
		const categories = await fastify.prisma.category.findMany({
			include: {
				product: true,
			},
		});
		return response.send(categories);
	});

	fastifyWithZod.get('/:id', {
		schema: {
			params: CategorySchema.params.GET_CATEGORY,
			response: {
				200: CategorySchema.response.GET_CATEGORY,
				400: errorResponse(400),
			},
			...TAGS,
		},
	}, async (request, response) => {
		const {id} = request.params;
		const categoryFound = await fastify.prisma.category.findFirst({
			where: {
				id,
			},
			include: {
				product: true,
			},
		});
		if (!categoryFound) {
			throw fastify.httpErrors.badRequest(`the category with id ${id} didn't exist`);
		}

		return response.send(categoryFound);
	});

	fastifyWithZod.post('/', {
		schema: {
			body: CategorySchema.body.POST_CATEGORY,
			response: {
				201: CategorySchema.response.POST_CATEGORY,
				400: errorResponse(400),
			},
			...TAGS,
		},
	}, async (request, response) => {
		const {name, imageURL} = request.body;
		const categoryCreated = await fastify.prisma.category.create({
			data: {
				name,
				imageURL,
			},
		});
		return response.status(201).send(categoryCreated);
	});

	fastifyWithZod.put('/:id', {
		schema: {
			params: CategorySchema.params.PUT_CATEGORY,
			body: CategorySchema.body.PUT_CATEGORY,
			response: {
				201: CategorySchema.response.PUT_CATEGORY,
				400: errorResponse(400),
			},
			...TAGS,
		},
	}, async (request, response) => {
		const {id} = request.params;
		const {name, imageURL} = request.body;
		const categoryUpdated = await fastify.prisma.category.update({
			where: {
				id,
			}, data: {
				name, imageURL,
			},
		});
		return response.send(categoryUpdated);
	});

	fastifyWithZod.delete('/:id', {
		schema: {
			params: CategorySchema.params.DELETE_CATEGORY,
			response: {
				204: CategorySchema.response.DELETE_CATEGORY,
			},
			...TAGS,
		},
	}, async (request, response) => {
		const {id} = request.params;
		try {
			await fastify.prisma.category.delete({where: {id}});
		} catch (error) {
			console.log(error);
			throw fastify.httpErrors.badRequest(`The category with id ${id} is not exist in the database`);
		}

		return response.code(204).send();
	});
};

export default category;
