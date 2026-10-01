import type { Express } from 'express';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { server } from '../msw/server';

let app: Express;

describe('Solved Questions Route Integration Tests', () => {
  beforeAll(async () => {
    // config reads these at import time, so they must be set before app loads
    process.env.LEETCODE_SESSION = 'test-session-token';
    process.env.LEETCODE_CSRF_TOKEN = 'test-csrf-token';
    server.listen();
    app = (await import('../../src/app')).default;
  });

  afterAll(() => {
    server.close();
    process.env.LEETCODE_SESSION = '';
    process.env.LEETCODE_CSRF_TOKEN = '';
  });

  describe('GET /me/solvedQuestions', () => {
    it('should return the solved questions envelope', async () => {
      const response = await request(app).get('/me/solvedQuestions');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('count');
      expect(response.body).toHaveProperty('totalSolved');
      expect(response.body).toHaveProperty('solvedQuestions');
      expect(Array.isArray(response.body.solvedQuestions)).toBe(true);
    });

    it('should return every solved question from the upstream page', async () => {
      const response = await request(app).get('/me/solvedQuestions');

      expect(response.status).toBe(200);
      expect(response.body.count).toBe(3);
      expect(response.body.totalSolved).toBe(3);
      expect(response.body.solvedQuestions).toHaveLength(3);
    });

    it('should expose the details of each solved question', async () => {
      const response = await request(app).get('/me/solvedQuestions');

      expect(response.status).toBe(200);
      const [first] = response.body.solvedQuestions;
      expect(first).toHaveProperty('questionFrontendId');
      expect(first).toHaveProperty('title');
      expect(first).toHaveProperty('titleSlug');
      expect(first).toHaveProperty('difficulty');
      expect(first).toHaveProperty('lastSubmittedAt');
      expect(first).toHaveProperty('numSubmitted');
      expect(first).toHaveProperty('topicTags');
      expect(first.link).toBe('https://leetcode.com/problems/two-sum');
    });

    it('should cover every difficulty returned by LeetCode', async () => {
      const response = await request(app).get('/me/solvedQuestions');

      expect(response.status).toBe(200);
      expect(
        response.body.solvedQuestions.map(
          (q: { difficulty: string }) => q.difficulty,
        ),
      ).toEqual(['Easy', 'Medium', 'Hard']);
    });

    it('should not be swallowed by the /:username wildcard route', async () => {
      const response = await request(app).get('/me/solvedQuestions');

      expect(response.status).toBe(200);
      // formatUserData would have produced these instead
      expect(response.body).not.toHaveProperty('username');
      expect(response.body).not.toHaveProperty('about');
    });

    it('should never echo the session token back to the caller', async () => {
      const response = await request(app).get('/me/solvedQuestions');

      expect(JSON.stringify(response.body)).not.toContain('test-session-token');
    });
  });

  describe('GET / overview', () => {
    it('should advertise the solved questions route', async () => {
      const response = await request(app).get('/');

      expect(response.status).toBe(200);
      expect(response.body.routes).toHaveProperty('ownAccount');
      expect(response.body.routes.ownAccount).toHaveProperty(
        '/me/solvedQuestions',
      );
    });
  });
});
