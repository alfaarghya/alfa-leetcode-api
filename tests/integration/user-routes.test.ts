import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import request from 'supertest';
import app from '../../src/app';
import { server } from '../msw/server';

describe('User Routes Integration Tests', () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  describe('GET /:username', () => {
    it('should return user profile details', async () => {
      const response = await request(app).get('/testuser');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('username');
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('ranking');
      expect(response.body).toHaveProperty('reputation');
      expect(response.body).toHaveProperty('avatar');
    });

    it('should handle non-existent user', async () => {
      const response = await request(app).get('/nonexistentuser123456');

      expect(response.status).toBe(200);
    });

    it('should handle special characters in username', async () => {
      const response = await request(app).get('/test-user_123');

      expect(response.status).toBe(200);
    });
  });

  describe('GET /:username/badges', () => {
    it('should return user badges', async () => {
      const response = await request(app).get('/testuser/badges');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('badgesCount');
      expect(response.body).toHaveProperty('badges');
      expect(response.body).toHaveProperty('upcomingBadges');
      expect(response.body).toHaveProperty('activeBadge');
      expect(Array.isArray(response.body.badges)).toBe(true);
    });

    it('should handle user with no badges', async () => {
      const response = await request(app).get('/newuser/badges');

      expect(response.status).toBe(200);
    });
  });

  describe('GET /:username/solved', () => {
    it('should return solved problems count', async () => {
      const response = await request(app).get('/testuser/solved');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('solvedProblem');
      expect(response.body).toHaveProperty('easySolved');
      expect(response.body).toHaveProperty('mediumSolved');
      expect(response.body).toHaveProperty('hardSolved');
      expect(response.body).toHaveProperty('totalSubmissionNum');
      expect(response.body).toHaveProperty('acSubmissionNum');
      expect(typeof response.body.solvedProblem).toBe('number');
    });

    it('should return valid numbers for solved counts', async () => {
      const response = await request(app).get('/testuser/solved');

      expect(response.status).toBe(200);
      expect(response.body.solvedProblem).toBeGreaterThanOrEqual(0);
      expect(response.body.easySolved).toBeGreaterThanOrEqual(0);
    });
  });

  describe('GET /:username/contest', () => {
    it('should return contest details', async () => {
      const response = await request(app).get('/testuser/contest');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('contestParticipation');
      expect(Array.isArray(response.body.contestParticipation)).toBe(true);
    });

    it('should filter only attended contests', async () => {
      const response = await request(app).get('/testuser/contest');

      expect(response.status).toBe(200);
      if (response.body.contestParticipation.length > 0) {
        expect(
          response.body.contestParticipation.every(
            (c: any) => c.attended === true,
          ),
        ).toBe(true);
      }
    });
  });

  describe('GET /:username/contest/history', () => {
    it('should return contest history', async () => {
      const response = await request(app).get('/testuser/contest/history');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('count');
      expect(response.body).toHaveProperty('contestHistory');
      expect(Array.isArray(response.body.contestHistory)).toBe(true);
      expect(typeof response.body.count).toBe('number');
    });

    it('should have count matching array length', async () => {
      const response = await request(app).get('/testuser/contest/history');

      expect(response.status).toBe(200);
      expect(response.body.count).toBe(response.body.contestHistory.length);
    });
  });

  describe('GET /:username/submission', () => {
    it('should return last 20 submissions by default', async () => {
      const response = await request(app).get('/testuser/submission');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('count');
      expect(response.body).toHaveProperty('submission');
      expect(Array.isArray(response.body.submission)).toBe(true);
      expect(response.body.count).toBeLessThanOrEqual(20);
    });

    it('should handle limit parameter as string', async () => {
      const response = await request(app).get('/testuser/submission?limit=10');

      expect(response.status).toBe(200);
      expect(typeof response.body.count).toBe('number');
    });
  });

  describe('GET /:username/acSubmission', () => {
    it('should return last 20 accepted submissions by default', async () => {
      const response = await request(app).get('/testuser/acSubmission');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('count');
      expect(response.body).toHaveProperty('submission');
      expect(Array.isArray(response.body.submission)).toBe(true);
      expect(response.body.count).toBeLessThanOrEqual(20);
    });
  });

  describe('GET /:username/calendar', () => {
    it('should return submission calendar', async () => {
      const response = await request(app).get('/testuser/calendar');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('submissionCalendar');
    });

    it('should return calendar for specific year', async () => {
      const response = await request(app).get('/testuser/calendar?year=2024');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('submissionCalendar');
    });

    it('should handle year as number parameter', async () => {
      const response = await request(app).get('/testuser/calendar?year=2023');

      expect(response.status).toBe(200);
    });

    it('should default year to 0 when not provided', async () => {
      const response = await request(app).get('/testuser/calendar');

      expect(response.status).toBe(200);
    });
  });

  describe('GET /:username/skill', () => {
    it('should return skill stats', async () => {
      const response = await request(app).get('/testuser/skill');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('fundamental');
      expect(response.body).toHaveProperty('intermediate');
      expect(response.body).toHaveProperty('advanced');
    });

    it('should return arrays for each skill level', async () => {
      const response = await request(app).get('/testuser/skill');

      expect(response.status).toBe(200);
      if (response.body.fundamental) {
        expect(Array.isArray(response.body.fundamental)).toBe(true);
      }
    });
  });

  describe('GET /:username/profile', () => {
    it('should return full user profile', async () => {
      const response = await request(app).get('/testuser/profile');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('totalSolved');
      expect(response.body).toHaveProperty('totalQuestions');
      expect(response.body).toHaveProperty('ranking');
    });

    it('should include submission calendar in profile', async () => {
      const response = await request(app).get('/testuser/profile');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('submissionCalendar');
    });
  });

  describe('GET /:username/language', () => {
    it('should return language stats', async () => {
      const response = await request(app).get('/testuser/language');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('languageProblemCount');
    });

    it('should return array of languages', async () => {
      const response = await request(app).get('/testuser/language');

      expect(response.status).toBe(200);
      if (response.body.languageProblemCount) {
        expect(Array.isArray(response.body.languageProblemCount)).toBe(true);
      }
    });
  });

  describe('GET /:username/progress', () => {
    it('should return progress stats', async () => {
      const response = await request(app).get('/testuser/progress');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('numAcceptedQuestions');
    });

    it('should return array of progress data', async () => {
      const response = await request(app).get('/testuser/progress');

      expect(response.status).toBe(200);
      if (response.body.numAcceptedQuestions) {
        expect(Array.isArray(response.body.numAcceptedQuestions)).toBe(true);
      }
    });
  });

  describe('Error handling', () => {
    it('should handle malformed requests gracefully', async () => {
      const response = await request(app).get('/user%20name/profile');

      expect(response.status).toBe(200);
    });

    it('should handle very long usernames', async () => {
      const longUsername = 'a'.repeat(100);
      const response = await request(app).get(`/${longUsername}`);

      expect(response.status).toBe(200);
    });
  });
});
