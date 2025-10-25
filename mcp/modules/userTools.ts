import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import {
  getLanguageStats,
  getLanguageStatsRaw,
  getRecentAcSubmission,
  getRecentSubmission,
  getSkillStats,
  getSkillStatsRaw,
  getSolvedProblems,
  getSubmissionCalendar,
  getUserBadges,
  getUserContest,
  getUserContestHistory,
  getUserContestRankingInfo,
  getUserProfileAggregate,
  getUserProfileCalendarRaw,
  getUserProfileRaw,
  getUserProfileSummary,
  getUserProgress,
  getUserProgressRaw,
} from '../leetCodeService';
import { runTool, ToolModule } from '../serverUtils';

const usernameSchema = z.string();
const limitSchema = z.number().int().positive().max(50).optional();

export class UserToolsModule implements ToolModule {
  register(server: McpServer): void {
    server.registerTool(
      'leetcode_user_data',
      {
        title: 'User Profile Overview',
        description: 'Fetches the public profile for a LeetCode user',
        inputSchema: {
          username: usernameSchema,
        },
      },
      async ({ username }) => runTool(() => getUserProfileSummary(username)),
    );

    server.registerTool(
      'leetcode_user_badges',
      {
        title: 'User Badges',
        description: 'Retrieves earned and upcoming badges for a user',
        inputSchema: {
          username: usernameSchema,
        },
      },
      async ({ username }) => runTool(() => getUserBadges(username)),
    );

    server.registerTool(
      'leetcode_user_contest',
      {
        title: 'Contest Summary',
        description: 'Returns contest stats for a user',
        inputSchema: {
          username: usernameSchema,
        },
      },
      async ({ username }) => runTool(() => getUserContest(username)),
    );

    server.registerTool(
      'leetcode_user_contest_history',
      {
        title: 'Contest History',
        description: 'Returns contest participation history for a user',
        inputSchema: {
          username: usernameSchema,
        },
      },
      async ({ username }) => runTool(() => getUserContestHistory(username)),
    );

    server.registerTool(
      'leetcode_user_solved',
      {
        title: 'Solved Problem Stats',
        description: 'Summarizes solved problems for a user',
        inputSchema: {
          username: usernameSchema,
        },
      },
      async ({ username }) => runTool(() => getSolvedProblems(username)),
    );

    server.registerTool(
      'leetcode_user_submissions',
      {
        title: 'Recent Submissions',
        description: 'Lists recent submissions for a user',
        inputSchema: {
          username: usernameSchema,
          limit: limitSchema,
        },
      },
      async ({ username, limit }) => runTool(() => getRecentSubmission({ username, limit })),
    );

    server.registerTool(
      'leetcode_user_accepted_submissions',
      {
        title: 'Recent Accepted Submissions',
        description: 'Lists recent accepted submissions for a user',
        inputSchema: {
          username: usernameSchema,
          limit: limitSchema,
        },
      },
      async ({ username, limit }) => runTool(() => getRecentAcSubmission({ username, limit })),
    );

    server.registerTool(
      'leetcode_user_calendar',
      {
        title: 'Submission Calendar',
        description: 'Retrieves submission calendar data for a given year',
        inputSchema: {
          username: usernameSchema,
          year: z.number().int(),
        },
      },
      async ({ username, year }) => runTool(() => getSubmissionCalendar({ username, year })),
    );

    server.registerTool(
      'leetcode_user_skill_stats',
      {
        title: 'Skill Distribution',
        description: 'Returns skill category breakdown for a user',
        inputSchema: {
          username: usernameSchema,
        },
      },
      async ({ username }) => runTool(() => getSkillStats(username)),
    );

    server.registerTool(
      'leetcode_user_profile_aggregate',
      {
        title: 'Profile Aggregate',
        description: 'Retrieves aggregated profile metrics and submissions',
        inputSchema: {
          username: usernameSchema,
        },
      },
      async ({ username }) => runTool(() => getUserProfileAggregate(username)),
    );

    server.registerTool(
      'leetcode_user_language_stats',
      {
        title: 'Language Usage',
        description: 'Lists problems solved by language for a user',
        inputSchema: {
          username: usernameSchema,
        },
      },
      async ({ username }) => runTool(() => getLanguageStats(username)),
    );

    server.registerTool(
      'leetcode_user_progress',
      {
        title: 'Question Progress',
        description: 'Summarizes accepted, failed, and untouched questions',
        inputSchema: {
          username: usernameSchema,
        },
      },
      async ({ username }) => runTool(() => getUserProgress(username)),
    );

    server.registerTool(
      'leetcode_user_language_stats_raw',
      {
        title: 'Language Usage Raw',
        description: 'Retrieves raw language usage data',
        inputSchema: {
          username: usernameSchema,
        },
      },
      async ({ username }) => runTool(() => getLanguageStatsRaw(username)),
    );

    server.registerTool(
      'leetcode_user_calendar_raw',
      {
        title: 'Submission Calendar Raw',
        description: 'Retrieves raw submission calendar data',
        inputSchema: {
          username: usernameSchema,
          year: z.number().int(),
        },
      },
      async ({ username, year }) => runTool(() => getUserProfileCalendarRaw({ username, year })),
    );

    server.registerTool(
      'leetcode_user_profile_raw',
      {
        title: 'Profile Aggregate Raw',
        description: 'Retrieves raw aggregated profile data',
        inputSchema: {
          username: usernameSchema,
        },
      },
      async ({ username }) => runTool(() => getUserProfileRaw(username)),
    );

    server.registerTool(
      'leetcode_user_skill_stats_raw',
      {
        title: 'Skill Distribution Raw',
        description: 'Retrieves raw skill distribution data',
        inputSchema: {
          username: usernameSchema,
        },
      },
      async ({ username }) => runTool(() => getSkillStatsRaw(username)),
    );

    server.registerTool(
      'leetcode_user_contest_ranking_info',
      {
        title: 'Contest Ranking Info Raw',
        description: 'Retrieves contest ranking information',
        inputSchema: {
          username: usernameSchema,
        },
      },
      async ({ username }) => runTool(() => getUserContestRankingInfo(username)),
    );

    server.registerTool(
      'leetcode_user_progress_raw',
      {
        title: 'Question Progress Raw',
        description: 'Retrieves raw question progress data',
        inputSchema: {
          username: usernameSchema,
        },
      },
      async ({ username }) => runTool(() => getUserProgressRaw(username)),
    );
  }
}
