import * as msw from 'msw';
import {
  allContests,
  dailyProblem,
  discussComments,
  discussTopic,
  languageStats,
  officialSolution,
  problems,
  recentACSubmissions,
  recentSubmissions,
  selectProblem,
  singleUser,
  singleUserContests,
  skillStats,
  trendingDiscuss,
  userCalendar,
  userQuestionProgress,
} from './mockData';

const queryResponseMap = [
  { identifier: 'getUserProfile', response: singleUser },
  { identifier: 'getUserContestRanking', response: singleUserContests },
  { identifier: 'getRecentSubmissions', response: recentSubmissions },
  { identifier: 'getACSubmissions', response: recentACSubmissions },
  { identifier: 'getDailyProblem', response: dailyProblem },
  { identifier: 'getProblems', response: problems },
  { identifier: 'selectProblem', response: selectProblem },
  { identifier: 'UserProfileCalendar', response: userCalendar },
  { identifier: 'languageStats', response: languageStats },
  { identifier: 'skillStats', response: skillStats },
  {
    identifier: 'userProfileUserQuestionProgressV2',
    response: userQuestionProgress,
  },
  { identifier: 'OfficialSolution', response: officialSolution },
  { identifier: 'allContests', response: allContests },
  { identifier: 'trendingDiscuss', response: trendingDiscuss },
  { identifier: 'DiscussTopic', response: discussTopic },
  { identifier: 'discussComments', response: discussComments },
];

export const handlers = [
  msw.http.post('https://leetcode.com/graphql', async (ctx) => {
    const test = await ctx.request.json();
    const typed = test as { query: string };

    const matchedQuery = queryResponseMap.find((mapping) =>
      typed.query.includes(mapping.identifier),
    );

    return msw.HttpResponse.json(matchedQuery?.response ?? {});
  }),
];
