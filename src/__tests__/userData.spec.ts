import request from 'supertest';
import app from '../app';
import assert from 'assert';

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
      assert(key in response.body);
    });
  });

  it('should fetch user badges', async () => {
    const response = await request(app).get('/jambobjones/badges');

    ['badgesCount', 'badges', 'upcomingBadges', 'activeBadge'].forEach(
      (key) => {
        assert(key in response.body);
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
      assert(key in response.body);
    });
  });

  it('Should fetch users contests', async () => {
    const response = await request(app).get('/jambobjones/contest');
    ['contestParticipation'].forEach((key) => {
      assert(key in response.body);
    });
  });

  it('Should fetch user contest history', async () => {
    const response = await request(app).get('/jambobjones/contest/history');
    ['count', 'contestHistory'].forEach((key) => {
      assert(key in response.body);
    });
  });

  it('Should fetch users recent submissions returning 20 by default', async () => {
    const response = await request(app).get('/jambobjones/submission');
    ['count', 'submission'].forEach((key) => {
      assert(key in response.body);
    });

    expect(response.body.count).toBeLessThanOrEqual(20);
  });
  // Todo: Submission test with Limit Parameter

  it('Should fetch AC Submissions', async () => {
    const response = await request(app).get('/jambobjones/acSubmission');

    ['count', 'submission'].forEach((key) => {
      assert(key in response.body);
    });
    expect(response.body.count).toBeLessThanOrEqual(20);
  });

  it('Should fetch Users Submission Calendar', async () => {
    const response = await request(app).get('/jambobjones/calendar');
    assert('submissionCalendar' in response.body);
    expect(typeof response.body.submissionCalendar).toBe('string');
  });
});
