import closeWithGrace from 'close-with-grace';
import * as dotenv from 'dotenv';
import fastifyApp from './app';

import Fastify from 'fastify';

void dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

const app = Fastify({
	logger: !isProduction,
});

void app.register(fastifyApp);

// Delay is the number of milliseconds for the graceful close to finish
const closeListeners = closeWithGrace({delay: 500}, async (opts: any) => {
	if (opts.err) {
		app.log.error(opts.err);
	}

	await app.close();
});

app.addHook('onClose', async (_instance, done) => {
	closeListeners.uninstall();
	done();
});

// Start listening.
void app.listen({
	port: Number(process.env.PORT ?? 3000),
	host: process.env.SERVER_HOSTNAME ?? '127.0.0.1',
}).then(address => {
	app.log.info(`Documentation running at ${address + '/documentation'}`);
});

app.ready((err: Error) => {
	if (err) {
		app.log.error(err);
		process.exit(1);
	}

	app.log.info(`Server listening on port ${Number(process.env.PORT ?? 3000)}`);
});
