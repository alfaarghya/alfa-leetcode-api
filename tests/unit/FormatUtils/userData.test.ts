import { describe, expect, it } from 'vitest';
import {
  formatAcSubmissionData,
  formatBadgesData,
  formatContestData,
  formatContestHistoryData,
  formatLanguageStats,
  formatSkillStats,
  formatSolvedProblemsData,
  formatSubmissionCalendarData,
  formatSubmissionData,
  formatUserData,
} from '../../../src/FormatUtils/userData';

describe('userData FormatUtils', () => {
  describe('formatUserData', () => {
    it('should format complete user data correctly', () => {
      const input = {
        matchedUser: {
          username: 'testuser',
          profile: {
            realName: 'Test User',
            birthday: '1990-01-01',
            userAvatar: 'https://example.com/avatar.png',
            ranking: 12345,
            reputation: 100,
            countryName: 'United States',
            company: 'Test Company',
            school: 'Test University',
            skillTags: ['JavaScript', 'Python'],
            aboutMe: 'I love coding',
            websites: ['https://example.com'],
          },
          githubUrl: 'https://github.com/testuser',
          twitterUrl: 'https://twitter.com/testuser',
          linkedinUrl: 'https://linkedin.com/in/testuser',
        },
      };

      const result = formatUserData(input as never);

      expect(result).toEqual({
        username: 'testuser',
        name: 'Test User',
        birthday: '1990-01-01',
        avatar: 'https://example.com/avatar.png',
        ranking: 12345,
        reputation: 100,
        gitHub: 'https://github.com/testuser',
        twitter: 'https://twitter.com/testuser',
        linkedIN: 'https://linkedin.com/in/testuser',
        website: ['https://example.com'],
        country: 'United States',
        company: 'Test Company',
        school: 'Test University',
        skillTags: ['JavaScript', 'Python'],
        about: 'I love coding',
      });
    });

    it('should handle null values in user data', () => {
      const input = {
        matchedUser: {
          username: 'testuser',
          profile: {
            realName: null,
            birthday: null,
            userAvatar: null,
            ranking: null,
            reputation: null,
            countryName: null,
            company: null,
            school: null,
            skillTags: [],
            aboutMe: null,
            websites: [],
          },
          githubUrl: null,
          twitterUrl: null,
          linkedinUrl: null,
        },
      };

      const result = formatUserData(input as never);

      expect(result.username).toBe('testuser');
      expect(result.name).toBeNull();
      expect(result.skillTags).toEqual([]);
    });

    it('should handle empty strings in user data', () => {
      const input = {
        matchedUser: {
          username: 'testuser',
          profile: {
            realName: '',
            birthday: '',
            userAvatar: '',
            ranking: 0,
            reputation: 0,
            countryName: '',
            company: '',
            school: '',
            skillTags: [],
            aboutMe: '',
            websites: [],
          },
          githubUrl: '',
          twitterUrl: '',
          linkedinUrl: '',
        },
      };

      const result = formatUserData(input as never);

      expect(result.name).toBe('');
      expect(result.company).toBe('');
      expect(result.ranking).toBe(0);
    });
  });

  describe('formatBadgesData', () => {
    it('should format badges data correctly', () => {
      const input = {
        matchedUser: {
          badges: [
            { id: '1', displayName: 'Badge 1' },
            { id: '2', displayName: 'Badge 2' },
          ],
          upcomingBadges: [{ id: '3', displayName: 'Upcoming Badge' }],
          activeBadge: { id: '1', displayName: 'Active Badge' },
        },
      };

      const result = formatBadgesData(input as never);

      expect(result).toEqual({
        badgesCount: 2,
        badges: input.matchedUser.badges,
        upcomingBadges: input.matchedUser.upcomingBadges,
        activeBadge: input.matchedUser.activeBadge,
      });
    });

    it('should handle empty badges array', () => {
      const input = {
        matchedUser: {
          badges: [],
          upcomingBadges: [],
          activeBadge: null,
        },
      };

      const result = formatBadgesData(input as never);

      expect(result.badgesCount).toBe(0);
      expect(result.badges).toEqual([]);
    });
  });

  describe('formatContestData', () => {
    it('should format contest data correctly', () => {
      const input = {
        userContestRanking: {
          attendedContestsCount: 10,
          rating: 1500.5,
          globalRanking: 5000,
          totalParticipants: 100000,
          topPercentage: 5.0,
          badge: { name: 'Knight' },
        },
        userContestRankingHistory: [
          { contest: { title: 'Contest 1' }, attended: true },
          { contest: { title: 'Contest 2' }, attended: false },
          { contest: { title: 'Contest 3' }, attended: true },
        ],
      };

      const result = formatContestData(input as never);

      expect(result.contestAttend).toBe(10);
      expect(result.contestRating).toBe(1500.5);
      expect(result.contestParticipation).toHaveLength(2);
      expect(result.contestParticipation.every((c: never) => c.attended)).toBe(
        true,
      );
    });

    it('should handle null userContestRanking', () => {
      const input = {
        userContestRanking: null,
        userContestRankingHistory: [],
      };

      const result = formatContestData(input as never);

      expect(result.contestAttend).toBeUndefined();
      expect(result.contestParticipation).toEqual([]);
    });
  });

  describe('formatContestHistoryData', () => {
    it('should format contest history correctly', () => {
      const input = {
        userContestRankingHistory: [
          { contest: { title: 'Contest 1' } },
          { contest: { title: 'Contest 2' } },
          { contest: { title: 'Contest 3' } },
        ],
      };

      const result = formatContestHistoryData(input as never);

      expect(result.count).toBe(3);
      expect(result.contestHistory).toEqual(input.userContestRankingHistory);
    });

    it('should handle empty contest history', () => {
      const input = {
        userContestRankingHistory: [],
      };

      const result = formatContestHistoryData(input as never);

      expect(result.count).toBe(0);
      expect(result.contestHistory).toEqual([]);
    });
  });

  describe('formatSolvedProblemsData', () => {
    it('should format solved problems data correctly', () => {
      const input = {
        matchedUser: {
          submitStats: {
            acSubmissionNum: [
              { difficulty: 'All', count: 500 },
              { difficulty: 'Easy', count: 200 },
              { difficulty: 'Medium', count: 200 },
              { difficulty: 'Hard', count: 100 },
            ],
            totalSubmissionNum: [{ difficulty: 'All', count: 1000 }],
          },
        },
      };

      const result = formatSolvedProblemsData(input as never);

      expect(result.solvedProblem).toBe(500);
      expect(result.easySolved).toBe(200);
      expect(result.mediumSolved).toBe(200);
      expect(result.hardSolved).toBe(100);
      expect(result.totalSubmissionNum).toEqual(
        input.matchedUser.submitStats.totalSubmissionNum,
      );
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
        },
      };

      const result = formatSolvedProblemsData(input as never);

      expect(result.solvedProblem).toBe(0);
      expect(result.easySolved).toBe(0);
    });
  });

  describe('formatSubmissionData', () => {
    it('should format submission data correctly', () => {
      const input = {
        recentSubmissionList: [
          { id: '1', title: 'Two Sum' },
          { id: '2', title: 'Add Two Numbers' },
        ],
      };

      const result = formatSubmissionData(input as never);

      expect(result.count).toBe(2);
      expect(result.submission).toEqual(input.recentSubmissionList);
    });

    it('should handle empty submission list', () => {
      const input = {
        recentSubmissionList: [],
      };

      const result = formatSubmissionData(input as never);

      expect(result.count).toBe(0);
      expect(result.submission).toEqual([]);
    });
  });

  describe('formatAcSubmissionData', () => {
    it('should format AC submission data correctly', () => {
      const input = {
        recentAcSubmissionList: [
          { id: '1', status: 'Accepted' },
          { id: '2', status: 'Accepted' },
        ],
      };

      const result = formatAcSubmissionData(input as never);

      expect(result.count).toBe(2);
      expect(result.submission).toEqual(input.recentAcSubmissionList);
    });

    it('should handle empty AC submission list', () => {
      const input = {
        recentAcSubmissionList: [],
      };

      const result = formatAcSubmissionData(input as never);

      expect(result.count).toBe(0);
      expect(result.submission).toEqual([]);
    });
  });

  describe('formatSubmissionCalendarData', () => {
    it('should format submission calendar data correctly', () => {
      const input = {
        matchedUser: {
          userCalendar: {
            activeYears: [2023, 2024],
            streak: 15,
            totalActiveDays: 100,
            dccBadge: [{ badge: 'Jan 2024' }],
            submissionCalendar: '{"1672531200":5,"1672617600":3}',
          },
        },
      };

      const result = formatSubmissionCalendarData(input as never);

      expect(result.activeYears).toEqual([2023, 2024]);
      expect(result.streak).toBe(15);
      expect(result.totalActiveDays).toBe(100);
      expect(result.submissionCalendar).toBe('{"1672531200":5,"1672617600":3}');
    });

    it('should handle empty calendar data', () => {
      const input = {
        matchedUser: {
          userCalendar: {
            activeYears: [],
            streak: 0,
            totalActiveDays: 0,
            dccBadge: [],
            submissionCalendar: '{}',
          },
        },
      };

      const result = formatSubmissionCalendarData(input as never);

      expect(result.activeYears).toEqual([]);
      expect(result.streak).toBe(0);
      expect(result.submissionCalendar).toBe('{}');
    });
  });

  describe('formatSkillStats', () => {
    it('should format skill stats correctly', () => {
      const input = {
        matchedUser: {
          tagProblemCounts: {
            fundamental: [
              { tagName: 'Array', problemsSolved: 50 },
              { tagName: 'String', problemsSolved: 40 },
            ],
            intermediate: [
              { tagName: 'Dynamic Programming', problemsSolved: 30 },
            ],
            advanced: [{ tagName: 'Graph', problemsSolved: 20 }],
          },
        },
      };

      const result = formatSkillStats(input as never);

      expect(result.fundamental).toHaveLength(2);
      expect(result.intermediate).toHaveLength(1);
      expect(result.advanced).toHaveLength(1);
    });

    it('should handle empty skill stats', () => {
      const input = {
        matchedUser: {
          tagProblemCounts: {
            fundamental: [],
            intermediate: [],
            advanced: [],
          },
        },
      };

      const result = formatSkillStats(input as never);

      expect(result.fundamental).toEqual([]);
      expect(result.intermediate).toEqual([]);
      expect(result.advanced).toEqual([]);
    });
  });

  describe('formatLanguageStats', () => {
    it('should format language stats correctly', () => {
      const input = {
        matchedUser: {
          languageProblemCount: [
            { languageName: 'JavaScript', problemsSolved: 100 },
            { languageName: 'Python', problemsSolved: 80 },
          ],
        },
      };

      const result = formatLanguageStats(input as never);

      expect(result.languageProblemCount).toHaveLength(2);
      expect(result.languageProblemCount[0].languageName).toBe('JavaScript');
    });

    it('should handle empty language stats', () => {
      const input = {
        matchedUser: {
          languageProblemCount: [],
        },
      };

      const result = formatLanguageStats(input as never);

      expect(result.languageProblemCount).toEqual([]);
    });
  });
});
