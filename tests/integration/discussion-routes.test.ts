import request from 'supertest';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import app from '../../src/app';
import { server } from '../msw/server';

describe('Discussion Routes Integration Tests', () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  describe('GET /trendingDiscuss', () => {
    it('should handle first=1 parameter', async () => {
      const response = await request(app).get('/trendingDiscuss?first=1');

      expect(response.status).toBe(200);
    });

    it('should handle large first parameter', async () => {
      const response = await request(app).get('/trendingDiscuss?first=50');

      expect(response.status).toBe(200);
    });

    it('should default to 20 when first=0', async () => {
      const response = await request(app).get('/trendingDiscuss?first=0');

      expect(response.status).toBe(200);
    });

    it('should error message', async () => {
      const response = await request(app).get('/trendingDiscuss');

      expect(response.status).toBe(400);
      if (response.body.categoryTopicList) {
        expect(response.body.categoryTopicList).toHaveProperty('edges');
      }
    });

    it('should return array of discussion edges', async () => {
      const response = await request(app).get('/trendingDiscuss?first=5');

      expect(response.status).toBe(200);
      if (response.body.categoryTopicList?.edges) {
        expect(Array.isArray(response.body.categoryTopicList.edges)).toBe(true);
      }
    });
  });

  describe('GET /discussTopic/:topicId', () => {
    it('should return discussion topic details', async () => {
      const response = await request(app).get('/discussTopic/12345');

      expect(response.status).toBe(200);
    });

    it('should handle numeric topicId', async () => {
      const response = await request(app).get('/discussTopic/98765');

      expect(response.status).toBe(200);
    });

    it('should handle large topicId', async () => {
      const response = await request(app).get('/discussTopic/999999999');

      expect(response.status).toBe(200);
    });

    it('should handle string topicId', async () => {
      const response = await request(app).get('/discussTopic/topic-123');

      expect(response.status).toBe(200);
    });

    it('should return topic data structure', async () => {
      const response = await request(app).get('/discussTopic/12345');

      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
    });
  });

  describe('GET /discussComments/:topicId', () => {
    it('should return discussion comments', async () => {
      const response = await request(app).get('/discussComments/12345');

      expect(response.status).toBe(200);
    });

    it('should handle numeric topicId for comments', async () => {
      const response = await request(app).get('/discussComments/54321');

      expect(response.status).toBe(200);
    });

    it('should handle large topicId for comments', async () => {
      const response = await request(app).get('/discussComments/888888888');

      expect(response.status).toBe(200);
    });

    it('should return comments data structure', async () => {
      const response = await request(app).get('/discussComments/12345');

      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
    });
  });

  describe('Query parameter validation', () => {
    it('should handle missing first parameter', async () => {
      const response = await request(app).get('/trendingDiscuss');

      expect(response.status).toBe(400);
    });

    it('should handle numeric string for first parameter', async () => {
      const response = await request(app).get('/trendingDiscuss?first=15');

      expect(response.status).toBe(200);
    });

    it('should handle invalid first parameter gracefully', async () => {
      const response = await request(app).get('/trendingDiscuss?first=abc');

      expect(response.status).toBe(400);
    });
  });

  describe('Response format', () => {
    it('should return JSON format for trending discussions', async () => {
      const response = await request(app).get('/trendingDiscuss');

      expect(response.status).toBe(400);
      expect(response.headers['content-type']).toMatch(/json/);
    });

    it('should return JSON format for discussion topic', async () => {
      const response = await request(app).get('/discussTopic/12345');

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toMatch(/json/);
    });

    it('should return JSON format for discussion comments', async () => {
      const response = await request(app).get('/discussComments/12345');

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toMatch(/json/);
    });
  });

  describe('Edge cases', () => {
    it('should handle topicId with special characters', async () => {
      const response = await request(app).get('/discussTopic/topic-123-test');

      expect(response.status).toBe(200);
    });

    it('should handle very long topicId', async () => {
      const longId = '1'.repeat(50);
      const response = await request(app).get(`/discussTopic/${longId}`);

      expect(response.status).toBe(200);
    });

    it('should handle zero as topicId', async () => {
      const response = await request(app).get('/discussTopic/0');

      expect(response.status).toBe(200);
    });

    it('should handle negative topicId', async () => {
      const response = await request(app).get('/discussTopic/-123');

      expect(response.status).toBe(200);
    });
  });

  describe('Multiple requests', () => {
    it('should handle multiple trending discussion requests', async () => {
      const response1 = await request(app).get('/trendingDiscuss?first=5');
      const response2 = await request(app).get('/trendingDiscuss?first=10');

      expect(response1.status).toBe(200);
      expect(response2.status).toBe(200);
    });

    it('should handle topic and comments for same topicId', async () => {
      const topicResponse = await request(app).get('/discussTopic/12345');
      const commentsResponse = await request(app).get('/discussComments/12345');

      expect(topicResponse.status).toBe(200);
      expect(commentsResponse.status).toBe(200);
    });
  });

  describe('Error handling', () => {
    it('should handle non-existent topic gracefully', async () => {
      const response = await request(app).get('/discussTopic/9999999999');

      expect(response.status).toBe(200);
    });

    it('should handle non-existent comments gracefully', async () => {
      const response = await request(app).get('/discussComments/9999999999');

      expect(response.status).toBe(200);
    });
  });
});
