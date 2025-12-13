import { describe, it, expect } from 'vitest';
import {
  formatDailyData,
  formatQuestionData,
  formatProblemsData,
} from '../../../src/FormatUtils/problemData';

describe('problemData FormatUtils', () => {
  describe('formatDailyData', () => {
    it('should format daily problem data correctly', () => {
      const input = {
        activeDailyCodingChallengeQuestion: {
          link: '/problems/two-sum/',
          date: '2024-01-15',
          question: {
            questionId: '1',
            questionFrontendId: '1',
            title: 'Two Sum',
            titleSlug: 'two-sum',
            difficulty: 'Easy',
            isPaidOnly: false,
            content: '<p>Given an array of integers...</p>',
            exampleTestcases: '[2,7,11,15]\n9',
            topicTags: [
              { name: 'Array', slug: 'array' },
              { name: 'Hash Table', slug: 'hash-table' },
            ],
            hints: ['Use a hash map', 'Think about complementary numbers'],
            solution: { id: '1', content: 'Solution content' },
            companyTagStats: '{"1":10,"2":5}',
            likes: 1000,
            dislikes: 50,
            similarQuestions: '[{"title":"Three Sum","titleSlug":"three-sum"}]',
          },
        },
      };

      const result = formatDailyData(input as any);

      expect(result).toEqual({
        questionLink: 'https://leetcode.com/problems/two-sum/',
        date: '2024-01-15',
        questionId: '1',
        questionFrontendId: '1',
        questionTitle: 'Two Sum',
        titleSlug: 'two-sum',
        difficulty: 'Easy',
        isPaidOnly: false,
        question: '<p>Given an array of integers...</p>',
        exampleTestcases: '[2,7,11,15]\n9',
        topicTags: [
          { name: 'Array', slug: 'array' },
          { name: 'Hash Table', slug: 'hash-table' },
        ],
        hints: ['Use a hash map', 'Think about complementary numbers'],
        solution: { id: '1', content: 'Solution content' },
        companyTagStats: '{"1":10,"2":5}',
        likes: 1000,
        dislikes: 50,
        similarQuestions: '[{"title":"Three Sum","titleSlug":"three-sum"}]',
      });
    });

    it('should handle paid-only problems', () => {
      const input = {
        activeDailyCodingChallengeQuestion: {
          link: '/problems/premium-problem/',
          date: '2024-01-15',
          question: {
            questionId: '100',
            questionFrontendId: '100',
            title: 'Premium Problem',
            titleSlug: 'premium-problem',
            difficulty: 'Hard',
            isPaidOnly: true,
            content: '<p>Premium content</p>',
            exampleTestcases: '',
            topicTags: [],
            hints: [],
            solution: null,
            companyTagStats: null,
            likes: 0,
            dislikes: 0,
            similarQuestions: '[]',
          },
        },
      };

      const result = formatDailyData(input as any);

      expect(result.isPaidOnly).toBe(true);
      expect(result.questionTitle).toBe('Premium Problem');
    });

    it('should handle problems with empty arrays and null values', () => {
      const input = {
        activeDailyCodingChallengeQuestion: {
          link: '/problems/simple-problem/',
          date: '2024-01-15',
          question: {
            questionId: '2',
            questionFrontendId: '2',
            title: 'Simple Problem',
            titleSlug: 'simple-problem',
            difficulty: 'Medium',
            isPaidOnly: false,
            content: '<p>Problem description</p>',
            exampleTestcases: '',
            topicTags: [],
            hints: [],
            solution: null,
            companyTagStats: null,
            likes: 100,
            dislikes: 5,
            similarQuestions: '[]',
          },
        },
      };

      const result = formatDailyData(input as any);

      expect(result.topicTags).toEqual([]);
      expect(result.hints).toEqual([]);
      expect(result.solution).toBeNull();
    });

    it('should handle links with and without trailing slash', () => {
      const input = {
        activeDailyCodingChallengeQuestion: {
          link: '/problems/test-problem',
          date: '2024-01-15',
          question: {
            questionId: '3',
            questionFrontendId: '3',
            title: 'Test Problem',
            titleSlug: 'test-problem',
            difficulty: 'Easy',
            isPaidOnly: false,
            content: '',
            exampleTestcases: '',
            topicTags: [],
            hints: [],
            solution: null,
            companyTagStats: null,
            likes: 0,
            dislikes: 0,
            similarQuestions: '',
          },
        },
      };

      const result = formatDailyData(input as any);

      expect(result.questionLink).toBe(
        'https://leetcode.com/problems/test-problem',
      );
    });
  });

  describe('formatQuestionData', () => {
    it('should format selected question data correctly', () => {
      const input = {
        question: {
          questionId: '1',
          questionFrontendId: '1',
          title: 'Two Sum',
          titleSlug: 'two-sum',
          difficulty: 'Easy',
          isPaidOnly: false,
          content: '<p>Given an array of integers...</p>',
          exampleTestcases: '[2,7,11,15]\n9',
          topicTags: [
            { name: 'Array', slug: 'array' },
            { name: 'Hash Table', slug: 'hash-table' },
          ],
          hints: ['Use a hash map'],
          solution: { id: '1', content: 'Solution' },
          companyTagStats: '{"1":10}',
          likes: 1000,
          dislikes: 50,
          similarQuestions: '[{"title":"Three Sum"}]',
        },
      };

      const result = formatQuestionData(input as any);

      expect(result).toEqual({
        link: 'https://leetcode.com/problems/two-sum',
        questionId: '1',
        questionFrontendId: '1',
        questionTitle: 'Two Sum',
        titleSlug: 'two-sum',
        difficulty: 'Easy',
        isPaidOnly: false,
        question: '<p>Given an array of integers...</p>',
        exampleTestcases: '[2,7,11,15]\n9',
        topicTags: [
          { name: 'Array', slug: 'array' },
          { name: 'Hash Table', slug: 'hash-table' },
        ],
        hints: ['Use a hash map'],
        solution: { id: '1', content: 'Solution' },
        companyTagStats: '{"1":10}',
        likes: 1000,
        dislikes: 50,
        similarQuestions: '[{"title":"Three Sum"}]',
      });
    });

    it('should construct link correctly with titleSlug', () => {
      const input = {
        question: {
          questionId: '10',
          questionFrontendId: '10',
          title: 'Add Two Numbers',
          titleSlug: 'add-two-numbers',
          difficulty: 'Medium',
          isPaidOnly: false,
          content: '',
          exampleTestcases: '',
          topicTags: [],
          hints: [],
          solution: null,
          companyTagStats: null,
          likes: 500,
          dislikes: 25,
          similarQuestions: '',
        },
      };

      const result = formatQuestionData(input as any);

      expect(result.link).toBe('https://leetcode.com/problems/add-two-numbers');
    });

    it('should handle question with no solution', () => {
      const input = {
        question: {
          questionId: '100',
          questionFrontendId: '100',
          title: 'No Solution Problem',
          titleSlug: 'no-solution-problem',
          difficulty: 'Hard',
          isPaidOnly: false,
          content: '<p>Hard problem</p>',
          exampleTestcases: '',
          topicTags: [],
          hints: [],
          solution: null,
          companyTagStats: null,
          likes: 50,
          dislikes: 10,
          similarQuestions: '',
        },
      };

      const result = formatQuestionData(input as any);

      expect(result.solution).toBeNull();
      expect(result.difficulty).toBe('Hard');
    });

    it('should handle questions with multiple topic tags', () => {
      const input = {
        question: {
          questionId: '5',
          questionFrontendId: '5',
          title: 'Multi-Tag Problem',
          titleSlug: 'multi-tag-problem',
          difficulty: 'Medium',
          isPaidOnly: false,
          content: '',
          exampleTestcases: '',
          topicTags: [
            { name: 'Array', slug: 'array' },
            { name: 'Dynamic Programming', slug: 'dynamic-programming' },
            { name: 'Binary Search', slug: 'binary-search' },
          ],
          hints: [],
          solution: null,
          companyTagStats: null,
          likes: 200,
          dislikes: 20,
          similarQuestions: '',
        },
      };

      const result = formatQuestionData(input as any);

      expect(result.topicTags).toHaveLength(3);
    });
  });

  describe('formatProblemsData', () => {
    it('should format problems list data correctly', () => {
      const input = {
        problemsetQuestionList: {
          total: 100,
          questions: [
            {
              questionId: '1',
              titleSlug: 'two-sum',
              title: 'Two Sum',
              difficulty: 'Easy',
            },
            {
              questionId: '2',
              titleSlug: 'add-two-numbers',
              title: 'Add Two Numbers',
              difficulty: 'Medium',
            },
            {
              questionId: '3',
              titleSlug: 'longest-substring',
              title: 'Longest Substring Without Repeating Characters',
              difficulty: 'Medium',
            },
          ],
        },
      };

      const result = formatProblemsData(input as any);

      expect(result).toEqual({
        totalQuestions: 100,
        count: 3,
        problemsetQuestionList: input.problemsetQuestionList.questions,
      });
    });

    it('should handle empty problems list', () => {
      const input = {
        problemsetQuestionList: {
          total: 0,
          questions: [],
        },
      };

      const result = formatProblemsData(input as any);

      expect(result.totalQuestions).toBe(0);
      expect(result.count).toBe(0);
      expect(result.problemsetQuestionList).toEqual([]);
    });

    it('should handle count mismatch scenarios', () => {
      const input = {
        problemsetQuestionList: {
          total: 2000,
          questions: [
            {
              questionId: '1',
              titleSlug: 'two-sum',
              title: 'Two Sum',
              difficulty: 'Easy',
            },
          ],
        },
      };

      const result = formatProblemsData(input as any);

      expect(result.totalQuestions).toBe(2000);
      expect(result.count).toBe(1);
    });

    it('should handle large question lists', () => {
      const questions = Array.from({ length: 50 }, (_, i) => ({
        questionId: String(i + 1),
        titleSlug: `problem-${i + 1}`,
        title: `Problem ${i + 1}`,
        difficulty: i % 3 === 0 ? 'Easy' : i % 3 === 1 ? 'Medium' : 'Hard',
      }));

      const input = {
        problemsetQuestionList: {
          total: 2000,
          questions,
        },
      };

      const result = formatProblemsData(input as any);

      expect(result.totalQuestions).toBe(2000);
      expect(result.count).toBe(50);
      expect(result.problemsetQuestionList).toHaveLength(50);
    });
  });
});
