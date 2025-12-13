import express, { NextFunction, Response } from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import * as leetcode from './leetCode';
import { FetchUserDataRequest } from './types';
import apicache from 'apicache';

const app = express();
let cache = apicache.middleware;

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  limit: 120,
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

app.get('/', (_req, res) => {
  res.json({
    apiOverview:
      'Welcome to the Alfa-Leetcode-API! Alfa-Leetcode-Api is a custom solution born out of the need for a well-documented and detailed LeetCode API. This project is designed to provide developers with endpoints that offer insights into a user"s profile, badges, solved questions, contest details, contest history, submissions, and also daily questions, selected problem, list of problems.',
    apiEndpointsLink:
      'https://github.com/alfaarghya/alfa-leetcode-api?tab=readme-ov-file#endpoints-',
    routes: {
      userDetails: {
        description:
          'Endpoints for retrieving detailed user profile information on Leetcode.',
        Method: 'GET',
        '/:username': 'Get your leetcode profile Details',
        '/:username/profile': 'Get full profile details',
        '/:username/badges': 'Get your badges',
        '/:username/solved': 'Get total number of question you solved',
        '/:username/contest': 'Get your contest details',
        '/:username/contest/history': 'Get all contest history',
        '/:username/submission': 'Get your last 20 submission',
        '/:username/submission?limit=7':
          'Get a specified number of last submissions.',
        '/:username/acSubmission': 'Get your last 20 accepted submission',
        '/:username/acSubmission?limit=7':
          'Get a specified number of last acSubmissions.',
        '/:username/calendar': 'Get your submission calendar',
        '/:username/calendar?year=2025': 'Get your year submission calendar',
        '/:username/skill': 'Get your skill stats',
        '/:username/language': 'Get your language stats',
        '/:username/progress': 'Get your progress stats',
      },
      discussion: {
        description: 'Endpoints for fetching discussion topics and comments.',
        Method: 'GET',
        '/trendingDiscuss?first=20': 'Get top 20 trending discussions',
        '/discussTopic/:topicId': 'Get discussion topic',
        '/discussComments/:topicId': 'Get discussion comments',
      },
      problems: {
        description:
          'Endpoints for fetching problem-related data, including lists, details, and solutions.',
        Method: 'GET',
        singleProblem: {
          '/select?titleSlug=two-sum': 'Get selected Problem',
          '/select/raw?titleSlug=two-sum': 'Get raw selected Problem',
          '/daily': 'Get daily Problem',
          '/daily/raw': 'Get raw daily Problem',
        },
        problemList: {
          '/problems': 'Get list of 20 problems',
          '/problems?limit=50': 'Get list of some problems',
          '/problems?tags=array+math': 'Get list problems on selected topics',
          '/problems?tags=array+math+string&limit=5':
            'Get list some problems on selected topics',
          '/problems?skip=500':
            'Get list after skipping a given amount of problems',
          '/problems?difficulty=EASY':
            'Get list of problems having selected difficulty',
          '/problems?limit=5&skip=100':
            'Get list of size limit after skipping selected amount',
          'problems?tags=array+maths&limit=5&skip=100':
            'Get list of problems with selected tags having size limit after skipping selected amount',
          '/officialSolution?titleSlug=two-sum':
            'Get official solution of selected problem',
        },
      },
    },
  });
});

//get trending Discuss
app.get('/trendingDiscuss', leetcode.trendingCategoryTopics);

//get discuss topic
app.get('/discussTopic/:topicId', leetcode.discussTopic);

//get discuss comments
app.get('/discussComments/:topicId', leetcode.discussComments);

//get the daily leetCode problem
app.get('/daily', leetcode.dailyProblem);
app.get('/daily/raw', leetcode.dailyProblemRaw);

//get the selected question
app.get('/select', leetcode.selectProblem);
app.get('/select/raw', leetcode.selectProblemRaw);

//get official solution
app.get('/officialSolution', leetcode.officialSolution);

//get list of problems
app.get('/problems', leetcode.problems);

//get contests
app.get('/contests', leetcode.allContests);
app.get('/contests/upcoming', leetcode.upcomingContests);

// Construct options object on all user routes.
app.use(
  '/:username*',
  (req: FetchUserDataRequest, _res: Response, next: NextFunction) => {
    req.body = {
      username: req.params.username,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
      year: req.query.year ? parseInt(req.query.year as string) : 0,
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
app.get('/:username/skill/', leetcode.skillStats);
app.get('/:username/profile/', leetcode.userProfile);
app.get('/:username/language', leetcode.languageStats);
app.get('/:username/progress/', leetcode.progress);

/* ----- Migrated to new routes -> these will be deleted -----*/
//get user profile calendar
app.get('/userProfileCalendar', leetcode.userProfileCalendar_);

//get user profile details
app.get('/userProfile/:id', leetcode.userProfile_);

//get daily question
app.get('/dailyQuestion', leetcode.dailyQuestion_);

// get the selection question raw
app.get('/selectQuestion', leetcode.selectProblemRaw);

//get skill stats
app.get('/skillStats/:username', leetcode.skillStats_);

//get user profile question progress
app.get(
  '/userProfileUserQuestionProgressV2/:userSlug',
  leetcode.userProfileUserQuestionProgressV2_
);

app.get('/languageStats', leetcode.languageStats_);

//get user contest ranking info
app.get('/userContestRankingInfo/:username', leetcode.userContestRankingInfo_);

export default app;
