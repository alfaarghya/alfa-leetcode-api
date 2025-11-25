import { ZodType } from 'zod';

export const withSchema =
  <T, U>(schema: ZodType<T>, formatter: (data: T) => U) =>
  (input: T) =>
    formatter(schema.parse(input));
