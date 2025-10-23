import { Request, Response } from 'express';
import * as gqlQueries from './GQLQueries';
import * as formatUtils from './FormatUtils';
import * as controllers from './Controllers';
import { TransformedUserDataRequest } from './types';

export const userData = (req: TransformedUserDataRequest, res: Response) => {
  controllers.fetchUserDetails(
    req.body,
    res,
    formatUtils.formatUserData,
    gqlQueries.userProfileQuery
  );
};

export const userBadges = (req: TransformedUserDataRequest, res: Response) => {
  controllers.fetchUserDetails(
    req.body,
    res,
    formatUtils.formatBadgesData,
    gqlQueries.userProfileQuery
  );
};

export const userContest = (req: TransformedUserDataRequest, res: Response) => {
  controllers.fetchUserDetails(
    req.body,
    res,
    formatUtils.formatContestData,
    gqlQueries.contestQuery
  );
};

export const userContestHistory = (
  req: TransformedUserDataRequest,
  res: Response
) => {
  controllers.fetchUserDetails(
    req.body,
    res,
    formatUtils.formatContestHistoryData,
    gqlQueries.contestQuery
  );
};

export const solvedProblem = (
  req: TransformedUserDataRequest,
  res: Response
) => {
  controllers.fetchUserDetails(
    req.body,
    res,
    formatUtils.formatSolvedProblemsData,
    gqlQueries.userProfileQuery
  );
};

export const submission = (req: TransformedUserDataRequest, res: Response) => {
  controllers.fetchUserDetails(
    req.body,
    res,
    formatUtils.formatSubmissionData,
    gqlQueries.submissionQuery
  );
};

export const acSubmission = (
  req: TransformedUserDataRequest,
  res: Response
) => {
  controllers.fetchUserDetails(
    req.body,
    res,
    formatUtils.formatAcSubmissionData,
    gqlQueries.AcSubmissionQuery
  );
};

export const calendar = (req: TransformedUserDataRequest, res: Response) => {
  controllers.fetchUserDetails(
    req.body,
    res,
    formatUtils.formatSubmissionCalendarData,
    gqlQueries.userProfileQuery
  );
};

//Problems Details
export const dailyProblem = (_req: Request, res: Response) => {
  controllers.fetchSingleProblem(
    res,
    formatUtils.formatDailyData,
    gqlQueries.dailyProblemQuery,
    null
  );
};

export const selectProblem = (req: Request, res: Response) => {
  const title = req.query.titleSlug as string;
  if (title !== undefined) {
    controllers.fetchSingleProblem(
      res,
      formatUtils.formatQuestionData,
      gqlQueries.selectProblemQuery,
      title
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
    controllers.fetchSingleProblem(
      res,
      e => e,
      gqlQueries.selectProblemQuery,
      title
    );
  } else {
    res.status(400).json({
      error: 'Missing or invalid query parameter: titleSlug',
      solution: 'put query after select',
      example: 'localhost:3000/select?titleSlug=two-sum',
    });
  }
}

export const problems = (
  req: Request<{}, {}, {}, { limit: number; skip: number; tags: string; difficulty: string }>,
  res: Response
) => {
  const difficulty = req.query.difficulty;
  const limit = req.query.limit;
  const skip = req.query.skip;
  const tags = req.query.tags;

  controllers.fetchProblems(
    { limit, skip, tags, difficulty },
    res,
    formatUtils.formatProblemsData,
    gqlQueries.problemListQuery
  );
};


export const trendingCategoryTopics = (_req: Request, res: Response) => {
  const first = parseInt(_req.query.first as string);
  if (!isNaN(first)) {
    controllers.fetchTrendingTopics(
      { first },
      res,
      formatUtils.formatTrendingCategoryTopicData,
      gqlQueries.trendingDiscussQuery
    );
  }
  else {
    res.status(400).json({
      error: 'Missing or invalid query parameter: limit',
      solution: 'put query after discussion',
      example: 'localhost:3000/trendingDiscuss?first=20',
    });
  }

};

export const languageStats = (_req: Request, res: Response) => {
  const username = _req.query.username as string;
  if (username) {
    controllers.fetchDataRawFormat(
      { username },
      res,
      gqlQueries.languageStatsQuery
    );
  }
  else {
    res.status(400).json({
      error: 'Missing or invalid query parameter: username',
      solution: 'put query after discussion',
      example: 'localhost:3000/languageStats?username=uwi',
    });
  }
};

// New endpoint functions following the distributed pattern
export const officialSolution = (req: Request, res: Response) => {
  const { titleSlug } = req.query;

  if (!titleSlug) {
    return res.status(400).json({ error: 'Missing titleSlug query parameter' });
  }
  return controllers.handleRequest(res, gqlQueries.officialSolutionQuery, { titleSlug });
};

export const userProfileCalendar = (req: Request, res: Response) => {
  const { username, year } = req.query;

  if (!username || !year || typeof year !== 'string') {
    return res
      .status(400)
      .json({ error: 'Missing or invalid username or year query parameter' });
  }

  return controllers.handleRequest(res, gqlQueries.userProfileCalendarQuery, {
    username,
    year: parseInt(year),
  });
};

export const userProfile = (req: Request, res: Response) => {
  const user = req.params.id;
  controllers.fetchUserProfile(res, gqlQueries.getUserProfileQuery, {
    username: user,
  }, formatUtils.formatUserProfileData);
};

export const dailyQuestion = (_req: Request, res: Response) => {
  controllers.handleRequest(res, gqlQueries.dailyProblemQuery, {});
};

export const skillStats = (req: Request, res: Response) => {
  const { username } = req.params;
  controllers.handleRequest(res, gqlQueries.skillStatsQuery, { username });
};

export const userProfileUserQuestionProgressV2 = (req: Request, res: Response) => {
  const { userSlug } = req.params;
  controllers.handleRequest(res, gqlQueries.userProfileUserQuestionProgressV2Query, { userSlug });
};

export const discussTopic = (req: Request, res: Response) => {
  const topicId = parseInt(req.params.topicId);
  controllers.handleRequest(res, gqlQueries.discussTopicQuery, { topicId });
};

export const discussComments = (req: Request, res: Response) => {
  const topicId = parseInt(req.params.topicId);
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

export const userContestRankingInfo = (req: Request, res: Response) => {
  const { username } = req.params;
  controllers.handleRequest(res, gqlQueries.userContestRankingInfoQuery, { username });
};