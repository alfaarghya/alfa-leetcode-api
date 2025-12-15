import type { Response } from 'express';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import fetchSingleProblem from '../../../src/Controllers/fetchSingleProblem';

describe('fetchSingleProblem', () => {
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

  it('should fetch daily problem successfully without formatData', async () => {
    const mockData = {
      data: {
        activeDailyCodingChallengeQuestion: {
          question: {
            titleSlug: 'two-sum',
            title: 'Two Sum',
          },
        },
      },
    };

    global.fetch = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue(mockData),
    });

    await fetchSingleProblem(
      mockRes as Response,
      'query { activeDailyCodingChallengeQuestion }',
      null,
    );

    expect(global.fetch).toHaveBeenCalledWith('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Referer: 'https://leetcode.com',
      },
      body: JSON.stringify({
        query: 'query { activeDailyCodingChallengeQuestion }',
        variables: {
          titleSlug: null,
        },
      }),
    });

    expect(jsonSpy).toHaveBeenCalledWith(mockData.data);
  });

  it('should fetch selected problem with titleSlug', async () => {
    const mockData = {
      data: {
        question: {
          questionId: '1',
          titleSlug: 'two-sum',
          title: 'Two Sum',
          difficulty: 'Easy',
        },
      },
    };

    global.fetch = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue(mockData),
    });

    await fetchSingleProblem(
      mockRes as Response,
      'query { question }',
      'two-sum',
    );

    expect(global.fetch).toHaveBeenCalledWith(
      'https://leetcode.com/graphql',
      expect.objectContaining({
        body: JSON.stringify({
          query: 'query { question }',
          variables: {
            titleSlug: 'two-sum',
          },
        }),
      }),
    );

    expect(jsonSpy).toHaveBeenCalledWith(mockData.data);
  });

  it('should apply formatData transformation when provided', async () => {
    const mockData = {
      data: {
        question: {
          questionId: '1',
          titleSlug: 'two-sum',
          title: 'Two Sum',
        },
      },
    };

    global.fetch = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue(mockData),
    });

    const formatData = vi.fn((data: never) => ({
      id: data.question.questionId,
      slug: data.question.titleSlug,
    }));

    await fetchSingleProblem(
      mockRes as Response,
      'query { question }',
      'two-sum',
      formatData,
    );

    expect(formatData).toHaveBeenCalledWith(mockData.data);
    expect(jsonSpy).toHaveBeenCalledWith({
      id: '1',
      slug: 'two-sum',
    });
  });

  it('should handle GraphQL errors from LeetCode API', async () => {
    const mockErrorResponse = {
      errors: [
        {
          message: 'Question not found',
          extensions: { code: 'NOT_FOUND' },
        },
      ],
    };

    global.fetch = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue(mockErrorResponse),
    });

    await fetchSingleProblem(
      mockRes as Response,
      'query { question }',
      'non-existent-problem',
    );

    expect(sendSpy).toHaveBeenCalledWith(mockErrorResponse);
    expect(jsonSpy).not.toHaveBeenCalled();
  });

  it('should handle null titleSlug for daily problem', async () => {
    const mockData = {
      data: {
        activeDailyCodingChallengeQuestion: {
          question: {
            titleSlug: 'daily-problem',
          },
        },
      },
    };

    global.fetch = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue(mockData),
    });

    await fetchSingleProblem(
      mockRes as Response,
      'query { activeDailyCodingChallengeQuestion }',
      null,
    );

    expect(global.fetch).toHaveBeenCalledWith(
      'https://leetcode.com/graphql',
      expect.objectContaining({
        body: JSON.stringify({
          query: 'query { activeDailyCodingChallengeQuestion }',
          variables: {
            titleSlug: null,
          },
        }),
      }),
    );
  });

  it('should handle undefined formatData explicitly', async () => {
    const mockData = {
      data: {
        question: {
          titleSlug: 'two-sum',
        },
      },
    };

    global.fetch = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue(mockData),
    });

    await fetchSingleProblem(
      mockRes as Response,
      'query { question }',
      'two-sum',
      undefined,
    );

    expect(jsonSpy).toHaveBeenCalledWith(mockData.data);
  });

  it('should handle empty response data', async () => {
    const mockData = { data: {} };

    global.fetch = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue(mockData),
    });

    await fetchSingleProblem(
      mockRes as Response,
      'query { question }',
      'empty-problem',
    );

    expect(jsonSpy).toHaveBeenCalledWith({});
  });

  it('should handle titleSlug with special characters', async () => {
    const mockData = {
      data: {
        question: {
          titleSlug: 'problem-with-special-chars',
        },
      },
    };

    global.fetch = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue(mockData),
    });

    await fetchSingleProblem(
      mockRes as Response,
      'query { question }',
      'problem-with-special-chars',
    );

    expect(global.fetch).toHaveBeenCalledWith(
      'https://leetcode.com/graphql',
      expect.objectContaining({
        body: JSON.stringify({
          query: 'query { question }',
          variables: {
            titleSlug: 'problem-with-special-chars',
          },
        }),
      }),
    );
  });
});
