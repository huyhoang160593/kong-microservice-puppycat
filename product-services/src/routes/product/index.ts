import type {FastifyPluginAsync} from 'fastify';
import {type ZodTypeProvider} from 'fastify-type-provider-zod';

const product: FastifyPluginAsync = async (fastify, _opts): Promise<void> => {
	fastify.withTypeProvider<ZodTypeProvider>().route({
		method: 'GET',
		url: '/',
		async handler(req, res) {
			void res.send('this is a test router, nothing is in here for you to check');
		},
	});
};

export default product;
