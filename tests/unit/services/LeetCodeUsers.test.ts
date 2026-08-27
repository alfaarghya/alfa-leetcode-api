import * as msw from 'msw';
import { describe, expect, it } from 'vitest';
import { LeetCodeUsers } from '../../../src/services/LeetCodeUsers';
import { server } from '../../msw/server';

const USERNAME = 'jambobjones';

describe('LeetCodeUsers', () => {
  describe('getProfile', () => {
    it('maps GraphQL user profile into a graft-safe UserProfileSummary DTO', async () => {
      const profile = await LeetCodeUsers.getProfile(USERNAME);

      expect(profile).toEqual({
        username: 'jambobjones',
        name: 'Jambob Jones',
        birthday: '',
        avatarUrl:
          'https://assets.leetcode.com/users/jambobjones/avatar_1617850141.png',
        ranking: 630800,
        reputation: 0,
        contributionPoints: 115,
        gitHubUrl: 'https://github.com/jambobjones',
        twitterUrl: '',
        linkedInUrl: '',
        websites: [],
        country: '',
        company: '',
        school: '',
        skillTags: [],
        aboutMe: '',
      });
    });

    it('throws a plain error for an unknown username instead of a custom exception type', async () => {
      // Graftcode does not generate grafts for custom exception types (see
      // src/internal/graphqlClient.ts), so this must stay a plain Error - the
      // gateway converts it into a plain error on the caller either way.
      server.use(
        msw.http.post('https://leetcode.com/graphql', () =>
          msw.HttpResponse.json({ data: { matchedUser: null } }),
        ),
      );

      await expect(LeetCodeUsers.getProfile('nobody')).rejects.toThrow(
        'LeetCode user "nobody" was not found',
      );
    });
  });

  describe('getBadges', () => {
    it('maps GraphQL badges into a graft-safe UserBadges DTO', async () => {
      const badges = await LeetCodeUsers.getBadges(USERNAME);

      expect(badges).toEqual({
        badgeCount: 0,
        badges: [],
        upcomingBadges: [
          {
            name: 'Mar LeetCoding Challenge',
            icon: '/static/images/badges/dcc-2024-3.png',
          },
        ],
        activeBadgeName: '',
      });
    });
  });

  describe('getSolvedProblems', () => {
    it('maps GraphQL submit stats into a graft-safe SolvedProblemsSummary DTO', async () => {
      const solved = await LeetCodeUsers.getSolvedProblems(USERNAME);

      expect(solved.totalSolved).toBe(133);
      expect(solved.easySolved).toBe(122);
      expect(solved.mediumSolved).toBe(11);
      expect(solved.hardSolved).toBe(0);
      expect(solved.acceptedByDifficulty).toEqual([
        { difficulty: 'All', count: 133, submissions: 215 },
        { difficulty: 'Easy', count: 122, submissions: 202 },
        { difficulty: 'Medium', count: 11, submissions: 13 },
        { difficulty: 'Hard', count: 0, submissions: 0 },
      ]);
    });
  });

  describe('getRecentSubmissions', () => {
    it('maps GraphQL recent submissions into graft-safe Submission DTOs with ISO-8601 timestamps', async () => {
      const submissions = await LeetCodeUsers.getRecentSubmissions(
        USERNAME,
        20,
      );

      expect(submissions[0]).toEqual({
        title: 'Generate a String With Characters That Have Odd Counts',
        titleSlug: 'generate-a-string-with-characters-that-have-odd-counts',
        submittedAt: new Date(1705161771 * 1000).toISOString(),
        statusDisplay: 'Accepted',
        language: 'javascript',
      });
      expect(submissions).toHaveLength(20);
    });
  });

  describe('getRecentAcceptedSubmissions', () => {
    it('maps GraphQL accepted submissions into graft-safe Submission DTOs', async () => {
      const submissions = await LeetCodeUsers.getRecentAcceptedSubmissions(
        USERNAME,
        20,
      );

      expect(submissions.every((s) => s.statusDisplay === 'Accepted')).toBe(
        true,
      );
      expect(submissions[0].titleSlug).toBe(
        'generate-a-string-with-characters-that-have-odd-counts',
      );
    });
  });

  describe('getSubmissionCalendar', () => {
    it('maps GraphQL user calendar into a graft-safe SubmissionCalendar DTO', async () => {
      const calendar = await LeetCodeUsers.getSubmissionCalendar(
        USERNAME,
        2024,
      );

      expect(calendar.activeYears).toEqual([2023, 2024]);
      expect(calendar.streak).toBe(5);
      expect(calendar.totalActiveDays).toBe(120);
      expect(calendar.dailyCodingChallengeBadges).toEqual([
        {
          earnedAt: new Date(1704153600 * 1000).toISOString(),
          badgeName: 'Jan LeetCoding Challenge',
          badgeIcon: '/static/images/badges/dcc-2024-1.png',
        },
      ]);
      // Left as an opaque JSON string on purpose - see src/services/dto.ts.
      expect(typeof calendar.submissionCalendarJson).toBe('string');
      expect(JSON.parse(calendar.submissionCalendarJson)).toHaveProperty(
        '1704153600',
        24,
      );
    });
  });

  describe('getSkillStats', () => {
    it('maps GraphQL skill stats into a graft-safe SkillStatsSummary DTO', async () => {
      const stats = await LeetCodeUsers.getSkillStats(USERNAME);

      expect(stats.fundamental).toEqual([
        { tagName: 'String', tagSlug: 'string', problemsSolved: 55 },
        { tagName: 'Math', tagSlug: 'math', problemsSolved: 40 },
      ]);
      expect(stats.intermediate).toHaveLength(2);
      expect(stats.advanced).toHaveLength(2);
    });
  });

  describe('getLanguageStats', () => {
    it('maps GraphQL language stats into graft-safe LanguageStat DTOs', async () => {
      const stats = await LeetCodeUsers.getLanguageStats(USERNAME);

      expect(stats).toEqual([
        { languageName: 'JavaScript', problemsSolved: 45 },
        { languageName: 'Python', problemsSolved: 32 },
        { languageName: 'TypeScript', problemsSolved: 28 },
        { languageName: 'Java', problemsSolved: 15 },
      ]);
    });
  });

  describe('getProgress', () => {
    it('maps GraphQL question progress into a graft-safe ProgressSummary DTO', async () => {
      const progress = await LeetCodeUsers.getProgress(USERNAME);

      expect(progress.accepted).toEqual([
        { difficulty: 'Easy', count: 122 },
        { difficulty: 'Medium', count: 45 },
        { difficulty: 'Hard', count: 8 },
      ]);
      expect(progress.beatsPercentage).toEqual([
        { difficulty: 'Easy', percentage: 75.5 },
        { difficulty: 'Medium', percentage: 65.2 },
        { difficulty: 'Hard', percentage: 55.8 },
      ]);
    });
  });

  describe('getContestSummary', () => {
    it('defaults every field when the user has no contest ranking', async () => {
      // The fixture's userContestRanking is null for this query.
      const summary = await LeetCodeUsers.getContestSummary(USERNAME);

      expect(summary).toEqual({
        attendedContestsCount: 0,
        rating: 0,
        globalRanking: 0,
        totalParticipants: 0,
        topPercentage: 0,
        badgeName: '',
      });
    });
  });

  describe('getContestHistory', () => {
    it('maps GraphQL contest ranking history into graft-safe ContestHistoryEntry DTOs', async () => {
      const history = await LeetCodeUsers.getContestHistory(USERNAME);

      expect(history).toEqual([
        {
          contestTitle: 'Biweekly Contest 52',
          startedAt: new Date(1621089000 * 1000).toISOString(),
          attended: false,
          rating: 1500,
          ranking: 0,
          trendDirection: 'NONE',
          problemsSolved: 0,
          totalProblems: 3,
          finishTimeInSeconds: 0,
        },
      ]);
    });
  });
});
