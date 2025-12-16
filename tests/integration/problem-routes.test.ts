import request from 'supertest';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import app from '../../src/app';
import { server } from '../msw/server';

describe('Problem Routes Integration Tests', () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  describe('GET /daily', () => {
    it('should return daily problem', async () => {
      const response = await request(app).get('/daily');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('questionLink');
      expect(response.body).toHaveProperty('date');
      expect(response.body).toHaveProperty('questionId');
      expect(response.body).toHaveProperty('questionTitle');
      expect(response.body).toHaveProperty('titleSlug');
      expect(response.body).toHaveProperty('difficulty');
    });

    it('should include problem details', async () => {
      const response = await request(app).get('/daily');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('question');
      expect(response.body).toHaveProperty('topicTags');
      expect(response.body).toHaveProperty('hints');
    });

    it('should have valid questionLink format', async () => {
      const response = await request(app).get('/daily');

      expect(response.status).toBe(200);
      if (response.body.questionLink) {
        expect(response.body.questionLink).toContain('https://leetcode.com');
      }
    });
  });

  describe('GET /daily/raw', () => {
    it('should return daily problem in raw format', async () => {
      const response = await request(app).get('/daily/raw');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        'activeDailyCodingChallengeQuestion',
      );
    });

    it('should not format the data', async () => {
      const response = await request(app).get('/daily/raw');

      expect(response.status).toBe(200);
      expect(response.body).not.toHaveProperty('questionLink');
    });
  });

  describe('GET /select', () => {
    it('should return selected problem by titleSlug', async () => {
      const response = await request(app).get('/select?titleSlug=two-sum');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('link');
      expect(response.body).toHaveProperty('questionId');
      expect(response.body).toHaveProperty('questionTitle');
      expect(response.body).toHaveProperty('titleSlug');
      expect(response.body).toHaveProperty('difficulty');
    });

    it('should include problem content', async () => {
      const response = await request(app).get('/select?titleSlug=two-sum');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('question');
      expect(response.body).toHaveProperty('exampleTestcases');
      expect(response.body).toHaveProperty('topicTags');
    });

    it('should handle problem with special characters in slug', async () => {
      const response = await request(app).get(
        '/select?titleSlug=longest-substring-without-repeating-characters',
      );

      expect(response.status).toBe(200);
    });

    it('should require titleSlug parameter', async () => {
      const response = await request(app).get('/select');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should handle non-existent problem', async () => {
      const response = await request(app).get(
        '/select?titleSlug=non-existent-problem-12345',
      );

      expect(response.status).toBe(200);
    });
  });

  describe('GET /select/raw', () => {
    it('should return selected problem in raw format', async () => {
      const response = await request(app).get('/select/raw?titleSlug=two-sum');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('question');
    });

    it('should not format the data', async () => {
      const response = await request(app).get('/select/raw?titleSlug=two-sum');

      expect(response.status).toBe(200);
      expect(response.body).not.toHaveProperty('link');
    });
  });

  describe('GET /officialSolution', () => {
    it('should return official solution for problem', async () => {
      const response = await request(app).get(
        '/officialSolution?titleSlug=two-sum',
      );

      expect(response.status).toBe(200);
    });

    it('should require titleSlug parameter', async () => {
      const response = await request(app).get('/officialSolution');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should handle problem without official solution', async () => {
      const response = await request(app).get(
        '/officialSolution?titleSlug=no-solution-problem',
      );

      expect(response.status).toBe(200);
    });
  });

  describe('GET /problems', () => {
    it('should return list of 20 problems by default', async () => {
      const response = await request(app).get('/problems');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('totalQuestions');
      expect(response.body).toHaveProperty('count');
      expect(response.body).toHaveProperty('problemsetQuestionList');
      expect(Array.isArray(response.body.problemsetQuestionList)).toBe(true);
      expect(response.body.count).toBeLessThanOrEqual(20);
    });

    it('should respect limit parameter', async () => {
      const response = await request(app).get('/problems?limit=5');

      expect(response.status).toBe(200);
      expect(response.body.count).toBeLessThanOrEqual(5);
    });

    it('should respect skip parameter', async () => {
      const response = await request(app).get('/problems?skip=10');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('problemsetQuestionList');
    });

    it('should filter by tags', async () => {
      const response = await request(app).get('/problems?tags=array');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('problemsetQuestionList');
    });

    it('should filter by multiple tags', async () => {
      const response = await request(app).get('/problems?tags=array+math');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('problemsetQuestionList');
    });

    it('should filter by difficulty EASY', async () => {
      const response = await request(app).get('/problems?difficulty=EASY');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('problemsetQuestionList');
    });

    it('should filter by difficulty MEDIUM', async () => {
      const response = await request(app).get('/problems?difficulty=MEDIUM');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('problemsetQuestionList');
    });

    it('should filter by difficulty HARD', async () => {
      const response = await request(app).get('/problems?difficulty=HARD');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('problemsetQuestionList');
    });

    it('should combine multiple filters', async () => {
      const response = await request(app).get(
        '/problems?tags=array+math&limit=10&difficulty=EASY',
      );

      expect(response.status).toBe(200);
      expect(response.body.count).toBeLessThanOrEqual(10);
    });

    it('should combine skip and limit', async () => {
      const response = await request(app).get('/problems?skip=5&limit=10');

      expect(response.status).toBe(200);
      expect(response.body.count).toBeLessThanOrEqual(10);
    });

    it('should handle skip without limit', async () => {
      const response = await request(app).get('/problems?skip=100');

      expect(response.status).toBe(200);
      expect(response.body.count).toBe(1);
    });

    it('should handle large skip values', async () => {
      const response = await request(app).get('/problems?skip=1000');

      expect(response.status).toBe(200);
    });

    it('should handle large limit values', async () => {
      const response = await request(app).get('/problems?limit=100');

      expect(response.status).toBe(200);
    });

    it('should handle empty tags', async () => {
      const response = await request(app).get('/problems?tags=');

      expect(response.status).toBe(200);
    });

    it('should validate totalQuestions is a number', async () => {
      const response = await request(app).get('/problems');

      expect(response.status).toBe(200);
      expect(typeof response.body.totalQuestions).toBe('number');
    });

    it('should validate count matches array length', async () => {
      const response = await request(app).get('/problems?limit=5');

      expect(response.status).toBe(200);
      expect(response.body.count).toBe(
        response.body.problemsetQuestionList.length,
      );
    });
  });

  describe('Problem data structure validation', () => {
    it('should return problems with required fields', async () => {
      const response = await request(app).get('/problems?limit=1');

      expect(response.status).toBe(200);
      if (response.body.problemsetQuestionList.length > 0) {
        const problem = response.body.problemsetQuestionList[0];
        expect(problem).toBeDefined();
      }
    });

    it('should include difficulty in problem list', async () => {
      const response = await request(app).get('/select?titleSlug=two-sum');

      expect(response.status).toBe(200);
      expect(['Easy', 'Medium', 'Hard']).toContain(response.body.difficulty);
    });
  });

  describe('Query parameter handling', () => {
    it('should handle URL encoded parameters', async () => {
      const response = await request(app).get('/problems?tags=array%20math');

      expect(response.status).toBe(200);
    });

    it('should handle numeric string parameters', async () => {
      const response = await request(app).get('/problems?limit=5&skip=10');

      expect(response.status).toBe(200);
    });
  });

  describe('Edge cases', () => {
    it('should handle zero limit', async () => {
      const response = await request(app).get('/problems?limit=0');

      expect(response.status).toBe(200);
    });

    it('should handle zero skip', async () => {
      const response = await request(app).get('/problems?skip=0');

      expect(response.status).toBe(200);
    });

    it('should handle invalid difficulty value', async () => {
      const response = await request(app).get('/problems?difficulty=INVALID');

      expect(response.status).toBe(200);
    });
  });
});
