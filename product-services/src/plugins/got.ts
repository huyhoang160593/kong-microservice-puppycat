import got, {type Got} from 'got';
import fp from 'fastify-plugin';
import {type FastifyPluginAsync} from 'fastify';

declare module 'fastify' {
	interface FastifyInstance {
		got: Got;
	}
}

const gotPlugin: FastifyPluginAsync = fp(async (server, options) => {
	// Make got instance available through the fastify server instance: server.got
	server.decorate('got', got);
});

export default gotPlugin;
