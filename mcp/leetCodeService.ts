import {
  formatAcSubmissionData,
  formatBadgesData,
  formatContestData,
  formatContestHistoryData,
  formatDailyData,
  formatLanguageStats,
  formatProblemsData,
  formatProgressStats,
  formatQuestionData,
  formatSolvedProblemsData,
  formatSubmissionCalendarData,
  formatSubmissionData,
  formatTrendingCategoryTopicData,
  formatSkillStats,
  formatUserData,
  formatUserProfileData,
} from '../src/FormatUtils';
import {
  AcSubmissionQuery,
  contestQuery,
  dailyProblemQuery,
  discussCommentsQuery,
  discussTopicQuery,
  getUserProfileQuery,
  languageStatsQuery,
  officialSolutionQuery,
  problemListQuery,
  selectProblemQuery,
  submissionQuery,
  trendingDiscussQuery,
  userProfileCalendarQuery,
  userProfileQuery,
  userQuestionProgressQuery,
  userContestRankingInfoQuery,
  skillStatsQuery,
} from '../src/GQLQueries';
import type {
  DailyProblemData,
  ProblemSetQuestionListData,
  SelectProblemData,
  TrendingDiscussionObject,
  UserData,
} from '../src/types';
import { executeGraphQL } from './serverUtils';
import { SubmissionArgs, CalendarArgs, ProblemArgs, DiscussCommentsArgs, Variables } from './types';

// Builds GraphQL variables by filtering out undefined, null, and NaN values.
function buildVariables(input: Record<string, unknown>): Variables {
  const result: Variables = {};
  for (const [key, value] of Object.entries(input)) {
    if (value !== undefined && value !== null && !(typeof value === 'number' && Number.isNaN(value))) {
      result[key] = value;
    }
  }
  return result;
}

// Retrieves the formatted user profile summary.
export async function getUserProfileSummary(username: string) {
  const data = await executeGraphQL(userProfileQuery, { username });
  return formatUserData(data as UserData);
}

// Retrieves the formatted user badges data.
export async function getUserBadges(username: string) {
  const data = await executeGraphQL(userProfileQuery, { username });
  return formatBadgesData(data as UserData);
}

// Retrieves the formatted user contest data.
export async function getUserContest(username: string) {
  const data = await executeGraphQL(contestQuery, { username });
  return formatContestData(data as UserData);
}

// Retrieves the formatted user contest history.
export async function getUserContestHistory(username: string) {
  const data = await executeGraphQL(contestQuery, { username });
  return formatContestHistoryData(data as UserData);
}

// Retrieves the formatted solved problems statistics.
export async function getSolvedProblems(username: string) {
  const data = await executeGraphQL(userProfileQuery, { username });
  return formatSolvedProblemsData(data as UserData);
}

// Retrieves recent submissions for a user.
export async function getRecentSubmission(args: SubmissionArgs) {
  const variables = buildVariables({ username: args.username, limit: args.limit });
  const data = await executeGraphQL(submissionQuery, variables);
  return formatSubmissionData(data as UserData);
}

// Retrieves recent accepted submissions for a user.
export async function getRecentAcSubmission(args: SubmissionArgs) {
  const variables = buildVariables({ username: args.username, limit: args.limit });
  const data = await executeGraphQL(AcSubmissionQuery, variables);
  return formatAcSubmissionData(data as UserData);
}

// Retrieves the submission calendar for a user in a given year.
export async function getSubmissionCalendar(args: CalendarArgs) {
  const variables = buildVariables({ username: args.username, year: args.year });
  const data = await executeGraphQL(userProfileCalendarQuery, variables);
  return formatSubmissionCalendarData(data as UserData);
}

// Retrieves the aggregated user profile data.
export async function getUserProfileAggregate(username: string) {
  const data = await executeGraphQL(getUserProfileQuery, { username });
  return formatUserProfileData(data);
}

// Retrieves the language statistics for a user.
export async function getLanguageStats(username: string) {
  const data = await executeGraphQL(languageStatsQuery, { username });
  return formatLanguageStats(data as UserData);
}

// Retrieves the skill statistics for a user.
export async function getSkillStats(username: string) {
  const data = await executeGraphQL(skillStatsQuery, { username });
  return formatSkillStats(data as UserData);
}

// Retrieves the daily problem.
export async function getDailyProblem() {
  const data = await executeGraphQL(dailyProblemQuery, {});
  return formatDailyData(data as DailyProblemData);
}

// Retrieves the raw daily problem data.
export async function getDailyProblemRaw() {
  return executeGraphQL(dailyProblemQuery, {});
}

// Retrieves a selected problem by title slug.
export async function getSelectProblem(titleSlug: string) {
  const data = await executeGraphQL(selectProblemQuery, { titleSlug });
  return formatQuestionData(data as SelectProblemData);
}

// Retrieves the raw data for a selected problem by title slug.
export async function getSelectProblemRaw(titleSlug: string) {
  return executeGraphQL(selectProblemQuery, { titleSlug });
}

// Retrieves a list of problems based on the given arguments.
export async function getProblemSet(args: ProblemArgs) {
  const limit = args.skip !== undefined && args.limit === undefined ? 1 : args.limit ?? 20;
  const skip = args.skip ?? 0;
  const tags = args.tags ? args.tags.split(' ') : [];
  const difficulty = args.difficulty ?? undefined;
  const variables = buildVariables({
    categorySlug: '',
    limit,
    skip,
    filters: {
      tags,
      difficulty,
    },
  });
  const data = await executeGraphQL(problemListQuery, variables);
  return formatProblemsData(data as ProblemSetQuestionListData);
}

// Retrieves the official solution for a problem.
export async function getOfficialSolution(titleSlug: string) {
  return executeGraphQL(officialSolutionQuery, { titleSlug });
}

// Retrieves trending discussion topics.
export async function getTrendingTopics(first: number) {
  const data = await executeGraphQL(trendingDiscussQuery, { first });
  return formatTrendingCategoryTopicData(data as TrendingDiscussionObject);
}

// Retrieves a discussion topic by ID.
export async function getDiscussTopic(topicId: number) {
  return executeGraphQL(discussTopicQuery, { topicId });
}

// Retrieves comments for a discussion topic.
export async function getDiscussComments(args: DiscussCommentsArgs) {
  const variables = buildVariables({
    topicId: args.topicId,
    orderBy: args.orderBy ?? 'newest_to_oldest',
    pageNo: args.pageNo ?? 1,
    numPerPage: args.numPerPage ?? 10,
  });
  return executeGraphQL(discussCommentsQuery, variables);
}

// Retrieves raw language statistics for a user.
export async function getLanguageStatsRaw(username: string) {
  return executeGraphQL(languageStatsQuery, { username });
}

// Retrieves raw submission calendar data for a user.
export async function getUserProfileCalendarRaw(args: CalendarArgs) {
  const variables = buildVariables({ username: args.username, year: args.year });
  return executeGraphQL(userProfileCalendarQuery, variables);
}

// Retrieves raw user profile data.
export async function getUserProfileRaw(username: string) {
  return executeGraphQL(getUserProfileQuery, { username });
}

// Retrieves the legacy daily problem data.
export async function getDailyProblemLegacy() {
  return executeGraphQL(dailyProblemQuery, {});
}

// Retrieves raw skill statistics for a user.
export async function getSkillStatsRaw(username: string) {
  return executeGraphQL(skillStatsQuery, { username });
}

// Retrieves the question progress for a user.
export async function getUserProgress(username: string) {
  const data = await executeGraphQL(userQuestionProgressQuery, { username });
  return formatProgressStats(data as UserData);
}

// Retrieves the contest ranking information for a user.
export async function getUserContestRankingInfo(username: string) {
  return executeGraphQL(userContestRankingInfoQuery, { username });
}

// Retrieves raw question progress data for a user.
export async function getUserProgressRaw(username: string) {
  return executeGraphQL(userQuestionProgressQuery, { username });
}
