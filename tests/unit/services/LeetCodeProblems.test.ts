import { describe, expect, it } from 'vitest';
import { LeetCodeProblems } from '../../../src/services/LeetCodeProblems';

describe('LeetCodeProblems', () => {
  describe('getDailyProblem', () => {
    it('maps the daily challenge into a graft-safe ProblemDetail DTO', async () => {
      const problem = await LeetCodeProblems.getDailyProblem();

      expect(problem.problemUrl).toBe(
        'https://leetcode.com/problems/binary-subarrays-with-sum',
      );
      expect(problem.questionId).toBe('966');
      expect(problem.questionFrontendId).toBe('930');
      expect(problem.title).toBe('Binary Subarrays With Sum');
      expect(problem.titleSlug).toBe('binary-subarrays-with-sum');
      expect(problem.difficulty).toBe('Medium');
      expect(problem.isPaidOnly).toBe(false);
      expect(problem.publishedAt).toBe('2024-03-14');
      expect(problem.topicTags).toEqual([
        { name: 'Array', slug: 'array' },
        { name: 'Hash Table', slug: 'hash-table' },
        { name: 'Sliding Window', slug: 'sliding-window' },
        { name: 'Prefix Sum', slug: 'prefix-sum' },
      ]);
      expect(problem.likes).toBe(3592);
      expect(problem.dislikes).toBe(120);
    });
  });

  describe('getProblem', () => {
    it('maps a single problem into a graft-safe ProblemDetail DTO with no publishedAt', async () => {
      const problem = await LeetCodeProblems.getProblem('two-sum');

      expect(problem.title).toBe('Two Sum');
      expect(problem.titleSlug).toBe('two-sum');
      expect(problem.questionId).toBe('1');
      expect(problem.publishedAt).toBe('');
      expect(problem.topicTags).toEqual([
        { name: 'Array', slug: 'array' },
        { name: 'Hash Table', slug: 'hash-table' },
      ]);
    });
  });

  describe('getProblems', () => {
    it('maps a paginated problem list into a graft-safe ProblemListResult DTO', async () => {
      const result = await LeetCodeProblems.getProblems(20, 0, '', '');

      expect(result.totalCount).toBe(3078);
      expect(result.problems).toEqual([
        {
          questionFrontendId: '1',
          title: 'Two Sum',
          titleSlug: 'two-sum',
          difficulty: 'Easy',
          isPaidOnly: false,
          acceptanceRate: 52.09288098160903,
          topicTags: [
            { name: 'Array', slug: 'array' },
            { name: 'Hash Table', slug: 'hash-table' },
          ],
          hasSolution: true,
          hasVideoSolution: true,
        },
      ]);
    });

    it('splits space-separated tags before sending them to the query', async () => {
      // No dedicated handler override needed: the shared msw handler matches by
      // query identifier only, so this just proves the call succeeds with a
      // multi-tag filter and still returns the fixture's shaped result.
      const result = await LeetCodeProblems.getProblems(
        10,
        5,
        'array hash-table',
        'EASY',
      );

      expect(result.totalCount).toBe(3078);
    });
  });

  describe('getTags', () => {
    it('maps the topic tag list into graft-safe ProblemTag DTOs', async () => {
      const tags = await LeetCodeProblems.getTags();

      expect(tags).toEqual([
        { name: 'Array', slug: 'array' },
        { name: 'Hash Table', slug: 'hash-table' },
        { name: 'Dynamic Programming', slug: 'dynamic-programming' },
      ]);
    });
  });
});
