import type { Response } from 'express';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import fetchSolvedQuestions from '../../../src/Controllers/fetchSolvedQuestions';
import type { SolvedQuestion } from '../../../src/types';

const QUERY = 'query solvedQuestions { userProgressQuestionList }';
const CREDENTIALS = { session: 'session-token', csrfToken: 'csrf-token' };

const makeQuestion = (id: number): SolvedQuestion => ({
  frontendId: String(id),
  title: `Problem ${id}`,
  titleSlug: `problem-${id}`,
  difficulty: 'EASY',
  lastSubmittedAt: '2026-01-14T10:12:30+00:00',
  numSubmitted: 1,
  questionStatus: 'SOLVED',
  topicTags: [{ name: 'Array', slug: 'array' }],
});

const graphqlResponse = (questions: SolvedQuestion[], totalNum: number) => ({
  ok: true,
  status: 200,
  json: vi.fn().mockResolvedValue({
    data: { userProgressQuestionList: { totalNum, questions } },
  }),
});

describe('fetchSolvedQuestions', () => {
  let mockRes: Partial<Response>;
  let jsonSpy: ReturnType<typeof vi.fn>;
  let statusSpy: ReturnType<typeof vi.fn>;
  const formatData = vi.fn((questions, totalNum) => ({
    count: questions.length,
    totalSolved: totalNum,
  }));

  beforeEach(() => {
    jsonSpy = vi.fn();
    statusSpy = vi.fn().mockReturnValue({ json: jsonSpy });
    mockRes = {
      json: jsonSpy,
      status: statusSpy,
    };
    formatData.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return 503 when no session is configured', async () => {
    global.fetch = vi.fn();

    await fetchSolvedQuestions(
      mockRes as Response,
      QUERY,
      { session: '', csrfToken: '' },
      formatData,
    );

    expect(statusSpy).toHaveBeenCalledWith(503);
    expect(jsonSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'This route is not configured on the server',
      }),
    );
    expect(global.fetch).not.toHaveBeenCalled();
    expect(formatData).not.toHaveBeenCalled();
  });

  it('should send the session cookie and csrf header', async () => {
    global.fetch = vi
      .fn()
      .mockResolvedValue(graphqlResponse([makeQuestion(1)], 1));

    await fetchSolvedQuestions(
      mockRes as Response,
      QUERY,
      CREDENTIALS,
      formatData,
    );

    expect(global.fetch).toHaveBeenCalledWith(
      'https://leetcode.com/graphql',
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Referer: 'https://leetcode.com',
          Cookie: 'LEETCODE_SESSION=session-token; csrftoken=csrf-token',
          'x-csrftoken': 'csrf-token',
        },
      }),
    );
  });

  it('should omit csrf pieces when no csrf token is configured', async () => {
    global.fetch = vi
      .fn()
      .mockResolvedValue(graphqlResponse([makeQuestion(1)], 1));

    await fetchSolvedQuestions(
      mockRes as Response,
      QUERY,
      { session: 'session-token', csrfToken: '' },
      formatData,
    );

    const headers = vi.mocked(global.fetch).mock.calls[0][1]?.headers as Record<
      string,
      string
    >;
    expect(headers.Cookie).toBe('LEETCODE_SESSION=session-token');
    expect(headers['x-csrftoken']).toBeUndefined();
  });

  it('should request the SOLVED filter with pagination variables', async () => {
    global.fetch = vi
      .fn()
      .mockResolvedValue(graphqlResponse([makeQuestion(1)], 1));

    await fetchSolvedQuestions(
      mockRes as Response,
      QUERY,
      CREDENTIALS,
      formatData,
    );

    const body = JSON.parse(
      vi.mocked(global.fetch).mock.calls[0][1]?.body as string,
    );
    expect(body.query).toBe(QUERY);
    expect(body.variables.filters).toEqual({
      questionStatus: 'SOLVED',
      skip: 0,
      limit: 100,
    });
  });

  it('should format a single page of solved questions', async () => {
    const questions = [makeQuestion(1), makeQuestion(2)];
    global.fetch = vi.fn().mockResolvedValue(graphqlResponse(questions, 2));

    await fetchSolvedQuestions(
      mockRes as Response,
      QUERY,
      CREDENTIALS,
      formatData,
    );

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(formatData).toHaveBeenCalledWith(questions, 2);
    expect(jsonSpy).toHaveBeenCalledWith({ count: 2, totalSolved: 2 });
  });

  it('should page through until a short page is returned', async () => {
    const firstPage = Array.from({ length: 100 }, (_, i) => makeQuestion(i));
    const secondPage = [makeQuestion(100), makeQuestion(101)];

    global.fetch = vi
      .fn()
      .mockResolvedValueOnce(graphqlResponse(firstPage, 102))
      .mockResolvedValueOnce(graphqlResponse(secondPage, 102));

    await fetchSolvedQuestions(
      mockRes as Response,
      QUERY,
      CREDENTIALS,
      formatData,
    );

    expect(global.fetch).toHaveBeenCalledTimes(2);

    const secondBody = JSON.parse(
      vi.mocked(global.fetch).mock.calls[1][1]?.body as string,
    );
    expect(secondBody.variables.filters.skip).toBe(100);

    expect(formatData).toHaveBeenCalledWith([...firstPage, ...secondPage], 102);
  });

  it('should stop paging once totalNum is reached on a full page', async () => {
    const fullPage = Array.from({ length: 100 }, (_, i) => makeQuestion(i));
    global.fetch = vi.fn().mockResolvedValue(graphqlResponse(fullPage, 100));

    await fetchSolvedQuestions(
      mockRes as Response,
      QUERY,
      CREDENTIALS,
      formatData,
    );

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(formatData).toHaveBeenCalledWith(fullPage, 100);
  });

  it('should return 401 when LeetCode silently answers with null', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: vi
        .fn()
        .mockResolvedValue({ data: { userProgressQuestionList: null } }),
    });

    await fetchSolvedQuestions(
      mockRes as Response,
      QUERY,
      CREDENTIALS,
      formatData,
    );

    expect(statusSpy).toHaveBeenCalledWith(401);
    expect(jsonSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'LeetCode rejected the session cookie',
      }),
    );
    expect(formatData).not.toHaveBeenCalled();
  });

  it('should keep paging when LeetCode caps the page below the requested size', async () => {
    // LeetCode silently caps limit on some fields, so a 40-item answer to a
    // 100-item request must not be mistaken for the end of the list
    const cappedPage = Array.from({ length: 40 }, (_, i) => makeQuestion(i));
    const finalPage = Array.from({ length: 20 }, (_, i) =>
      makeQuestion(100 + i),
    );

    global.fetch = vi
      .fn()
      .mockResolvedValueOnce(graphqlResponse(cappedPage, 60))
      .mockResolvedValueOnce(graphqlResponse(finalPage, 60));

    await fetchSolvedQuestions(
      mockRes as Response,
      QUERY,
      CREDENTIALS,
      formatData,
    );

    expect(global.fetch).toHaveBeenCalledTimes(2);

    //second request must resume from 40, not from PAGE_SIZE
    const secondBody = JSON.parse(
      vi.mocked(global.fetch).mock.calls[1][1]?.body as string,
    );
    expect(secondBody.variables.filters.skip).toBe(40);

    expect(formatData).toHaveBeenCalledWith([...cappedPage, ...finalPage], 60);
  });

  it('should stop on an empty page even when totalNum overreports', async () => {
    const onlyPage = [makeQuestion(1), makeQuestion(2)];

    global.fetch = vi
      .fn()
      .mockResolvedValueOnce(graphqlResponse(onlyPage, 999))
      .mockResolvedValueOnce(graphqlResponse([], 999));

    await fetchSolvedQuestions(
      mockRes as Response,
      QUERY,
      CREDENTIALS,
      formatData,
    );

    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(formatData).toHaveBeenCalledWith(onlyPage, 999);
  });

  it('should keep paging on a full page when totalNum is not reported', async () => {
    const fullPage = Array.from({ length: 100 }, (_, i) => makeQuestion(i));

    global.fetch = vi
      .fn()
      .mockResolvedValueOnce(graphqlResponse(fullPage, 0))
      .mockResolvedValueOnce(graphqlResponse([], 0));

    await fetchSolvedQuestions(
      mockRes as Response,
      QUERY,
      CREDENTIALS,
      formatData,
    );

    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(formatData).toHaveBeenCalledWith(fullPage, 0);
  });

  it('should fall back to a short page when totalNum is not reported', async () => {
    const shortPage = [makeQuestion(1), makeQuestion(2)];
    global.fetch = vi.fn().mockResolvedValue(graphqlResponse(shortPage, 0));

    await fetchSolvedQuestions(
      mockRes as Response,
      QUERY,
      CREDENTIALS,
      formatData,
    );

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(formatData).toHaveBeenCalledWith(shortPage, 0);
  });

  it('should tolerate a page missing totalNum and questions', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({
        data: { userProgressQuestionList: {} },
      }),
    });

    await fetchSolvedQuestions(
      mockRes as Response,
      QUERY,
      CREDENTIALS,
      formatData,
    );

    expect(formatData).toHaveBeenCalledWith([], 0);
    expect(jsonSpy).toHaveBeenCalledWith({ count: 0, totalSolved: 0 });
  });

  it('should return 502 on GraphQL errors', async () => {
    const errors = [{ message: 'Something went wrong' }];
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({ errors }),
    });

    await fetchSolvedQuestions(
      mockRes as Response,
      QUERY,
      CREDENTIALS,
      formatData,
    );

    expect(statusSpy).toHaveBeenCalledWith(502);
    expect(jsonSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'LeetCode GraphQL responded with errors',
        details: errors,
      }),
    );
    expect(formatData).not.toHaveBeenCalled();
  });

  it('should log non-ok HTTP responses', async () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 503,
      json: vi.fn().mockResolvedValue({
        data: { userProgressQuestionList: { totalNum: 0, questions: [] } },
      }),
    });

    await fetchSolvedQuestions(
      mockRes as Response,
      QUERY,
      CREDENTIALS,
      formatData,
    );

    expect(consoleErrorSpy).toHaveBeenCalledWith('HTTP error! status: 503');
  });

  it('should return 500 on network errors', async () => {
    const networkError = new Error('Network error');
    global.fetch = vi.fn().mockRejectedValue(networkError);

    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    await fetchSolvedQuestions(
      mockRes as Response,
      QUERY,
      CREDENTIALS,
      formatData,
    );

    expect(consoleErrorSpy).toHaveBeenCalledWith('Error: ', networkError);
    expect(statusSpy).toHaveBeenCalledWith(500);
    expect(jsonSpy).toHaveBeenCalledWith({ error: 'Internal server error' });
  });

  it('should not leak the session token into the response', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: vi
        .fn()
        .mockResolvedValue({ data: { userProgressQuestionList: null } }),
    });

    await fetchSolvedQuestions(
      mockRes as Response,
      QUERY,
      CREDENTIALS,
      formatData,
    );

    expect(JSON.stringify(jsonSpy.mock.calls)).not.toContain('session-token');
  });
});
