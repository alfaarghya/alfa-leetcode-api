import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Response } from 'express';
import handleRequest from '../../../src/Controllers/handleRequest';

describe('handleRequest', () => {
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

  it('should handle successful GraphQL request', async () => {
    const mockData = {
      data: {
        user: {
          username: 'testuser',
          profile: { realName: 'Test User' },
        },
      },
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(mockData),
    });

    const params = { username: 'testuser' };

    await handleRequest(mockRes as Response, 'query { user }', params);

    expect(global.fetch).toHaveBeenCalledWith('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Referer: 'https://leetcode.com',
      },
      body: JSON.stringify({
        query: 'query { user }',
        variables: params,
      }),
    });

    expect(jsonSpy).toHaveBeenCalledWith(mockData.data);
  });

  it('should handle GraphQL errors from LeetCode API', async () => {
    const mockErrorResponse = {
      errors: [
        {
          message: 'Invalid query',
          extensions: { code: 'BAD_REQUEST' },
        },
      ],
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(mockErrorResponse),
    });

    await handleRequest(mockRes as Response, 'query { invalid }', {});

    expect(sendSpy).toHaveBeenCalledWith(mockErrorResponse);
    expect(jsonSpy).not.toHaveBeenCalled();
  });

  it('should log HTTP errors when response is not ok', async () => {
    const mockData = {
      data: {
        result: 'some data',
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

    await handleRequest(mockRes as Response, 'query { data }', {});

    expect(consoleErrorSpy).toHaveBeenCalledWith('HTTP error! status: 500');
    expect(jsonSpy).toHaveBeenCalledWith(mockData.data);
  });

  it('should handle network errors', async () => {
    const networkError = new Error('Network error');
    global.fetch = vi.fn().mockRejectedValue(networkError);

    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    await handleRequest(mockRes as Response, 'query { data }', {});

    expect(consoleErrorSpy).toHaveBeenCalledWith('Error: ', networkError);
    expect(sendSpy).toHaveBeenCalledWith(networkError);
  });

  it('should handle empty parameters', async () => {
    const mockData = {
      data: {
        globalData: 'some value',
      },
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(mockData),
    });

    await handleRequest(mockRes as Response, 'query { globalData }', {});

    expect(global.fetch).toHaveBeenCalledWith(
      'https://leetcode.com/graphql',
      expect.objectContaining({
        body: JSON.stringify({
          query: 'query { globalData }',
          variables: {},
        }),
      }),
    );

    expect(jsonSpy).toHaveBeenCalledWith(mockData.data);
  });

  it('should handle null parameters', async () => {
    const mockData = {
      data: {
        result: 'data',
      },
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(mockData),
    });

    await handleRequest(mockRes as Response, 'query { result }', null);

    expect(global.fetch).toHaveBeenCalledWith(
      'https://leetcode.com/graphql',
      expect.objectContaining({
        body: JSON.stringify({
          query: 'query { result }',
          variables: null,
        }),
      }),
    );
  });

  it('should handle complex parameters', async () => {
    const mockData = {
      data: {
        problems: [],
      },
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(mockData),
    });

    const complexParams = {
      categorySlug: 'algorithms',
      skip: 10,
      limit: 50,
      filters: {
        tags: ['array', 'string'],
        difficulty: 'MEDIUM',
      },
    };

    await handleRequest(
      mockRes as Response,
      'query { problems }',
      complexParams,
    );

    expect(global.fetch).toHaveBeenCalledWith(
      'https://leetcode.com/graphql',
      expect.objectContaining({
        body: JSON.stringify({
          query: 'query { problems }',
          variables: complexParams,
        }),
      }),
    );

    expect(jsonSpy).toHaveBeenCalledWith(mockData.data);
  });

  it('should handle undefined response data', async () => {
    const mockData = {
      data: undefined,
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(mockData),
    });

    await handleRequest(mockRes as Response, 'query { data }', {});

    expect(jsonSpy).toHaveBeenCalledWith(undefined);
  });

  it('should pass correct referer header', async () => {
    const mockData = {
      data: { test: 'data' },
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(mockData),
    });

    await handleRequest(mockRes as Response, 'query { test }', {});

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
});
