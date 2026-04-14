import express from 'express';
import rateLimit from 'express-rate-limit';
import request from 'supertest';
import { describe, expect, it } from 'vitest';

/**
 * Creates a minimal Express app with trust proxy and a low rate limit
 * to test that proxy-forwarded IPs get independent rate limit buckets.
 */
function createTestApp(limit: number) {
  const app = express();
  app.set('trust proxy', 1);
  app.use(
    rateLimit({
      windowMs: 60 * 60 * 1000,
      limit,
      standardHeaders: 'draft-7',
      legacyHeaders: false,
    }),
  );
  app.get('/test', (_req, res) => res.json({ ok: true }));
  return app;
}

/** Extract the "remaining" value from the draft-7 RateLimit header. */
function getRemaining(res: request.Response): number {
  const header = res.headers['ratelimit'] as string;
  const match = header?.match(/remaining=(\d+)/);
  return match ? parseInt(match[1], 10) : -1;
}

describe('Rate Limiting with Proxy Trust', () => {
  it('should track rate limits independently per forwarded IP', async () => {
    const app = createTestApp(3);

    const res1 = await request(app)
      .get('/test')
      .set('X-Forwarded-For', '1.1.1.1');
    const res2 = await request(app)
      .get('/test')
      .set('X-Forwarded-For', '2.2.2.2');

    expect(res1.status).toBe(200);
    expect(res2.status).toBe(200);

    // Both IPs should have the same remaining count (limit - 1)
    expect(getRemaining(res1)).toBe(2);
    expect(getRemaining(res2)).toBe(2);
  });

  it('should share rate limit for the same forwarded IP', async () => {
    const app = createTestApp(3);

    const res1 = await request(app)
      .get('/test')
      .set('X-Forwarded-For', '3.3.3.3');
    const res2 = await request(app)
      .get('/test')
      .set('X-Forwarded-For', '3.3.3.3');

    expect(res1.status).toBe(200);
    expect(res2.status).toBe(200);

    expect(getRemaining(res1)).toBe(2);
    expect(getRemaining(res2)).toBe(1);
  });

  it('should return 429 when a single IP exceeds the limit', async () => {
    const app = createTestApp(2);

    await request(app).get('/test').set('X-Forwarded-For', '4.4.4.4');
    await request(app).get('/test').set('X-Forwarded-For', '4.4.4.4');
    const res = await request(app)
      .get('/test')
      .set('X-Forwarded-For', '4.4.4.4');

    expect(res.status).toBe(429);
  });

  it('should not block other IPs when one IP is rate limited', async () => {
    const app = createTestApp(2);

    // Exhaust limit for 5.5.5.5
    await request(app).get('/test').set('X-Forwarded-For', '5.5.5.5');
    await request(app).get('/test').set('X-Forwarded-For', '5.5.5.5');
    const blocked = await request(app)
      .get('/test')
      .set('X-Forwarded-For', '5.5.5.5');

    // A different IP should still be allowed
    const allowed = await request(app)
      .get('/test')
      .set('X-Forwarded-For', '6.6.6.6');

    expect(blocked.status).toBe(429);
    expect(allowed.status).toBe(200);
  });
});
