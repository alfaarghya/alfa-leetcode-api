import { describe, expect, it } from 'vitest';
import { formatSolvedQuestionsData } from '../../../src/FormatUtils/solvedQuestionsData';
import type { SolvedQuestion } from '../../../src/types';

const question: SolvedQuestion = {
  frontendId: '1',
  title: 'Two Sum',
  titleSlug: 'two-sum',
  difficulty: 'Easy',
  lastSubmittedAt: '2026-01-14T10:12:30+00:00',
  numSubmitted: 2,
  questionStatus: 'SOLVED',
  topicTags: [
    { name: 'Array', slug: 'array' },
    { name: 'Hash Table', slug: 'hash-table' },
  ],
};

describe('formatSolvedQuestionsData', () => {
  it('should report the returned count and the upstream total', () => {
    const result = formatSolvedQuestionsData([question], 2190);

    expect(result.count).toBe(1);
    expect(result.totalSolved).toBe(2190);
  });

  it('should map every question field', () => {
    const result = formatSolvedQuestionsData([question], 1);

    expect(result.solvedQuestions[0]).toEqual({
      questionFrontendId: '1',
      title: 'Two Sum',
      titleSlug: 'two-sum',
      link: 'https://leetcode.com/problems/two-sum',
      difficulty: 'Easy',
      lastSubmittedAt: '2026-01-14T10:12:30+00:00',
      numSubmitted: 2,
      topicTags: [
        { name: 'Array', slug: 'array' },
        { name: 'Hash Table', slug: 'hash-table' },
      ],
    });
  });

  it('should build a usable problem link from the slug', () => {
    const result = formatSolvedQuestionsData(
      [{ ...question, titleSlug: 'median-of-two-sorted-arrays' }],
      1,
    );

    expect(result.solvedQuestions[0].link).toBe(
      'https://leetcode.com/problems/median-of-two-sorted-arrays',
    );
  });

  it('should preserve the order it was given', () => {
    const result = formatSolvedQuestionsData(
      [
        { ...question, titleSlug: 'a' },
        { ...question, titleSlug: 'b' },
        { ...question, titleSlug: 'c' },
      ],
      3,
    );

    expect(result.solvedQuestions.map((q) => q.titleSlug)).toEqual([
      'a',
      'b',
      'c',
    ]);
  });

  it('should handle an empty solved list', () => {
    const result = formatSolvedQuestionsData([], 0);

    expect(result).toEqual({
      count: 0,
      totalSolved: 0,
      solvedQuestions: [],
    });
  });

  it('should not expose the raw questionStatus field', () => {
    const result = formatSolvedQuestionsData([question], 1);

    expect(result.solvedQuestions[0]).not.toHaveProperty('questionStatus');
  });
});
