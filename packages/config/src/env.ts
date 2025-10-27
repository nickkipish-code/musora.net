import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.string().default('development'),
  DATABASE_URL: z.string(),
  API_JWT_SECRET: z.string(),
});

export const env = envSchema.parse(process.env);


