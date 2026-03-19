import request from 'supertest';
import { describe, expect, it } from 'vitest';
import app from '../../src/app';

describe('Documentation Routes Integration Tests', () => {
  describe('GET /openapi.json', () => {
    it('should return OpenAPI JSON document', async () => {
      const response = await request(app).get('/openapi.json');

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body).toHaveProperty('openapi');
      expect(response.body).toHaveProperty('info');
      expect(response.body).toHaveProperty('paths');
      expect(response.body).toHaveProperty('components');
      expect(response.body.servers[0].url).toBe(
        'https://alfa-leetcode-api.onrender.com/',
      );
    });
  });

  describe('GET /docs', () => {
    it('should return Swagger UI html page', async () => {
      const response = await request(app).get('/docs');

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toMatch(/html/);
      expect(response.text).toContain('SwaggerUIBundle');
      expect(response.text).toContain('/openapi.json');
    });

    it('should support trailing slash', async () => {
      const response = await request(app).get('/docs/');

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toMatch(/html/);
    });
  });
});
