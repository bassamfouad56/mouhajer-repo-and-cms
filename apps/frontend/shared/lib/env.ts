import { z } from 'zod';

export const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']),
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
  NEXT_EMAIL_PASSWORD: z.string().min(1),
  NEXT_EMAIL_PASSWORD_INQUIRY: z.string().min(1),
  NEXT_PUBLIC_SANITY_PROJECT_ID: z.string().min(1).optional(),
  NEXT_PUBLIC_SANITY_DATASET: z.string().min(1).optional(),
  SANITY_PREVIEW_TOKEN: z.string().optional(),
});

export const env = EnvSchema.parse(process.env);

