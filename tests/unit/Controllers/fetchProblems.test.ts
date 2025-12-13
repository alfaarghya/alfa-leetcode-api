import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Response } from 'express';
import fetchProblems from '../../../src/Controllers/fetchProblems';
import { ProblemSetQuestionListData } from '../../../src/types';

describe('fetchProblems', () => {
  let mockRes: Partial<Response>;
  let jsonSpy: ReturnType<typeof vi.fn>;
  let statusSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    jsonSpy = vi.fn();
    statusSpy = vi.fn().mockReturnValue({
      json: jsonSpy,
    });
    mockRes = {
      json: jsonSpy,
      status: statusSpy,
    };
  });

  it('should fetch problems with default parameters', async () => {
    const mockData = {
      data: {
        problemsetQuestionList: {
          total: 100,
          questions: [{ titleSlug: 'two-sum' }],
        },
      },
    };

    global.fetch = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue(mockData),
    });

    const formatData = vi.fn((data: ProblemSetQuestionListData) => data);

    await fetchProblems({}, mockRes as Response, formatData, 'query');

    expect(global.fetch).toHaveBeenCalledWith('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Referer: 'https://leetcode.com',
      },
      body: JSON.stringify({
        query: 'query',
        variables: {
          categorySlug: '',
          skip: 0,
          limit: 20,
          filters: {
            tags: [],
            difficulty: undefined,
          },
        },
      }),
    });

    expect(jsonSpy).toHaveBeenCalledWith(mockData.data);
  });

  it('should fetch problems with custom limit and skip', async () => {
    const mockData = {
      data: {
        problemsetQuestionList: {
          total: 100,
          questions: [],
        },
      },
    };

    global.fetch = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue(mockData),
    });

    const formatData = vi.fn((data: ProblemSetQuestionListData) => data);

    await fetchProblems(
      { limit: 50, skip: 10 },
      mockRes as Response,
      formatData,
      'query',
    );

    expect(global.fetch).toHaveBeenCalledWith(
      'https://leetcode.com/graphql',
      expect.objectContaining({
        body: JSON.stringify({
          query: 'query',
          variables: {
            categorySlug: '',
            skip: 10,
            limit: 50,
            filters: {
              tags: [],
              difficulty: undefined,
            },
          },
        }),
      }),
    );
  });

  it('should set limit to 1 when only skip is provided', async () => {
    const mockData = {
      data: {
        problemsetQuestionList: {
          total: 100,
          questions: [],
        },
      },
    };

    global.fetch = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue(mockData),
    });

    const formatData = vi.fn((data: ProblemSetQuestionListData) => data);

    await fetchProblems({ skip: 5 }, mockRes as Response, formatData, 'query');

    expect(global.fetch).toHaveBeenCalledWith(
      'https://leetcode.com/graphql',
      expect.objectContaining({
        body: JSON.stringify({
          query: 'query',
          variables: {
            categorySlug: '',
            skip: 5,
            limit: 1,
            filters: {
              tags: [],
              difficulty: undefined,
            },
          },
        }),
      }),
    );
  });

  it('should handle tags filter with space-separated tags', async () => {
    const mockData = {
      data: {
        problemsetQuestionList: {
          total: 50,
          questions: [],
        },
      },
    };

    global.fetch = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue(mockData),
    });

    const formatData = vi.fn((data: ProblemSetQuestionListData) => data);

    await fetchProblems(
      { tags: 'array string hash-table' },
      mockRes as Response,
      formatData,
      'query',
    );

    expect(global.fetch).toHaveBeenCalledWith(
      'https://leetcode.com/graphql',
      expect.objectContaining({
        body: JSON.stringify({
          query: 'query',
          variables: {
            categorySlug: '',
            skip: 0,
            limit: 20,
            filters: {
              tags: ['array', 'string', 'hash-table'],
              difficulty: undefined,
            },
          },
        }),
      }),
    );
  });

  it('should handle difficulty filter', async () => {
    const mockData = {
      data: {
        problemsetQuestionList: {
          total: 30,
          questions: [],
        },
      },
    };

    global.fetch = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue(mockData),
    });

    const formatData = vi.fn((data: ProblemSetQuestionListData) => data);

    await fetchProblems(
      { difficulty: 'EASY' },
      mockRes as Response,
      formatData,
      'query',
    );

    expect(global.fetch).toHaveBeenCalledWith(
      'https://leetcode.com/graphql',
      expect.objectContaining({
        body: JSON.stringify({
          query: 'query',
          variables: {
            categorySlug: '',
            skip: 0,
            limit: 20,
            filters: {
              tags: [],
              difficulty: 'EASY',
            },
          },
        }),
      }),
    );
  });

  it('should handle combined filters (tags and difficulty)', async () => {
    const mockData = {
      data: {
        problemsetQuestionList: {
          total: 15,
          questions: [],
        },
      },
    };

    global.fetch = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue(mockData),
    });

    const formatData = vi.fn((data: ProblemSetQuestionListData) => data);

    await fetchProblems(
      { tags: 'array', difficulty: 'MEDIUM', limit: 10, skip: 5 },
      mockRes as Response,
      formatData,
      'query',
    );

    expect(global.fetch).toHaveBeenCalledWith(
      'https://leetcode.com/graphql',
      expect.objectContaining({
        body: JSON.stringify({
          query: 'query',
          variables: {
            categorySlug: '',
            skip: 5,
            limit: 10,
            filters: {
              tags: ['array'],
              difficulty: 'MEDIUM',
            },
          },
        }),
      }),
    );
  });

  it('should handle GraphQL errors with 400 status', async () => {
    const mockErrorResponse = {
      errors: [
        {
          message: 'Invalid query',
          extensions: { code: 'BAD_REQUEST' },
        },
      ],
    };

    global.fetch = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue(mockErrorResponse),
    });

    const formatData = vi.fn((data: ProblemSetQuestionListData) => data);

    await fetchProblems({}, mockRes as Response, formatData, 'query');

    expect(statusSpy).toHaveBeenCalledWith(400);
    expect(jsonSpy).toHaveBeenCalledWith(mockErrorResponse.errors);
  });

  it('should handle network errors with 500 status', async () => {
    const networkError = new Error('Network error');
    global.fetch = vi.fn().mockRejectedValue(networkError);

    const formatData = vi.fn((data: ProblemSetQuestionListData) => data);

    await fetchProblems({}, mockRes as Response, formatData, 'query');

    expect(statusSpy).toHaveBeenCalledWith(500);
    expect(jsonSpy).toHaveBeenCalledWith({ error: 'Internal server error' });
  });

  it('should handle empty tags array', async () => {
    const mockData = {
      data: {
        problemsetQuestionList: {
          total: 100,
          questions: [],
        },
      },
    };

    global.fetch = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue(mockData),
    });

    const formatData = vi.fn((data: ProblemSetQuestionListData) => data);

    await fetchProblems({ tags: '' }, mockRes as Response, formatData, 'query');

    expect(global.fetch).toHaveBeenCalledWith(
      'https://leetcode.com/graphql',
      expect.objectContaining({
        body: JSON.stringify({
          query: 'query',
          variables: {
            categorySlug: '',
            skip: 0,
            limit: 20,
            filters: {
              tags: [],
              difficulty: undefined,
            },
          },
        }),
      }),
    );
  });

  it('should apply formatData transformation to response', async () => {
    const mockData = {
      data: {
        problemsetQuestionList: {
          total: 100,
          questions: [
            { titleSlug: 'two-sum', difficulty: 'Easy' },
            { titleSlug: 'add-two-numbers', difficulty: 'Medium' },
          ],
        },
      },
    };

    global.fetch = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue(mockData),
    });

    const formatData = vi.fn((data: ProblemSetQuestionListData) => ({
      total: data.problemsetQuestionList.total,
      count: data.problemsetQuestionList.questions.length,
    }));

    await fetchProblems({}, mockRes as Response, formatData, 'query');

    expect(formatData).toHaveBeenCalledWith(mockData.data);
    expect(jsonSpy).toHaveBeenCalledWith({
      total: 100,
      count: 2,
    });
  });
});
