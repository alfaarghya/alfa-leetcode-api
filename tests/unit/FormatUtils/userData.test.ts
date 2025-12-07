import request from 'supertest';
import { describe, it, expect } from 'vitest';
import app from '../../../src/app';

describe('User Data Tests', () => {
  it('should fetch a single user', async () => {
    const response = await request(app).get('/jambobjones');
    expect(response.body.username).toBe('jambobjones');
    [
      'username',
      'name',
      'birthday',
      'avatar',
      'ranking',
      'reputation',
      'gitHub',
      'twitter',
      'linkedIN',
      'website',
      'country',
      'company',
      'school',
      'skillTags',
      'about',
    ].forEach((key) => {
      expect(response.body).toHaveProperty(key);
    });
  });

  it('should fetch user badges', async () => {
    const response = await request(app).get('/jambobjones/badges');

    ['badgesCount', 'badges', 'upcomingBadges', 'activeBadge'].forEach(
      (key) => {
        expect(response.body).toHaveProperty(key);
      }
    );
  });

  it('Should fetch users solved problems', async () => {
    const response = await request(app).get('/jambobjones/solved');
    [
      'solvedProblem',
      'easySolved',
      'mediumSolved',
      'hardSolved',
      'totalSubmissionNum',
      'acSubmissionNum',
    ].forEach((key) => {
      expect(response.body).toHaveProperty(key);
    });
  });

  it('Should fetch users contests', async () => {
    const response = await request(app).get('/jambobjones/contest');
    ['contestParticipation'].forEach((key) => {
      expect(response.body).toHaveProperty(key);
    });
  });

  it('Should fetch user contest history', async () => {
    const response = await request(app).get('/jambobjones/contest/history');
    ['count', 'contestHistory'].forEach((key) => {
      expect(response.body).toHaveProperty(key);
    });
  });

  it('Should fetch users recent submissions returning 20 by default', async () => {
    const response = await request(app).get('/jambobjones/submission');
    ['count', 'submission'].forEach((key) => {
      expect(response.body).toHaveProperty(key);
    });

    expect(response.body.count).toBeLessThanOrEqual(20);
  });
  // Todo: Submission test with Limit Parameter

  it('Should fetch AC Submissions', async () => {
    const response = await request(app).get('/jambobjones/acSubmission');

    ['count', 'submission'].forEach((key) => {
      expect(response.body).toHaveProperty(key);
    });
    expect(response.body.count).toBeLessThanOrEqual(20);
  });

  it('Should fetch Users Submission Calendar', async () => {
    const response = await request(app).get('/jambobjones/calendar');
    expect(response.body).toHaveProperty('submissionCalendar');
    expect(typeof response.body.submissionCalendar).toBe('string');
  });
});
