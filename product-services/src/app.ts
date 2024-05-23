import type {AutoloadPluginOptions} from '@fastify/autoload';
import AutoLoad from '@fastify/autoload';
import type {FastifyPluginAsync} from 'fastify';
import {jsonSchemaTransform, serializerCompiler, validatorCompiler} from 'fastify-type-provider-zod';
import {join} from 'path';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUI from '@fastify/swagger-ui';

export type AppOptions = {
	// Place your custom options for app below here.
} & Partial<AutoloadPluginOptions>;

const app: FastifyPluginAsync<AppOptions> = async (
	fastify,
	opts,
): Promise<void> => {
	// Place here your custom code!
	fastify.setValidatorCompiler(validatorCompiler);
	fastify.setSerializerCompiler(serializerCompiler);

	void fastify.register(fastifySwagger, {
		openapi: {
			info: {
				title: 'ProductApi',
				description: 'The microserver for product',
				version: '0.0.1',
			},
			servers: [{
				url: 'http://localhost:8000/productServices',
				description: 'Kong Gateway Server',
			}],
		},
		transform: jsonSchemaTransform,
	});

	void fastify.register(fastifySwaggerUI, {
		routePrefix: '/documentation',
		// You can also create transform with custom skiplist of endpoints that should not be included in the specification:
		//
		// transform: createJsonSchemaTransform({
		//   skipList: [ '/documentation/static/*' ]
		// })
	});

	// Do not touch the following lines

	// This loads all plugins defined in plugins
	// those should be support plugins that are reused
	// through your application
	void fastify.register(AutoLoad, {
		dir: join(__dirname, 'plugins'),
		options: opts,
	});

	// This loads all plugins defined in routes
	// define your routes in one of these
	void fastify.register(AutoLoad, {
		dir: join(__dirname, 'routes'),
		options: opts,
	});
};

export default app;
