import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Response } from 'express';
import fetchUserProfile from '../../../src/Controllers/fetchUserProfile';

describe('fetchUserProfile', () => {
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

  it('should fetch user profile and apply format function', async () => {
    const mockData = {
      data: {
        matchedUser: {
          username: 'testuser',
          profile: {
            realName: 'Test User',
            ranking: 12345,
          },
          submitStats: {
            acSubmissionNum: [
              { difficulty: 'All', count: 500 },
              { difficulty: 'Easy', count: 200 },
            ],
          },
        },
      },
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(mockData),
    });

    const formatFunction = vi.fn((data: any) => ({
      username: data.matchedUser.username,
      name: data.matchedUser.profile.realName,
      rank: data.matchedUser.profile.ranking,
      totalSolved: data.matchedUser.submitStats.acSubmissionNum[0].count,
    }));

    const params = { username: 'testuser' };

    await fetchUserProfile(
      mockRes as Response,
      'query { matchedUser }',
      params,
      formatFunction,
    );

    expect(global.fetch).toHaveBeenCalledWith('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Referer: 'https://leetcode.com',
      },
      body: JSON.stringify({
        query: 'query { matchedUser }',
        variables: params,
      }),
    });

    expect(formatFunction).toHaveBeenCalledWith(mockData.data);
    expect(jsonSpy).toHaveBeenCalledWith({
      username: 'testuser',
      name: 'Test User',
      rank: 12345,
      totalSolved: 500,
    });
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

    const formatFunction = vi.fn((data: any) => data);

    await fetchUserProfile(
      mockRes as Response,
      'query { matchedUser }',
      { username: 'nonexistent' },
      formatFunction,
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

    const formatFunction = vi.fn((data: any) => data.matchedUser);

    await fetchUserProfile(
      mockRes as Response,
      'query { matchedUser }',
      { username: 'testuser' },
      formatFunction,
    );

    expect(consoleErrorSpy).toHaveBeenCalledWith('HTTP error! status: 500');
    expect(formatFunction).toHaveBeenCalledWith(mockData.data);
  });

  it('should handle network errors', async () => {
    const networkError = new Error('Network error');
    global.fetch = vi.fn().mockRejectedValue(networkError);

    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const formatFunction = vi.fn((data: any) => data);

    await fetchUserProfile(
      mockRes as Response,
      'query { matchedUser }',
      { username: 'testuser' },
      formatFunction,
    );

    expect(consoleErrorSpy).toHaveBeenCalledWith('Error: ', networkError);
    expect(sendSpy).toHaveBeenCalledWith(networkError);
  });

  it('should handle complex parameters', async () => {
    const mockData = {
      data: {
        userProfile: {
          badges: [],
          contributions: 100,
        },
      },
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(mockData),
    });

    const formatFunction = vi.fn((data: any) => data.userProfile);

    const complexParams = {
      username: 'testuser',
      year: 2024,
      limit: 50,
    };

    await fetchUserProfile(
      mockRes as Response,
      'query { userProfile }',
      complexParams,
      formatFunction,
    );

    expect(global.fetch).toHaveBeenCalledWith(
      'https://leetcode.com/graphql',
      expect.objectContaining({
        body: JSON.stringify({
          query: 'query { userProfile }',
          variables: complexParams,
        }),
      }),
    );

    expect(jsonSpy).toHaveBeenCalledWith(mockData.data.userProfile);
  });

  it('should handle empty response data', async () => {
    const mockData = {
      data: {},
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(mockData),
    });

    const formatFunction = vi.fn((data: any) => ({ empty: true }));

    await fetchUserProfile(
      mockRes as Response,
      'query { matchedUser }',
      { username: 'testuser' },
      formatFunction,
    );

    expect(formatFunction).toHaveBeenCalledWith({});
    expect(jsonSpy).toHaveBeenCalledWith({ empty: true });
  });

  it('should handle format function that transforms nested data', async () => {
    const mockData = {
      data: {
        allQuestionsCount: [
          { difficulty: 'Easy', count: 100 },
          { difficulty: 'Medium', count: 200 },
          { difficulty: 'Hard', count: 150 },
        ],
        matchedUser: {
          submitStats: {
            acSubmissionNum: [
              { difficulty: 'Easy', count: 50 },
              { difficulty: 'Medium', count: 80 },
              { difficulty: 'Hard', count: 20 },
            ],
          },
        },
      },
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(mockData),
    });

    const formatFunction = vi.fn((data: any) => ({
      totalQuestions: data.allQuestionsCount.reduce(
        (sum: number, item: any) => sum + item.count,
        0,
      ),
      solvedQuestions: data.matchedUser.submitStats.acSubmissionNum.reduce(
        (sum: number, item: any) => sum + item.count,
        0,
      ),
    }));

    await fetchUserProfile(
      mockRes as Response,
      'query { allQuestionsCount matchedUser }',
      { username: 'testuser' },
      formatFunction,
    );

    expect(jsonSpy).toHaveBeenCalledWith({
      totalQuestions: 450,
      solvedQuestions: 150,
    });
  });

  it('should handle null parameters', async () => {
    const mockData = {
      data: {
        globalData: 'value',
      },
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(mockData),
    });

    const formatFunction = vi.fn((data: any) => data);

    await fetchUserProfile(
      mockRes as Response,
      'query { globalData }',
      null,
      formatFunction,
    );

    expect(global.fetch).toHaveBeenCalledWith(
      'https://leetcode.com/graphql',
      expect.objectContaining({
        body: JSON.stringify({
          query: 'query { globalData }',
          variables: null,
        }),
      }),
    );
  });
});
