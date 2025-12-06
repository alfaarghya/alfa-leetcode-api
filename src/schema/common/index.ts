import z from 'zod';

export const badge = z.object({
  name: z.string(),
  icon: z.string().optional(),
});
