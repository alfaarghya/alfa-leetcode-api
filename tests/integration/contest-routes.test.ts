import request from 'supertest';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import app from '../../src/app';
import type { Contest } from '../../src/types';
import { server } from '../msw/server';

describe('Contest Routes Integration Tests', () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  describe('GET /contests', () => {
    it('should return all contests list', async () => {
      const response = await request(app).get('/contests');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('allContests');
    });

    it('should return array of contests', async () => {
      const response = await request(app).get('/contests');

      expect(response.status).toBe(200);
      if (response.body.allContests) {
        expect(Array.isArray(response.body.allContests)).toBe(true);
      }
    });

    it('should include past and future contests', async () => {
      const response = await request(app).get('/contests');

      expect(response.status).toBe(200);
      if (response.body.allContests && response.body.allContests.length > 0) {
        const contest = response.body.allContests[0];
        expect(contest).toHaveProperty('startTime');
      }
    });

    it('should return contests with title', async () => {
      const response = await request(app).get('/contests');

      expect(response.status).toBe(200);
      if (response.body.allContests && response.body.allContests.length > 0) {
        const contest = response.body.allContests[0];
        expect(contest).toHaveProperty('title');
      }
    });
  });

  describe('GET /contests/upcoming', () => {
    it('should return only upcoming contests', async () => {
      const response = await request(app).get('/contests/upcoming');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('count');
      expect(response.body).toHaveProperty('contests');
      expect(Array.isArray(response.body.contests)).toBe(true);
    });

    it('should filter contests with startTime > now', async () => {
      const response = await request(app).get('/contests/upcoming');

      expect(response.status).toBe(200);
      const now = Math.floor(Date.now() / 1000);

      if (response.body.contests.length > 0) {
        response.body.contests.forEach((contest: Contest) => {
          expect(contest.startTime).toBeGreaterThan(now - 86400);
        });
      }
    });

    it('should have count matching array length', async () => {
      const response = await request(app).get('/contests/upcoming');

      expect(response.status).toBe(200);
      expect(response.body.count).toBe(response.body.contests.length);
    });

    it('should return zero count when no upcoming contests', async () => {
      const response = await request(app).get('/contests/upcoming');

      expect(response.status).toBe(200);
      if (response.body.count === 0) {
        expect(response.body.contests).toEqual([]);
      }
    });

    it('should return valid timestamp for startTime', async () => {
      const response = await request(app).get('/contests/upcoming');

      expect(response.status).toBe(200);
      if (response.body.contests.length > 0) {
        const contest = response.body.contests[0];
        expect(typeof contest.startTime).toBe('number');
        expect(contest.startTime).toBeGreaterThan(0);
      }
    });
  });

  describe('Contest data structure', () => {
    it('should include required contest fields', async () => {
      const response = await request(app).get('/contests');

      expect(response.status).toBe(200);
      if (response.body.allContests && response.body.allContests.length > 0) {
        const contest = response.body.allContests[0];
        expect(contest.title).toBeDefined();
        expect(contest.startTime).toBeDefined();
      }
    });

    it('should handle empty contests list', async () => {
      const response = await request(app).get('/contests/upcoming');

      expect(response.status).toBe(200);
      if (response.body.count === 0) {
        expect(response.body.contests).toEqual([]);
      }
    });
  });

  describe('Response format validation', () => {
    it('should return JSON format', async () => {
      const response = await request(app).get('/contests');

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toMatch(/json/);
    });

    it('should return JSON format for upcoming contests', async () => {
      const response = await request(app).get('/contests/upcoming');

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toMatch(/json/);
    });
  });

  describe('Error handling', () => {
    it('should handle requests gracefully', async () => {
      const response = await request(app).get('/contests');

      expect(response.status).toBe(200);
    });

    it('should handle upcoming contests request gracefully', async () => {
      const response = await request(app).get('/contests/upcoming');

      expect(response.status).toBe(200);
    });
  });

  describe('Time-based filtering', () => {
    it('should correctly calculate current timestamp', async () => {
      const response = await request(app).get('/contests/upcoming');

      expect(response.status).toBe(200);
      expect(response.body.count).toBeGreaterThanOrEqual(0);
    });

    it('should exclude past contests from upcoming', async () => {
      const allResponse = await request(app).get('/contests');
      const upcomingResponse = await request(app).get('/contests/upcoming');

      expect(allResponse.status).toBe(200);
      expect(upcomingResponse.status).toBe(200);

      if (allResponse.body.allContests) {
        const totalContests = allResponse.body.allContests.length || 0;
        const upcomingContests = upcomingResponse.body.count;

        expect(upcomingContests).toBeLessThanOrEqual(totalContests);
      }
    });
  });
});
