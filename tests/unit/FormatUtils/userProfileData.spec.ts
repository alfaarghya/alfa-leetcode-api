import { describe, it, expect } from 'vitest';
import { formatUserProfileData } from '../../../src/FormatUtils/userProfileData';

describe('userProfileData FormatUtils', () => {
  describe('formatUserProfileData', () => {
    it('should format complete user profile data correctly', () => {
      const input = {
        matchedUser: {
          submitStats: {
            acSubmissionNum: [
              { difficulty: 'All', count: 500 },
              { difficulty: 'Easy', count: 200 },
              { difficulty: 'Medium', count: 200 },
              { difficulty: 'Hard', count: 100 },
            ],
            totalSubmissionNum: [
              { difficulty: 'All', count: 1000 },
              { difficulty: 'Easy', count: 400 },
              { difficulty: 'Medium', count: 400 },
              { difficulty: 'Hard', count: 200 },
            ],
          },
          profile: {
            ranking: 12345,
            reputation: 100,
          },
          contributions: {
            points: 500,
          },
          submissionCalendar: '{"1672531200":5,"1672617600":3}',
        },
        allQuestionsCount: [
          { difficulty: 'All', count: 2500 },
          { difficulty: 'Easy', count: 800 },
          { difficulty: 'Medium', count: 1200 },
          { difficulty: 'Hard', count: 500 },
        ],
        recentSubmissionList: [
          { id: '1', title: 'Two Sum', status: 'Accepted' },
          { id: '2', title: 'Add Two Numbers', status: 'Accepted' },
        ],
      };

      const result = formatUserProfileData(input);

      expect(result).toEqual({
        totalSolved: 500,
        totalSubmissions: input.matchedUser.submitStats.totalSubmissionNum,
        totalQuestions: 2500,
        easySolved: 200,
        totalEasy: 800,
        mediumSolved: 200,
        totalMedium: 1200,
        hardSolved: 100,
        totalHard: 500,
        ranking: 12345,
        contributionPoint: 500,
        reputation: 100,
        submissionCalendar: { '1672531200': 5, '1672617600': 3 },
        recentSubmissions: input.recentSubmissionList,
        matchedUserStats: input.matchedUser.submitStats,
      });
    });

    it('should handle zero solved problems', () => {
      const input = {
        matchedUser: {
          submitStats: {
            acSubmissionNum: [
              { difficulty: 'All', count: 0 },
              { difficulty: 'Easy', count: 0 },
              { difficulty: 'Medium', count: 0 },
              { difficulty: 'Hard', count: 0 },
            ],
            totalSubmissionNum: [{ difficulty: 'All', count: 0 }],
          },
          profile: {
            ranking: 0,
            reputation: 0,
          },
          contributions: {
            points: 0,
          },
          submissionCalendar: '{}',
        },
        allQuestionsCount: [
          { difficulty: 'All', count: 2500 },
          { difficulty: 'Easy', count: 800 },
          { difficulty: 'Medium', count: 1200 },
          { difficulty: 'Hard', count: 500 },
        ],
        recentSubmissionList: [],
      };

      const result = formatUserProfileData(input);

      expect(result.totalSolved).toBe(0);
      expect(result.easySolved).toBe(0);
      expect(result.mediumSolved).toBe(0);
      expect(result.hardSolved).toBe(0);
      expect(result.recentSubmissions).toEqual([]);
      expect(result.submissionCalendar).toEqual({});
    });

    it('should parse submission calendar JSON correctly', () => {
      const input = {
        matchedUser: {
          submitStats: {
            acSubmissionNum: [
              { difficulty: 'All', count: 100 },
              { difficulty: 'Easy', count: 50 },
              { difficulty: 'Medium', count: 30 },
              { difficulty: 'Hard', count: 20 },
            ],
            totalSubmissionNum: [],
          },
          profile: {
            ranking: 1000,
            reputation: 50,
          },
          contributions: {
            points: 200,
          },
          submissionCalendar: '{"1672531200":10,"1672617600":5,"1672704000":8}',
        },
        allQuestionsCount: [
          { difficulty: 'All', count: 2500 },
          { difficulty: 'Easy', count: 800 },
          { difficulty: 'Medium', count: 1200 },
          { difficulty: 'Hard', count: 500 },
        ],
        recentSubmissionList: [],
      };

      const result = formatUserProfileData(input);

      expect(result.submissionCalendar).toEqual({
        '1672531200': 10,
        '1672617600': 5,
        '1672704000': 8,
      });
      expect(typeof result.submissionCalendar).toBe('object');
    });

    it('should handle empty submission calendar', () => {
      const input = {
        matchedUser: {
          submitStats: {
            acSubmissionNum: [
              { difficulty: 'All', count: 50 },
              { difficulty: 'Easy', count: 20 },
              { difficulty: 'Medium', count: 20 },
              { difficulty: 'Hard', count: 10 },
            ],
            totalSubmissionNum: [],
          },
          profile: {
            ranking: 5000,
            reputation: 10,
          },
          contributions: {
            points: 50,
          },
          submissionCalendar: '{}',
        },
        allQuestionsCount: [
          { difficulty: 'All', count: 2500 },
          { difficulty: 'Easy', count: 800 },
          { difficulty: 'Medium', count: 1200 },
          { difficulty: 'Hard', count: 500 },
        ],
        recentSubmissionList: [],
      };

      const result = formatUserProfileData(input);

      expect(result.submissionCalendar).toEqual({});
    });

    it('should include complete submit stats object', () => {
      const submitStats = {
        acSubmissionNum: [
          { difficulty: 'All', count: 300 },
          { difficulty: 'Easy', count: 100 },
          { difficulty: 'Medium', count: 150 },
          { difficulty: 'Hard', count: 50 },
        ],
        totalSubmissionNum: [{ difficulty: 'All', count: 600 }],
      };

      const input = {
        matchedUser: {
          submitStats,
          profile: {
            ranking: 2000,
            reputation: 75,
          },
          contributions: {
            points: 300,
          },
          submissionCalendar: '{}',
        },
        allQuestionsCount: [
          { difficulty: 'All', count: 2500 },
          { difficulty: 'Easy', count: 800 },
          { difficulty: 'Medium', count: 1200 },
          { difficulty: 'Hard', count: 500 },
        ],
        recentSubmissionList: [],
      };

      const result = formatUserProfileData(input);

      expect(result.matchedUserStats).toEqual(submitStats);
    });

    it('should handle high contribution points', () => {
      const input = {
        matchedUser: {
          submitStats: {
            acSubmissionNum: [
              { difficulty: 'All', count: 1000 },
              { difficulty: 'Easy', count: 400 },
              { difficulty: 'Medium', count: 400 },
              { difficulty: 'Hard', count: 200 },
            ],
            totalSubmissionNum: [],
          },
          profile: {
            ranking: 100,
            reputation: 500,
          },
          contributions: {
            points: 10000,
          },
          submissionCalendar: '{}',
        },
        allQuestionsCount: [
          { difficulty: 'All', count: 2500 },
          { difficulty: 'Easy', count: 800 },
          { difficulty: 'Medium', count: 1200 },
          { difficulty: 'Hard', count: 500 },
        ],
        recentSubmissionList: [],
      };

      const result = formatUserProfileData(input);

      expect(result.contributionPoint).toBe(10000);
      expect(result.reputation).toBe(500);
      expect(result.ranking).toBe(100);
    });

    it('should handle large recent submissions list', () => {
      const recentSubmissions = Array.from({ length: 20 }, (_, i) => ({
        id: String(i + 1),
        title: `Problem ${i + 1}`,
        status: i % 2 === 0 ? 'Accepted' : 'Wrong Answer',
      }));

      const input = {
        matchedUser: {
          submitStats: {
            acSubmissionNum: [
              { difficulty: 'All', count: 200 },
              { difficulty: 'Easy', count: 100 },
              { difficulty: 'Medium', count: 70 },
              { difficulty: 'Hard', count: 30 },
            ],
            totalSubmissionNum: [],
          },
          profile: {
            ranking: 3000,
            reputation: 50,
          },
          contributions: {
            points: 150,
          },
          submissionCalendar: '{}',
        },
        allQuestionsCount: [
          { difficulty: 'All', count: 2500 },
          { difficulty: 'Easy', count: 800 },
          { difficulty: 'Medium', count: 1200 },
          { difficulty: 'Hard', count: 500 },
        ],
        recentSubmissionList: recentSubmissions,
      };

      const result = formatUserProfileData(input);

      expect(result.recentSubmissions).toHaveLength(20);
      expect(result.recentSubmissions[0].id).toBe('1');
    });
  });
});
