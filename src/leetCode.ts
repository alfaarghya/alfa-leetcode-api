import type { Request, Response } from 'express';
import * as controllers from './Controllers';
import * as formatUtils from './FormatUtils';
import * as gqlQueries from './GQLQueries';
import type { TransformedUserDataRequest } from './types';

//User profile details
export const userData = (req: TransformedUserDataRequest, res: Response) => {
  controllers.fetchUserDetails(
    req.body,
    res,
    gqlQueries.userProfileQuery,
    formatUtils.formatUserData,
  );
};

export const userBadges = (req: TransformedUserDataRequest, res: Response) => {
  controllers.fetchUserDetails(
    req.body,
    res,
    gqlQueries.userProfileQuery,
    formatUtils.formatBadgesData,
  );
};

export const userContest = (req: TransformedUserDataRequest, res: Response) => {
  controllers.fetchUserDetails(
    req.body,
    res,
    gqlQueries.contestQuery,
    formatUtils.formatContestData,
  );
};

export const userContestHistory = (
  req: TransformedUserDataRequest,
  res: Response,
) => {
  controllers.fetchUserDetails(
    req.body,
    res,
    gqlQueries.contestQuery,
    formatUtils.formatContestHistoryData,
  );
};

export const solvedProblem = (
  req: TransformedUserDataRequest,
  res: Response,
) => {
  controllers.fetchUserDetails(
    req.body,
    res,
    gqlQueries.userProfileQuery,
    formatUtils.formatSolvedProblemsData,
  );
};

export const submission = (req: TransformedUserDataRequest, res: Response) => {
  controllers.fetchUserDetails(
    req.body,
    res,
    gqlQueries.submissionQuery,
    formatUtils.formatSubmissionData,
  );
};

export const acSubmission = (
  req: TransformedUserDataRequest,
  res: Response,
) => {
  controllers.fetchUserDetails(
    req.body,
    res,
    gqlQueries.AcSubmissionQuery,
    formatUtils.formatAcSubmissionData,
  );
};

export const calendar = (req: TransformedUserDataRequest, res: Response) => {
  controllers.fetchUserDetails(
    req.body,
    res,
    gqlQueries.userProfileCalendarQuery,
    formatUtils.formatSubmissionCalendarData,
  );
};

export const skillStats = (req: TransformedUserDataRequest, res: Response) => {
  controllers.fetchUserDetails(
    req.body,
    res,
    gqlQueries.skillStatsQuery,
    formatUtils.formatSkillStats,
  );
};

export const userProfile = (req: Request, res: Response) => {
  controllers.fetchUserDetails(
    req.body,
    res,
    gqlQueries.getUserProfileQuery,
    formatUtils.formatUserProfileData,
  );
};

export const languageStats = (req: Request, res: Response) => {
  controllers.fetchUserDetails(
    req.body,
    res,
    gqlQueries.languageStatsQuery,
    formatUtils.formatLanguageStats,
  );
};

export const progress = (req: Request, res: Response) => {
  controllers.fetchUserDetails(
    req.body,
    res,
    gqlQueries.userQuestionProgressQuery,
    formatUtils.formatProgressStats,
  );
};

//Problems Details
export const dailyProblem = (_req: Request, res: Response) => {
  controllers.fetchSingleProblem(
    res,
    gqlQueries.dailyProblemQuery,
    null,
    formatUtils.formatDailyData,
  );
};

export const dailyProblemRaw = (_req: Request, res: Response) => {
  controllers.fetchSingleProblem(res, gqlQueries.dailyProblemQuery, null);
};

export const selectProblem = (req: Request, res: Response) => {
  const title = req.query.titleSlug as string;
  if (title !== undefined) {
    controllers.fetchSingleProblem(
      res,
      gqlQueries.selectProblemQuery,
      title,
      formatUtils.formatQuestionData,
    );
  } else {
    res.status(400).json({
      error: 'Missing or invalid query parameter: titleSlug',
      solution: 'put query after select',
      example: 'localhost:3000/select?titleSlug=two-sum',
    });
  }
};

export const selectProblemRaw = (req: Request, res: Response) => {
  const title = req.query.titleSlug as string;
  if (title !== undefined) {
    controllers.fetchSingleProblem(res, gqlQueries.selectProblemQuery, title);
  } else {
    res.status(400).json({
      error: 'Missing or invalid query parameter: titleSlug',
      solution: 'put query after select',
      example: 'localhost:3000/select?titleSlug=two-sum',
    });
  }
};

export const problems = (
  req: Request<
    object,
    object,
    object,
    { limit: number; skip: number; tags: string; difficulty: string }
  >,
  res: Response,
) => {
  const difficulty = req.query.difficulty;
  const limit = req.query.limit;
  const skip = req.query.skip;
  const tags = req.query.tags;

  controllers.fetchProblems(
    { limit, skip, tags, difficulty },
    res,
    formatUtils.formatProblemsData,
    gqlQueries.problemListQuery,
  );
};

export const officialSolution = (req: Request, res: Response) => {
  const { titleSlug } = req.query;

  if (!titleSlug) {
    return res.status(400).json({ error: 'Missing titleSlug query parameter' });
  }
  return controllers.handleRequest(res, gqlQueries.officialSolutionQuery, {
    titleSlug,
  });
};

// Discussion
export const trendingCategoryTopics = (_req: Request, res: Response) => {
  const first = parseInt(_req.query.first as string, 10);
  if (!Number.isNaN(first)) {
    controllers.fetchTrendingTopics(
      { first },
      res,
      formatUtils.formatTrendingCategoryTopicData,
      gqlQueries.trendingDiscussQuery,
    );
  } else {
    res.status(400).json({
      error: 'Missing or invalid query parameter: limit',
      solution: 'put query after discussion',
      example: 'localhost:3000/trendingDiscuss?first=20',
    });
  }
};

export const discussTopic = (req: Request, res: Response) => {
  const topicId = parseInt(req.params.topicId, 10);
  controllers.handleRequest(res, gqlQueries.discussTopicQuery, { topicId });
};

export const discussComments = (req: Request, res: Response) => {
  const topicId = parseInt(req.params.topicId, 10);
  const {
    orderBy = 'newest_to_oldest',
    pageNo = 1,
    numPerPage = 10,
  } = req.query;
  controllers.handleRequest(res, gqlQueries.discussCommentsQuery, {
    topicId,
    orderBy,
    pageNo,
    numPerPage,
  });
};

//limiting is not supported in the contests unlike problems
export const allContests = (_req: Request, res: Response) => {
  controllers.fetchAllContests(res, gqlQueries.allContestQuery);
};

export const upcomingContests = (_req: Request, res: Response) => {
  controllers.fetchUpcomingContests(res, gqlQueries.allContestQuery);
};

/* ----- Migrated to new functions -> these will be deleted -----*/
export const languageStats_ = (_req: Request, res: Response) => {
  const username = _req.query.username as string;
  if (username) {
    controllers.fetchDataRawFormat(
      { username },
      res,
      gqlQueries.languageStatsQuery,
    );
  } else {
    res.status(400).json({
      error: 'Missing or invalid query parameter: username',
      solution: 'put query after discussion',
      example: 'localhost:3000/languageStats?username=uwi',
    });
  }
};

// export const userProfileCalendar_ = (req: Request, res: Response) => {
//   const { username, year } = req.query;

//   if (!username || !year || typeof year !== 'string') {
//     return res
//       .status(400)
//       .json({ error: 'Missing or invalid username or year query parameter' });
//   }

//   return controllers.handleRequest(res, gqlQueries.userProfileCalendarQuery, {
//     username,
//     year: parseInt(year, 10),
//   });
// };

export const userProfile_ = (req: Request, res: Response) => {
  const user = req.params.id;
  controllers.fetchUserProfile(
    res,
    gqlQueries.getUserProfileQuery,
    {
      username: user,
    },
    formatUtils.formatUserProfileData,
  );
};

export const dailyQuestion_ = (_req: Request, res: Response) => {
  controllers.handleRequest(res, gqlQueries.dailyProblemQuery, {});
};

export const skillStats_ = (req: Request, res: Response) => {
  const { username } = req.params;
  controllers.handleRequest(res, gqlQueries.skillStatsQuery, { username });
};

export const userProfileUserQuestionProgressV2_ = (
  req: Request,
  res: Response,
) => {
  const username = req.params.username;
  controllers.handleRequest(res, gqlQueries.userQuestionProgressQuery, {
    username,
  });
};

export const userContestRankingInfo_ = (req: Request, res: Response) => {
  const { username } = req.params;
  controllers.handleRequest(res, gqlQueries.userContestRankingInfoQuery, {
    username,
  });
};

export const fetchUserCalendarData_ = (req: Request, res: Response) => {
  controllers.fetchUserProgressCalendar(
    req.body,
    res,
    gqlQueries.userProgressCalendarQuery,
  );
};
