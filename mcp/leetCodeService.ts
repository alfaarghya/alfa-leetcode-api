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

type SubmissionArgs = { username: string; limit?: number };
type CalendarArgs = { username: string; year: number };
type ProblemArgs = { limit?: number; skip?: number; tags?: string; difficulty?: string };
type DiscussCommentsArgs = { topicId: number; orderBy?: string; pageNo?: number; numPerPage?: number };

type Variables = Record<string, unknown>;

function buildVariables(input: Record<string, unknown>): Variables {
  const result: Variables = {};
  for (const [key, value] of Object.entries(input)) {
    if (value !== undefined && value !== null && !(typeof value === 'number' && Number.isNaN(value))) {
      result[key] = value;
    }
  }
  return result;
}

export async function getUserProfileSummary(username: string) {
  const data = await executeGraphQL(userProfileQuery, { username });
  return formatUserData(data as UserData);
}

export async function getUserBadges(username: string) {
  const data = await executeGraphQL(userProfileQuery, { username });
  return formatBadgesData(data as UserData);
}

export async function getUserContest(username: string) {
  const data = await executeGraphQL(contestQuery, { username });
  return formatContestData(data as UserData);
}

export async function getUserContestHistory(username: string) {
  const data = await executeGraphQL(contestQuery, { username });
  return formatContestHistoryData(data as UserData);
}

export async function getSolvedProblems(username: string) {
  const data = await executeGraphQL(userProfileQuery, { username });
  return formatSolvedProblemsData(data as UserData);
}

export async function getRecentSubmission(args: SubmissionArgs) {
  const variables = buildVariables({ username: args.username, limit: args.limit });
  const data = await executeGraphQL(submissionQuery, variables);
  return formatSubmissionData(data as UserData);
}

export async function getRecentAcSubmission(args: SubmissionArgs) {
  const variables = buildVariables({ username: args.username, limit: args.limit });
  const data = await executeGraphQL(AcSubmissionQuery, variables);
  return formatAcSubmissionData(data as UserData);
}

export async function getSubmissionCalendar(args: CalendarArgs) {
  const variables = buildVariables({ username: args.username, year: args.year });
  const data = await executeGraphQL(userProfileCalendarQuery, variables);
  return formatSubmissionCalendarData(data as UserData);
}

export async function getUserProfileAggregate(username: string) {
  const data = await executeGraphQL(getUserProfileQuery, { username });
  return formatUserProfileData(data);
}

export async function getLanguageStats(username: string) {
  const data = await executeGraphQL(languageStatsQuery, { username });
  return formatLanguageStats(data as UserData);
}

export async function getSkillStats(username: string) {
  const data = await executeGraphQL(skillStatsQuery, { username });
  return formatSkillStats(data as UserData);
}

export async function getDailyProblem() {
  const data = await executeGraphQL(dailyProblemQuery, {});
  return formatDailyData(data as DailyProblemData);
}

export async function getDailyProblemRaw() {
  return executeGraphQL(dailyProblemQuery, {});
}

export async function getSelectProblem(titleSlug: string) {
  const data = await executeGraphQL(selectProblemQuery, { titleSlug });
  return formatQuestionData(data as SelectProblemData);
}

export async function getSelectProblemRaw(titleSlug: string) {
  return executeGraphQL(selectProblemQuery, { titleSlug });
}

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

export async function getOfficialSolution(titleSlug: string) {
  return executeGraphQL(officialSolutionQuery, { titleSlug });
}

export async function getTrendingTopics(first: number) {
  const data = await executeGraphQL(trendingDiscussQuery, { first });
  return formatTrendingCategoryTopicData(data as TrendingDiscussionObject);
}

export async function getDiscussTopic(topicId: number) {
  return executeGraphQL(discussTopicQuery, { topicId });
}

export async function getDiscussComments(args: DiscussCommentsArgs) {
  const variables = buildVariables({
    topicId: args.topicId,
    orderBy: args.orderBy ?? 'newest_to_oldest',
    pageNo: args.pageNo ?? 1,
    numPerPage: args.numPerPage ?? 10,
  });
  return executeGraphQL(discussCommentsQuery, variables);
}

export async function getLanguageStatsRaw(username: string) {
  return executeGraphQL(languageStatsQuery, { username });
}

export async function getUserProfileCalendarRaw(args: CalendarArgs) {
  const variables = buildVariables({ username: args.username, year: args.year });
  return executeGraphQL(userProfileCalendarQuery, variables);
}

export async function getUserProfileRaw(username: string) {
  return executeGraphQL(getUserProfileQuery, { username });
}

export async function getDailyProblemLegacy() {
  return executeGraphQL(dailyProblemQuery, {});
}

export async function getSkillStatsRaw(username: string) {
  return executeGraphQL(skillStatsQuery, { username });
}

export async function getUserProgress(username: string) {
  const data = await executeGraphQL(userQuestionProgressQuery, { username });
  return formatProgressStats(data as UserData);
}

export async function getUserContestRankingInfo(username: string) {
  return executeGraphQL(userContestRankingInfoQuery, { username });
}

export async function getUserProgressRaw(username: string) {
  return executeGraphQL(userQuestionProgressQuery, { username });
}
