import {z} from 'zod';

export const errorResponse = (statusCode: number) => z.object({
	statusCode: z.number().default(statusCode),
	error: z.string().default('error name go here'),
	message: z.string().default('error message go here'),
});
