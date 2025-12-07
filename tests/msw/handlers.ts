import * as msw from 'msw';
import {
  singleUser,
  singleUserContests,
  recentSubmissions,
  recentACSubmissions,
  dailyProblem,
  problems,
  selectProblem,
  userCalendar,
} from './mockData';

export const handlers = [
  msw.http.post('https://leetcode.com/graphql', async (ctx) => {
    const test = await ctx.request.json();
    const typed = test as { query: string };
    if (typed.query.indexOf('getUserProfile') !== -1) {
      return msw.HttpResponse.json(singleUser);
    }

    if (typed.query.indexOf('getUserContestRanking') !== -1) {
      return msw.HttpResponse.json(singleUserContests);
    }

    if (typed.query.indexOf('getRecentSubmissions') !== -1) {
      return msw.HttpResponse.json(recentSubmissions);
    }

    if (typed.query.indexOf('getACSubmissions') !== -1) {
      return msw.HttpResponse.json(recentACSubmissions);
    }

    if (typed.query.indexOf('getDailyProblem') !== -1) {
      return msw.HttpResponse.json(dailyProblem);
    }

    if (typed.query.indexOf('getProblems') !== -1) {
      return msw.HttpResponse.json(problems);
    }

    if (typed.query.indexOf('selectProblem') !== -1) {
      return msw.HttpResponse.json(selectProblem);
    }

    if (typed.query.indexOf('UserProfileCalendar') !== -1) {
      return msw.HttpResponse.json(userCalendar);
    }

    return msw.HttpResponse.json({});
  }),
];
