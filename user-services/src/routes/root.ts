import type {FastifyPluginAsync} from 'fastify';
import {UserSchema} from '../schemas/root';
import {ErrorResponse as errorResponse} from '../schemas/base/TypeErrorResponse';
import {type ZodTypeProvider} from 'fastify-type-provider-zod';

const root: FastifyPluginAsync = async (fastify, _opts): Promise<void> => {
	fastify.get('/', async (_request, _reply) => ({status: true}));
	fastify.get('/health/check', async (_request, _reply) => ({status: 'online'}));

	fastify.withTypeProvider<ZodTypeProvider>().get('/:id', {
		schema: {
			params: UserSchema.params.GET_USER,
			response: {
				200: UserSchema.response.GET_USER_SUCCESS,
				400: errorResponse(400),
			},
		},
	}, async (request, response) => {
		const {id} = request.params;

		const foundUser = await fastify.prisma.user.findFirst({where: {
			id,
		}});
		if (!foundUser) {
			throw fastify.httpErrors.badRequest(`We can find the user with the id ${id} in the database`);
		}

		return response.send(foundUser);
	});

	fastify.withTypeProvider<ZodTypeProvider>().post('/register', {
		schema: {
			body: UserSchema.body.POST_REGISTER,
			response: {
				201: UserSchema.response.POST_REGISTER_SUCCESS,
				400: errorResponse(400),
			},
		},
	}, async (request, response) => {
		const {email, name, password} = request.body;

		const passwordHash = await fastify.bcrypt.hash(password);

		const userCreated = await fastify.prisma.user.create({
			data: {
				email,
				passwordHash,
				name,
			},
		});
		return response.code(201).send(userCreated);
	});

	fastify.withTypeProvider<ZodTypeProvider>().post('/login', {
		schema: {
			body: UserSchema.body.POST_LOGIN,
			response: {
				200: UserSchema.response.POST_LOGIN_SUCCESS,
				400: errorResponse(400),
				401: errorResponse(401),
			},
		},
	}, async (request, response) => {
		const {email, password} = request.body;

		const userFound = await fastify.prisma.user.findFirst({where: {email}});
		const isPasswordCorrect = userFound ? await fastify.bcrypt.compare(password, userFound.passwordHash) : false;
		const isAuthSuccess = userFound && isPasswordCorrect;

		if (!isAuthSuccess) {
			throw fastify.httpErrors.unauthorized('invalid username or password');
		}

		const userForToken = {
			email: userFound.email,
			id: userFound.id,
		};

		const token = fastify.jwt.sign(userForToken);

		return response.send({
			token, email, name: userFound.name,
		});
	});
};

export default root;
