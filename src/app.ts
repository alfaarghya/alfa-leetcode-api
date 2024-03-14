import express, { NextFunction, Response } from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import * as leetcode from './leetCode';
import { FetchUserDataRequest } from './types';

const app = express();

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  limit: 60,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: 'Too many request from this IP, try again in 1 hour',
});

app.use(cors()); //enable all CORS request
app.use(limiter); //limit to all API

app.get('/', (_req, res) => {
  res.json({
    routes: {
      userDetails: {
        '/:username': 'get your profile Details',
        '/:username/badges': 'get your badges',
        '/:username/solved': 'get total number of question you solved',
        '/:username/contest': 'get your contest details',
        '/:username/contest/history': 'get all contest history',
        '/:username/submission': 'get your last 20 submission',
        '/:username/submission?limit=7': 'get some of your last submission',
        '/:username/acSubmission': 'get your last 20 accepted submission',
        '/:username/acSubmission?limit=7':
          'get some of your last accepted submission',
        '/:username/calendar': 'get your submission calendar',
      },
      problems: {
        dailyProblem: { '/daily': 'get daily Problem' },
        singleProblem: { '/select?titleSlug=two-sum': 'get selected Problem' },
        problemList: {
          '/problems': 'get list of 20 problems',
          '/problems?limit=50': 'get list of some problems',
          '/problems?tags=array+math': 'get list problems on selected topics',
          '/problems?tags=array+math+string&limit=5':
            'get list some problems on selected topics',
        },
      },
    },
  });
});

//get the daily leetCode problem
app.get('/daily', leetcode.dailyProblem);

//get the selected question
app.get('/select', leetcode.selectProblem);

//get list of problems
app.get('/problems', leetcode.problems);

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
