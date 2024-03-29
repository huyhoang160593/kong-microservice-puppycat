import {z} from 'zod';

const User = z.object({
	id: z.string().uuid(),
	email: z.string().email(),
	name: z.string().nullable(),
	avatarUrl: z.string().url().nullable(),
	passwordHash: z.string(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export default User;
