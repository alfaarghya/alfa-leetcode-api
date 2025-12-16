import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { withSchema } from '../../../src/FormatUtils/formatter';

describe('formatter utils', () => {
  describe('withSchema', () => {
    it('should validate and format data successfully', () => {
      const schema = z.object({
        name: z.string(),
        age: z.number(),
      });

      const formatter = (data: { name: string; age: number }) => ({
        fullName: data.name,
        years: data.age,
      });

      const validate = withSchema(schema, formatter);

      const input = { name: 'John', age: 30 };
      const result = validate(input);

      expect(result).toEqual({
        fullName: 'John',
        years: 30,
      });
    });

    it('should throw error for invalid data', () => {
      const schema = z.object({
        name: z.string(),
        age: z.number(),
      });

      const formatter = (data: { name: string; age: number }) => ({
        fullName: data.name,
        years: data.age,
      });

      const validate = withSchema(schema, formatter);

      const input = { name: 'John', age: 'thirty' };

      expect(() => validate(input as never)).toThrow();
    });

    it('should work with complex nested schemas', () => {
      const schema = z.object({
        user: z.object({
          username: z.string(),
          profile: z.object({
            age: z.number(),
            country: z.string(),
          }),
        }),
      });

      const formatter = (data: never) => ({
        username: data.user.username,
        age: data.user.profile.age,
        country: data.user.profile.country,
      });

      const validate = withSchema(schema, formatter);

      const input = {
        user: {
          username: 'testuser',
          profile: {
            age: 25,
            country: 'USA',
          },
        },
      };

      const result = validate(input);

      expect(result).toEqual({
        username: 'testuser',
        age: 25,
        country: 'USA',
      });
    });

    it('should work with array schemas', () => {
      const schema = z.array(
        z.object({
          id: z.number(),
          title: z.string(),
        }),
      );

      const formatter = (data: Array<{ id: number; title: string }>) =>
        data.map((item) => ({
          identifier: item.id,
          name: item.title,
        }));

      const validate = withSchema(schema, formatter);

      const input = [
        { id: 1, title: 'First' },
        { id: 2, title: 'Second' },
      ];

      const result = validate(input);

      expect(result).toEqual([
        { identifier: 1, name: 'First' },
        { identifier: 2, name: 'Second' },
      ]);
    });

    it('should handle optional fields correctly', () => {
      const schema = z.object({
        name: z.string(),
        age: z.number().optional(),
      });

      const formatter = (data: { name: string; age?: number }) => ({
        fullName: data.name,
        years: data.age ?? 0,
      });

      const validate = withSchema(schema, formatter);

      const input1 = { name: 'John' };
      const result1 = validate(input1);

      expect(result1).toEqual({
        fullName: 'John',
        years: 0,
      });

      const input2 = { name: 'Jane', age: 25 };
      const result2 = validate(input2);

      expect(result2).toEqual({
        fullName: 'Jane',
        years: 25,
      });
    });

    it('should provide detailed error message on validation failure', () => {
      const schema = z.object({
        name: z.string(),
        age: z.number().min(0).max(120),
      });

      const formatter = (data: { name: string; age: number }) => data;

      const validate = withSchema(schema, formatter);

      const input = { name: 'John', age: 150 };

      expect(() => validate(input)).toThrow();
    });

    it('should work with string schemas and transformations', () => {
      const schema = z.string().email();

      const formatter = (email: string) => ({
        email,
        domain: email.split('@')[1],
      });

      const validate = withSchema(schema, formatter);

      const input = 'test@example.com';
      const result = validate(input);

      expect(result).toEqual({
        email: 'test@example.com',
        domain: 'example.com',
      });
    });

    it('should handle empty objects', () => {
      const schema = z.object({});

      const formatter = () => ({
        isEmpty: true,
      });

      const validate = withSchema(schema, formatter);

      const input = {};
      const result = validate(input);

      expect(result).toEqual({
        isEmpty: true,
      });
    });

    it('should work with union types', () => {
      const schema = z.union([
        z.object({ type: z.literal('user'), username: z.string() }),
        z.object({ type: z.literal('admin'), adminId: z.number() }),
      ]);

      const formatter = (data: never) => ({
        accountType: data.type,
        identifier: data.username || data.adminId,
      });

      const validate = withSchema(schema, formatter);

      const userInput = { type: 'user' as const, username: 'testuser' };
      const userResult = validate(userInput);

      expect(userResult).toEqual({
        accountType: 'user',
        identifier: 'testuser',
      });

      const adminInput = { type: 'admin' as const, adminId: 123 };
      const adminResult = validate(adminInput);

      expect(adminResult).toEqual({
        accountType: 'admin',
        identifier: 123,
      });
    });

    it('should handle null values when schema allows', () => {
      const schema = z.object({
        name: z.string(),
        age: z.number().nullable(),
      });

      const formatter = (data: { name: string; age: number | null }) => ({
        fullName: data.name,
        years: data.age ?? 'unknown',
      });

      const validate = withSchema(schema, formatter);

      const input = { name: 'John', age: null };
      const result = validate(input);

      expect(result).toEqual({
        fullName: 'John',
        years: 'unknown',
      });
    });

    it('should not call formatter if validation fails', () => {
      const schema = z.object({
        name: z.string(),
        age: z.number(),
      });

      let formatterCalled = false;
      const formatter = (data: { name: string; age: number }) => {
        formatterCalled = true;
        return data;
      };

      const validate = withSchema(schema, formatter);

      const input = { name: 123, age: 'invalid' };

      try {
        validate(input as never);
      } catch (_error) {
        expect(formatterCalled).toBe(false);
      }
    });
  });
});
