import z from 'zod';
import { badge } from './common';

const userContestRanking = z.object({
  attendedContestsCount: z.number().nonnegative(),
  badge: badge.nullable(),
  globalRanking: z.number().nonnegative(),
  rating: z.number().nonnegative(),
  totalParticipants: z.number().nonnegative(),
  topPercentage: z.number().nonnegative(),
});

const userContestRankingHistory = z.object({
  attended: z.boolean(),
  rating: z.number().nonnegative(),
  ranking: z.number().nonnegative(),
  trendDirection: z.string(),
  problemsSolved: z.number().nonnegative(),
  totalProblems: z.number().positive(),
  finishTimeInSeconds: z.number().nonnegative(),
  contest: z.object({
    title: z.string(),
    startTime: z.number(),
  }),
});

const userContest = z.object({
  userContestRanking: userContestRanking.nullable(),
  userContestRankingHistory: z.array(userContestRankingHistory),
});

export default userContest;
export type UserContest = z.infer<typeof userContest>;
