import type { ZodType } from 'zod';

export const withSchema =
  <T, U>(schema: ZodType<T>, formatter: (data: T) => U) =>
  (input: T) => {
    const result = schema.safeParse(input);
    if (result.success) {
      return formatter(result.data);
    }
    throw new Error(result.error.message);
  };
