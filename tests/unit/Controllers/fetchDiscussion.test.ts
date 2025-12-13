import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Response } from 'express';
import fetchDiscussion from '../../../src/Controllers/fetchDiscussion';

describe('fetchDiscussion', () => {
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

  it('should fetch discussions with custom first parameter', async () => {
    const mockData = {
      data: {
        categoryTopicList: {
          edges: [
            { node: { id: '1', title: 'Discussion 1' } },
            { node: { id: '2', title: 'Discussion 2' } },
          ],
        },
      },
    };

    global.fetch = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue(mockData),
    });

    const formatData = vi.fn((data: any) => data);

    await fetchDiscussion(
      { first: 10 },
      mockRes as Response,
      formatData,
      'query { categoryTopicList }',
    );

    expect(global.fetch).toHaveBeenCalledWith('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Referer: 'https://leetcode.com',
      },
      body: JSON.stringify({
        query: 'query { categoryTopicList }',
        variables: {
          first: 10,
        },
      }),
    });

    expect(formatData).toHaveBeenCalledWith(mockData.data);
    expect(jsonSpy).toHaveBeenCalledWith(mockData.data);
  });

  it('should use default first value of 20 when not provided', async () => {
    const mockData = {
      data: {
        categoryTopicList: {
          edges: [],
        },
      },
    };

    global.fetch = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue(mockData),
    });

    const formatData = vi.fn((data: any) => data);

    await fetchDiscussion(
      { first: 0 },
      mockRes as Response,
      formatData,
      'query { categoryTopicList }',
    );

    expect(global.fetch).toHaveBeenCalledWith(
      'https://leetcode.com/graphql',
      expect.objectContaining({
        body: JSON.stringify({
          query: 'query { categoryTopicList }',
          variables: {
            first: 20,
          },
        }),
      }),
    );
  });

  it('should apply formatData transformation to response', async () => {
    const mockData = {
      data: {
        categoryTopicList: {
          edges: [
            {
              node: {
                id: '1',
                title: 'How to solve Two Sum?',
                post: { content: 'Discussion content' },
              },
            },
          ],
        },
      },
    };

    global.fetch = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue(mockData),
    });

    const formatData = vi.fn((data: any) => ({
      count: data.categoryTopicList.edges.length,
      topics: data.categoryTopicList.edges.map((edge: any) => edge.node.title),
    }));

    await fetchDiscussion(
      { first: 5 },
      mockRes as Response,
      formatData,
      'query { categoryTopicList }',
    );

    expect(formatData).toHaveBeenCalledWith(mockData.data);
    expect(jsonSpy).toHaveBeenCalledWith({
      count: 1,
      topics: ['How to solve Two Sum?'],
    });
  });

  it('should handle GraphQL errors from LeetCode API', async () => {
    const mockErrorResponse = {
      errors: [
        {
          message: 'Unable to fetch discussions',
          extensions: { code: 'INTERNAL_ERROR' },
        },
      ],
    };

    global.fetch = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue(mockErrorResponse),
    });

    const formatData = vi.fn((data: any) => data);

    await fetchDiscussion(
      { first: 10 },
      mockRes as Response,
      formatData,
      'query { categoryTopicList }',
    );

    expect(sendSpy).toHaveBeenCalledWith(mockErrorResponse);
    expect(jsonSpy).not.toHaveBeenCalled();
  });

  it('should handle network errors', async () => {
    const networkError = new Error('Network error');
    global.fetch = vi.fn().mockRejectedValue(networkError);

    const formatData = vi.fn((data: any) => data);

    await fetchDiscussion(
      { first: 10 },
      mockRes as Response,
      formatData,
      'query { categoryTopicList }',
    );

    expect(sendSpy).toHaveBeenCalledWith(networkError);
  });

  it('should handle empty discussion list', async () => {
    const mockData = {
      data: {
        categoryTopicList: {
          edges: [],
        },
      },
    };

    global.fetch = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue(mockData),
    });

    const formatData = vi.fn((data: any) => ({
      count: data.categoryTopicList.edges.length,
    }));

    await fetchDiscussion(
      { first: 10 },
      mockRes as Response,
      formatData,
      'query { categoryTopicList }',
    );

    expect(jsonSpy).toHaveBeenCalledWith({ count: 0 });
  });

  it('should handle large first parameter values', async () => {
    const mockData = {
      data: {
        categoryTopicList: {
          edges: Array(100)
            .fill(null)
            .map((_, i) => ({
              node: { id: String(i), title: `Discussion ${i}` },
            })),
        },
      },
    };

    global.fetch = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue(mockData),
    });

    const formatData = vi.fn((data: any) => data);

    await fetchDiscussion(
      { first: 100 },
      mockRes as Response,
      formatData,
      'query { categoryTopicList }',
    );

    expect(global.fetch).toHaveBeenCalledWith(
      'https://leetcode.com/graphql',
      expect.objectContaining({
        body: JSON.stringify({
          query: 'query { categoryTopicList }',
          variables: {
            first: 100,
          },
        }),
      }),
    );

    expect(formatData).toHaveBeenCalledWith(mockData.data);
  });

  it('should handle first parameter as 1', async () => {
    const mockData = {
      data: {
        categoryTopicList: {
          edges: [{ node: { id: '1', title: 'Single Discussion' } }],
        },
      },
    };

    global.fetch = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue(mockData),
    });

    const formatData = vi.fn((data: any) => data);

    await fetchDiscussion(
      { first: 1 },
      mockRes as Response,
      formatData,
      'query { categoryTopicList }',
    );

    expect(global.fetch).toHaveBeenCalledWith(
      'https://leetcode.com/graphql',
      expect.objectContaining({
        body: JSON.stringify({
          query: 'query { categoryTopicList }',
          variables: {
            first: 1,
          },
        }),
      }),
    );
  });
});
