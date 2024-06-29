import express, { NextFunction, Response } from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import * as leetcode from './leetCode';
import { FetchUserDataRequest } from './types';
import apicache from 'apicache';
import axios from 'axios';
import {
  userContestRankingInfoQuery,
  discussCommentsQuery,
  discussTopicQuery,
  userProfileUserQuestionProgressV2Query,
  skillStatsQuery,
  getUserProfileQuery,
  userProfileCalendarQuery,
  officialSolutionQuery,
  dailyQeustion,
} from './GQLQueries/newQueries';

const app = express();
let cache = apicache.middleware;
const API_URL = process.env.LEETCODE_API_URL || 'https://leetcode.com/graphql';

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  limit: 60,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: 'Too many request from this IP, try again in 1 hour',
});

app.use(cache('5 minutes'));
app.use(cors()); //enable all CORS request
app.use(limiter); //limit to all API
app.use((req: express.Request, _res: Response, next: NextFunction) => {
  console.log('Requested URL:', req.originalUrl);
  next();
});

async function queryLeetCodeAPI(query: string, variables: any) {
  try {
    const response = await axios.post(API_URL, { query, variables });
    if (response.data.errors) {
      throw new Error(response.data.errors[0].message);
    }
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(`Error from LeetCode API: ${error.response.data}`);
    } else if (error.request) {
      throw new Error('No response received from LeetCode API');
    } else {
      throw new Error(`Error in setting up the request: ${error.message}`);
    }
  }
}

app.get('/', (_req, res) => {
  res.json({
    routes: {
      userDetails: {
        '/:username': 'get your leetcodevis profile Details',
        '/:username/badges': 'get your badges',
        '/:username/solved': 'get total number of question you solved',
        '/:username/contest': 'get your contest details',
        '/:username/contest/history': 'get all contest history',
        '/:username/submission': 'get your last 20 submission',
        '/:username/acSubmission': 'get your last 20 accepted submission',
        '/:username/calendar': 'get your submission calendar',
        '/userProfile/:username': 'get full profile details in one call',
        '/userProfileCalendar?username=yourname&year=2024':
          'get your calendar details with year',
        '/languageStats?username=yourname': 'get the language stats of a user',
        '/userProfileUserQuestionProgressV2/:userSlug':
          'get your question progress',
        '/skillStats/:username': 'get your skill stats',
      },
      contest: {
        '/userContestRankingInfo/:username': 'get user contest ranking info',
      },
      discussion: {
        '/trendingDiscuss?first=20': 'get top 20 trending discussions',
        '/discussTopic/:topicId': 'get discussion topic',
        '/discussComments/:topicId': 'get discussion comments',
      },
      problems: {
        singleProblem: {
          '/select?titleSlug=two-sum': 'get selected Problem',
          '/daily': 'get daily Problem',
          '/dailyQuestion': 'get raw daily question',
        },
        problemList: {
          '/problems': 'get list of 20 problems',
          '/problems?limit=50': 'get list of some problems',
          '/problems?tags=array+math': 'get list problems on selected topics',
          '/problems?tags=array+math+string&limit=5':
            'get list some problems on selected topics',
          '/officialSolution?titleSlug=two-sum':
            'get official solution of selected problem',
        },
      },
    },
  });
});

app.get('/officialSolution', async (req, res) => {
  const { titleSlug } = req.query;

  if (!titleSlug) {
    return res.status(400).json({ error: 'Missing titleSlug query parameter' });
  }
  try {
    const data = await queryLeetCodeAPI(officialSolutionQuery, { titleSlug });
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.get('/userProfileCalendar', async (req, res) => {
  const { username, year } = req.query;

  if (!username || !year || typeof year !== 'string') {
    return res
      .status(400)
      .json({ error: 'Missing or invalid username or year query parameter' });
  }

  try {
    const data = await queryLeetCodeAPI(userProfileCalendarQuery, {
      username,
      year: parseInt(year),
    });
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Format data
const formatData = (data: any) => {
  return {
    totalSolved: data.matchedUser.submitStats.acSubmissionNum[0].count,
    totalSubmissions: data.matchedUser.submitStats.totalSubmissionNum,
    totalQuestions: data.allQuestionsCount[0].count,
    easySolved: data.matchedUser.submitStats.acSubmissionNum[1].count,
    totalEasy: data.allQuestionsCount[1].count,
    mediumSolved: data.matchedUser.submitStats.acSubmissionNum[2].count,
    totalMedium: data.allQuestionsCount[2].count,
    hardSolved: data.matchedUser.submitStats.acSubmissionNum[3].count,
    totalHard: data.allQuestionsCount[3].count,
    ranking: data.matchedUser.profile.ranking,
    contributionPoint: data.matchedUser.contributions.points,
    reputation: data.matchedUser.profile.reputation,
    submissionCalendar: JSON.parse(data.matchedUser.submissionCalendar),
    recentSubmissions: data.recentSubmissionList,
    matchedUserStats: data.matchedUser.submitStats,
  };
};

app.get('/userProfile/:id', async (req, res) => {
  const user = req.params.id;

  try {
    const data = await queryLeetCodeAPI(getUserProfileQuery, {
      username: user,
    });
    if (data.errors) {
      res.send(data);
    } else {
      res.send(formatData(data.data));
    }
  } catch (error) {
    res.send(error);
  }
});

const handleRequest = async (res: Response, query: string, params: any) => {
  try {
    const data = await queryLeetCodeAPI(query, params);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
app.get('/dailyQuestion', (_, res) => {
  handleRequest(res, dailyQeustion, {});
});

app.get('/skillStats/:username', (req, res) => {
  const { username } = req.params;
  handleRequest(res, skillStatsQuery, { username });
});

app.get('/userProfileUserQuestionProgressV2/:userSlug', (req, res) => {
  const { userSlug } = req.params;
  handleRequest(res, userProfileUserQuestionProgressV2Query, { userSlug });
});

app.get('/discussTopic/:topicId', (req, res) => {
  const topicId = parseInt(req.params.topicId);
  handleRequest(res, discussTopicQuery, { topicId });
});

app.get('/discussComments/:topicId', (req, res) => {
  const topicId = parseInt(req.params.topicId);
  const {
    orderBy = 'newest_to_oldest',
    pageNo = 1,
    numPerPage = 10,
  } = req.query;
  handleRequest(res, discussCommentsQuery, {
    topicId,
    orderBy,
    pageNo,
    numPerPage,
  });
});

app.get('/userContestRankingInfo/:username', (req, res) => {
  const { username } = req.params;
  handleRequest(res, userContestRankingInfoQuery, { username });
});

//get the daily leetCode problem
app.get('/daily', leetcode.dailyProblem);

//get the selected question
app.get('/select', leetcode.selectProblem);

//get list of problems
app.get('/problems', leetcode.problems);

//get 20 trending Discuss
app.get('/trendingDiscuss', leetcode.trendingCategoryTopics);

app.get('/languageStats', leetcode.languageStats);

// Construct options object on all user routes.
app.use(
  '/:username*',
  (req: FetchUserDataRequest, _res: Response, next: NextFunction) => {
    req.body = {
      username: req.params.username,
      limit: req.query.limit,
    };
    next();
  }
);

//get user profile details
app.get('/:username', leetcode.userData);
app.get('/:username/badges', leetcode.userBadges);
app.get('/:username/solved', leetcode.solvedProblem);
app.get('/:username/contest', leetcode.userContest);
app.get('/:username/contest/history', leetcode.userContestHistory);
app.get('/:username/submission', leetcode.submission);
app.get('/:username/acSubmission', leetcode.acSubmission);
app.get('/:username/calendar', leetcode.calendar);

export default app;
