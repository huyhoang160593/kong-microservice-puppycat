import {z} from 'zod';
import User from './prisma/User';

export const UserSchema = {
	params: {
		GET_USER: z.object({
			id: z.string().uuid(''),
		}),
		PUT_USER: z.object({
			id: z.string().uuid(''),
		}),
	},
	body: {
		POST_REGISTER: z.object({
			email: z.string().email().describe('email of the user'),
			name: z.string().max(32).describe('name of the user'),
			avatarUrl: z.string().url().describe('avatar of the user').optional(),
			password: z.string().min(8, 'password need at least 8 character').max(32, 'password don\'t need more than 32 character'),
		}),
		POST_LOGIN: z.object({
			email: z.string().email().describe('email of the user'),
			password: z.string().min(8, 'password need at least 8 character').max(32, 'password don\'t need more than 32 character'),
		}),
		PUT_USER: z.object({
			name: User.shape.name,
			avatarUrl: User.shape.avatarUrl,
		}),
	},
	response: {
		GET_USER_SUCCESS: User,
		POST_REGISTER_SUCCESS: User,
		POST_LOGIN_SUCCESS: z.object({
			token: z.string(),
			email: z.string().email().describe('email of the user'),
			name: z.string().nullable(),
		}),
		PUT_USER: User,
	},
} as const;
