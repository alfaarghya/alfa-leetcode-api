import type { Response } from 'express';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import fetchDataRawFormat from '../../../src/Controllers/fetchDataRawFormat';

describe('fetchDataRawFormat', () => {
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

  it('should fetch data in raw format successfully', async () => {
    const mockData = {
      data: {
        matchedUser: {
          username: 'testuser',
          profile: {
            realName: 'Test User',
            ranking: 12345,
          },
          submitStats: {
            acSubmissionNum: [{ difficulty: 'All', count: 500 }],
          },
        },
      },
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(mockData),
    });

    await fetchDataRawFormat(
      { username: 'testuser' },
      mockRes as Response,
      'query { matchedUser }',
    );

    expect(global.fetch).toHaveBeenCalledWith('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Referer: 'https://leetcode.com',
      },
      body: JSON.stringify({
        query: 'query { matchedUser }',
        variables: {
          username: 'testuser',
        },
      }),
    });

    expect(jsonSpy).toHaveBeenCalledWith(mockData.data);
  });

  it('should handle GraphQL errors from LeetCode API', async () => {
    const mockErrorResponse = {
      errors: [
        {
          message: 'User not found',
          extensions: { code: 'NOT_FOUND' },
        },
      ],
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(mockErrorResponse),
    });

    await fetchDataRawFormat(
      { username: 'nonexistent' },
      mockRes as Response,
      'query { matchedUser }',
    );

    expect(sendSpy).toHaveBeenCalledWith(mockErrorResponse);
    expect(jsonSpy).not.toHaveBeenCalled();
  });

  it('should log HTTP errors when response is not ok', async () => {
    const mockData = {
      data: {
        matchedUser: {
          username: 'testuser',
        },
      },
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: vi.fn().mockResolvedValue(mockData),
    });

    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    await fetchDataRawFormat(
      { username: 'testuser' },
      mockRes as Response,
      'query { matchedUser }',
    );

    expect(consoleErrorSpy).toHaveBeenCalledWith('HTTP error! status: 500');
    expect(jsonSpy).toHaveBeenCalledWith(mockData.data);
  });

  it('should handle network errors', async () => {
    const networkError = new Error('Network error');
    global.fetch = vi.fn().mockRejectedValue(networkError);

    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    await fetchDataRawFormat(
      { username: 'testuser' },
      mockRes as Response,
      'query { matchedUser }',
    );

    expect(consoleErrorSpy).toHaveBeenCalledWith('Error: ', networkError);
    expect(sendSpy).toHaveBeenCalledWith(networkError);
  });

  it('should return raw data without any formatting', async () => {
    const mockData = {
      data: {
        complexObject: {
          nested: {
            deeply: {
              value: 'test',
              array: [1, 2, 3],
              object: { key: 'value' },
            },
          },
        },
      },
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(mockData),
    });

    await fetchDataRawFormat(
      { username: 'testuser' },
      mockRes as Response,
      'query { complexObject }',
    );

    expect(jsonSpy).toHaveBeenCalledWith(mockData.data);
  });

  it('should handle empty response data', async () => {
    const mockData = {
      data: {},
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(mockData),
    });

    await fetchDataRawFormat(
      { username: 'testuser' },
      mockRes as Response,
      'query { matchedUser }',
    );

    expect(jsonSpy).toHaveBeenCalledWith({});
  });

  it('should handle username with special characters', async () => {
    const mockData = {
      data: {
        matchedUser: {
          username: 'test-user_123',
        },
      },
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(mockData),
    });

    await fetchDataRawFormat(
      { username: 'test-user_123' },
      mockRes as Response,
      'query { matchedUser }',
    );

    expect(global.fetch).toHaveBeenCalledWith(
      'https://leetcode.com/graphql',
      expect.objectContaining({
        body: JSON.stringify({
          query: 'query { matchedUser }',
          variables: {
            username: 'test-user_123',
          },
        }),
      }),
    );

    expect(jsonSpy).toHaveBeenCalledWith(mockData.data);
  });

  it('should pass correct referer header', async () => {
    const mockData = {
      data: {
        matchedUser: {},
      },
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(mockData),
    });

    await fetchDataRawFormat(
      { username: 'testuser' },
      mockRes as Response,
      'query { matchedUser }',
    );

    expect(global.fetch).toHaveBeenCalledWith(
      'https://leetcode.com/graphql',
      expect.objectContaining({
        headers: {
          'Content-Type': 'application/json',
          Referer: 'https://leetcode.com',
        },
      }),
    );
  });

  it('should handle null data in response', async () => {
    const mockData = {
      data: null,
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(mockData),
    });

    await fetchDataRawFormat(
      { username: 'testuser' },
      mockRes as Response,
      'query { matchedUser }',
    );

    expect(jsonSpy).toHaveBeenCalledWith(null);
  });
});
