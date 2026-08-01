import type { Response } from 'express';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import fetchTags from '../../../src/Controllers/fetchTags';

describe('fetchTags', () => {
  let mockRes: Partial<Response>;
  let jsonSpy: ReturnType<typeof vi.fn>;
  let sendSpy: ReturnType<typeof vi.fn>;
  const formatData = vi.fn((data) => data);

  beforeEach(() => {
    jsonSpy = vi.fn();
    sendSpy = vi.fn();
    mockRes = {
      json: jsonSpy,
      send: sendSpy,
    };
    formatData.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should fetch and format tags successfully', async () => {
    const mockData = {
      data: {
        questionTopicTags: {
          edges: [{ node: { name: 'Array', slug: 'array' } }],
        },
      },
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(mockData),
    });

    await fetchTags(
      mockRes as Response,
      'query { questionTopicTags }',
      formatData,
    );

    expect(global.fetch).toHaveBeenCalledWith('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Referer: 'https://leetcode.com',
      },
      body: JSON.stringify({
        query: 'query { questionTopicTags }',
      }),
    });

    expect(formatData).toHaveBeenCalledWith(mockData.data);
    expect(jsonSpy).toHaveBeenCalledWith(mockData.data);
  });

  it('should handle GraphQL errors', async () => {
    const mockErrorResponse = {
      errors: [{ message: 'Unable to fetch tags' }],
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: vi.fn().mockResolvedValue(mockErrorResponse),
    });

    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    await fetchTags(
      mockRes as Response,
      'query { questionTopicTags }',
      formatData,
    );

    expect(consoleErrorSpy).toHaveBeenCalledWith('HTTP error! status: 500');
    expect(sendSpy).toHaveBeenCalledWith(mockErrorResponse);
    expect(formatData).not.toHaveBeenCalled();
  });

  it('should handle network errors', async () => {
    const networkError = new Error('Network error');
    global.fetch = vi.fn().mockRejectedValue(networkError);

    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    await fetchTags(
      mockRes as Response,
      'query { questionTopicTags }',
      formatData,
    );

    expect(consoleErrorSpy).toHaveBeenCalledWith('Error: ', networkError);
    expect(sendSpy).toHaveBeenCalledWith(networkError);
  });
});
