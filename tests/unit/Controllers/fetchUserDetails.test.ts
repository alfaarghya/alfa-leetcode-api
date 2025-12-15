import type { Response } from 'express';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import fetchUserDetails from '../../../src/Controllers/fetchUserDetails';

describe('fetchUserDetails', () => {
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

  it('should fetch user details successfully and return formatted data', async () => {
    const mockData = {
      data: {
        matchedUser: {
          username: 'testuser',
          profile: { realName: 'Test User' },
        },
      },
    };

    global.fetch = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue(mockData),
    });

    const formatData = vi.fn((data: never) => ({
      username: data.matchedUser.username,
      name: data.matchedUser.profile.realName,
    }));

    await fetchUserDetails(
      { username: 'testuser', limit: 20, year: 2024 },
      mockRes as Response,
      'query { matchedUser }',
      formatData,
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
          limit: 20,
          year: 2024,
        },
      }),
    });

    expect(formatData).toHaveBeenCalledWith(mockData.data);
    expect(jsonSpy).toHaveBeenCalledWith({
      username: 'testuser',
      name: 'Test User',
    });
  });

  it('should return raw data when formatData is not provided', async () => {
    const mockData = {
      data: {
        matchedUser: {
          username: 'testuser',
        },
      },
    };

    global.fetch = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue(mockData),
    });

    await fetchUserDetails(
      { username: 'testuser', limit: 20, year: 2024 },
      mockRes as Response,
      'query { matchedUser }',
    );

    expect(jsonSpy).toHaveBeenCalledWith(mockData.data);
  });

  it('should handle GraphQL errors from LeetCode API', async () => {
    const mockErrorResponse = {
      errors: [
        {
          message: 'User not found',
          locations: [{ line: 1, column: 1 }],
        },
      ],
    };

    global.fetch = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue(mockErrorResponse),
    });

    await fetchUserDetails(
      { username: 'nonexistent', limit: 20, year: 2024 },
      mockRes as Response,
      'query { matchedUser }',
    );

    expect(sendSpy).toHaveBeenCalledWith(mockErrorResponse);
    expect(jsonSpy).not.toHaveBeenCalled();
  });

  it('should handle network errors', async () => {
    const networkError = new Error('Network error');
    global.fetch = vi.fn().mockRejectedValue(networkError);

    await fetchUserDetails(
      { username: 'testuser', limit: 20, year: 2024 },
      mockRes as Response,
      'query { matchedUser }',
    );

    expect(sendSpy).toHaveBeenCalledWith('Network error');
  });

  it('should handle null formatData explicitly', async () => {
    const mockData = {
      data: {
        matchedUser: {
          username: 'testuser',
        },
      },
    };

    global.fetch = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue(mockData),
    });

    await fetchUserDetails(
      { username: 'testuser', limit: 20, year: 2024 },
      mockRes as Response,
      'query { matchedUser }',
      undefined,
    );

    expect(jsonSpy).toHaveBeenCalledWith(mockData.data);
  });

  it('should handle empty response data', async () => {
    const mockData = { data: {} };

    global.fetch = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue(mockData),
    });

    const formatData = vi.fn((data: never) => data);

    await fetchUserDetails(
      { username: 'testuser', limit: 20, year: 2024 },
      mockRes as Response,
      'query { matchedUser }',
      formatData,
    );

    expect(formatData).toHaveBeenCalledWith({});
    expect(jsonSpy).toHaveBeenCalledWith({});
  });

  it('should pass correct parameters for submission queries', async () => {
    const mockData = { data: { recentSubmissions: [] } };

    global.fetch = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue(mockData),
    });

    await fetchUserDetails(
      { username: 'testuser', limit: 50, year: 2024 },
      mockRes as Response,
      'query { recentSubmissions }',
    );

    expect(global.fetch).toHaveBeenCalledWith(
      'https://leetcode.com/graphql',
      expect.objectContaining({
        body: JSON.stringify({
          query: 'query { recentSubmissions }',
          variables: {
            username: 'testuser',
            limit: 50,
            year: 2024,
          },
        }),
      }),
    );
  });

  it('should pass correct year parameter for calendar queries', async () => {
    const mockData = { data: { calendar: {} } };

    global.fetch = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue(mockData),
    });

    await fetchUserDetails(
      { username: 'testuser', limit: 20, year: 2023 },
      mockRes as Response,
      'query { calendar }',
    );

    expect(global.fetch).toHaveBeenCalledWith(
      'https://leetcode.com/graphql',
      expect.objectContaining({
        body: JSON.stringify({
          query: 'query { calendar }',
          variables: {
            username: 'testuser',
            limit: 20,
            year: 2023,
          },
        }),
      }),
    );
  });
});
