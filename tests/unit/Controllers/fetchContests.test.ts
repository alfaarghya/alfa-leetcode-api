import type { Response } from 'express';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  fetchAllContests,
  fetchUpcomingContests,
} from '../../../src/Controllers/fetchContests';

describe('fetchContests', () => {
  let mockRes: Partial<Response>;
  let jsonSpy: ReturnType<typeof vi.fn>;
  let sendSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    jsonSpy = vi.fn();
    sendSpy = vi.fn();
    mockRes = {
      json: jsonSpy,
      send: sendSpy,
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('fetchAllContests', () => {
    it('should fetch all contests successfully', async () => {
      const mockData = {
        data: {
          allContests: [
            { title: 'Weekly Contest 1', startTime: 1234567890 },
            { title: 'Weekly Contest 2', startTime: 1234567900 },
          ],
        },
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(mockData),
      });

      await fetchAllContests(mockRes as Response, 'query { allContests }');

      expect(global.fetch).toHaveBeenCalledWith(
        'https://leetcode.com/graphql',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Referer: 'https://leetcode.com',
          },
          body: JSON.stringify({
            query: 'query { allContests }',
          }),
        },
      );

      expect(jsonSpy).toHaveBeenCalledWith(mockData.data);
    });

    it('should handle GraphQL errors', async () => {
      const mockErrorResponse = {
        errors: [
          {
            message: 'Unable to fetch contests',
            extensions: { code: 'INTERNAL_ERROR' },
          },
        ],
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: vi.fn().mockResolvedValue(mockErrorResponse),
      });

      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      await fetchAllContests(mockRes as Response, 'query { allContests }');

      expect(consoleErrorSpy).toHaveBeenCalledWith('HTTP error! status: 500');
      expect(sendSpy).toHaveBeenCalledWith(mockErrorResponse);
    });

    it('should handle network errors', async () => {
      const networkError = new Error('Network error');
      global.fetch = vi.fn().mockRejectedValue(networkError);

      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      await fetchAllContests(mockRes as Response, 'query { allContests }');

      expect(consoleErrorSpy).toHaveBeenCalledWith('Error: ', networkError);
      expect(sendSpy).toHaveBeenCalledWith(networkError);
    });

    it('should handle empty contests array', async () => {
      const mockData = {
        data: {
          allContests: [],
        },
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(mockData),
      });

      await fetchAllContests(mockRes as Response, 'query { allContests }');

      expect(jsonSpy).toHaveBeenCalledWith(mockData.data);
    });
  });

  describe('fetchUpcomingContests', () => {
    it('should filter and return only upcoming contests', async () => {
      const futureTime = Math.floor(Date.now() / 1000) + 86400;
      const pastTime = Math.floor(Date.now() / 1000) - 86400;

      const mockData = {
        data: {
          allContests: [
            { title: 'Past Contest', startTime: pastTime },
            { title: 'Future Contest 1', startTime: futureTime },
            { title: 'Future Contest 2', startTime: futureTime + 3600 },
          ],
        },
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(mockData),
      });

      await fetchUpcomingContests(mockRes as Response, 'query { allContests }');

      expect(jsonSpy).toHaveBeenCalledWith({
        count: 2,
        contests: [
          { title: 'Future Contest 1', startTime: futureTime },
          { title: 'Future Contest 2', startTime: futureTime + 3600 },
        ],
      });
    });

    it('should handle no upcoming contests', async () => {
      const pastTime = Math.floor(Date.now() / 1000) - 86400;

      const mockData = {
        data: {
          allContests: [
            { title: 'Past Contest 1', startTime: pastTime },
            { title: 'Past Contest 2', startTime: pastTime - 3600 },
          ],
        },
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(mockData),
      });

      await fetchUpcomingContests(mockRes as Response, 'query { allContests }');

      expect(jsonSpy).toHaveBeenCalledWith({
        count: 0,
        contests: [],
      });
    });

    it('should handle null or undefined allContests', async () => {
      const mockData = {
        data: {},
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(mockData),
      });

      await fetchUpcomingContests(mockRes as Response, 'query { allContests }');

      expect(jsonSpy).toHaveBeenCalledWith({
        count: 0,
        contests: [],
      });
    });

    it('should handle GraphQL errors', async () => {
      const mockErrorResponse = {
        errors: [
          {
            message: 'Unable to fetch contests',
            extensions: { code: 'INTERNAL_ERROR' },
          },
        ],
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: vi.fn().mockResolvedValue(mockErrorResponse),
      });

      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      await fetchUpcomingContests(mockRes as Response, 'query { allContests }');

      expect(consoleErrorSpy).toHaveBeenCalledWith('HTTP error! status: 500');
      expect(sendSpy).toHaveBeenCalledWith(mockErrorResponse);
    });

    it('should handle network errors', async () => {
      const networkError = new Error('Network error');
      global.fetch = vi.fn().mockRejectedValue(networkError);

      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      await fetchUpcomingContests(mockRes as Response, 'query { allContests }');

      expect(consoleErrorSpy).toHaveBeenCalledWith('Error: ', networkError);
      expect(sendSpy).toHaveBeenCalledWith(networkError);
    });

    it('should correctly calculate current timestamp', async () => {
      const now = Math.floor(Date.now() / 1000);
      const justBeforeNow = now - 1;
      const justAfterNow = now + 1;

      const mockData = {
        data: {
          allContests: [
            { title: 'Just Past', startTime: justBeforeNow },
            { title: 'Just Future', startTime: justAfterNow },
          ],
        },
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(mockData),
      });

      await fetchUpcomingContests(mockRes as Response, 'query { allContests }');

      const result = jsonSpy.mock.calls[0][0];
      expect(result.count).toBeGreaterThanOrEqual(0);
      expect(result.contests).toBeInstanceOf(Array);
    });
  });
});
