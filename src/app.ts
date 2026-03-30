import apicache from 'apicache';
import cors from 'cors';
import express, { type NextFunction, type Response } from 'express';
import rateLimit from 'express-rate-limit';
import * as leetcode from './leetCode';
import { setupSwagger } from './swagger';
import type { FetchUserDataRequest } from './types';

const app = express();
const cache = apicache.middleware;

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

// Swagger UI must be mounted before /:username wildcard routes
setupSwagger(app);

/**
 * @openapi
 * /:
 *   get:
 *     tags: [General]
 *     summary: API overview
 *     description: Returns a summary of all available endpoints and their descriptions.
 *     responses:
 *       200:
 *         description: API overview object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 apiOverview:
 *                   type: string
 *                 apiEndpointsLink:
 *                   type: string
 *                 routes:
 *                   type: object
 */
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

// ── Discussions ───────────────────────────────────────────────────────────────

/**
 * @openapi
 * /trendingDiscuss:
 *   get:
 *     tags: [Discussions]
 *     summary: Get trending discussions
 *     description: Returns the top trending discussion topics on LeetCode.
 *     parameters:
 *       - name: first
 *         in: query
 *         required: false
 *         description: Number of trending discussions to return (default 20)
 *         schema:
 *           type: integer
 *           default: 20
 *         example: 20
 *     responses:
 *       200:
 *         description: List of trending discussion topics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 trendingDiscuss:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       title:
 *                         type: string
 *                       commentCount:
 *                         type: integer
 *                       viewCount:
 *                         type: integer
 *       500:
 *         description: LeetCode GraphQL error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
app.get('/trendingDiscuss', leetcode.trendingCategoryTopics);

/**
 * @openapi
 * /discussTopic/{topicId}:
 *   get:
 *     tags: [Discussions]
 *     summary: Get a discussion topic
 *     description: Returns details for a specific discussion topic by its ID.
 *     parameters:
 *       - $ref: '#/components/parameters/topicId'
 *     responses:
 *       200:
 *         description: Discussion topic details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 content:
 *                   type: string
 *       404:
 *         description: Topic not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
app.get('/discussTopic/:topicId', leetcode.discussTopic);

/**
 * @openapi
 * /discussComments/{topicId}:
 *   get:
 *     tags: [Discussions]
 *     summary: Get comments for a discussion topic
 *     description: Returns all comments for a given discussion topic.
 *     parameters:
 *       - $ref: '#/components/parameters/topicId'
 *     responses:
 *       200:
 *         description: List of comments for the discussion topic
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 comments:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       content:
 *                         type: string
 *                       author:
 *                         type: object
 *                         properties:
 *                           username:
 *                             type: string
 *       404:
 *         description: Topic not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
app.get('/discussComments/:topicId', leetcode.discussComments);

// ── Problems ──────────────────────────────────────────────────────────────────

/**
 * @openapi
 * /daily:
 *   get:
 *     tags: [Problems]
 *     summary: Get daily problem
 *     description: Returns today's LeetCode daily challenge problem with full details.
 *     responses:
 *       200:
 *         description: Today's daily problem
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 date:
 *                   type: string
 *                   format: date
 *                 link:
 *                   type: string
 *                 question:
 *                   $ref: '#/components/schemas/Problem'
 *       500:
 *         description: LeetCode GraphQL error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
app.get('/daily', leetcode.dailyProblem);

/**
 * @openapi
 * /daily/raw:
 *   get:
 *     tags: [Problems]
 *     summary: Get raw daily problem
 *     description: Returns the raw LeetCode GraphQL response for today's daily challenge.
 *     responses:
 *       200:
 *         description: Raw daily problem data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: LeetCode GraphQL error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
app.get('/daily/raw', leetcode.dailyProblemRaw);

/**
 * @openapi
 * /select:
 *   get:
 *     tags: [Problems]
 *     summary: Get a selected problem
 *     description: Returns full details for a specific problem by its title slug.
 *     parameters:
 *       - $ref: '#/components/parameters/titleSlug'
 *     responses:
 *       200:
 *         description: Problem details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Problem'
 *       404:
 *         description: Problem not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
app.get('/select', leetcode.selectProblem);

/**
 * @openapi
 * /select/raw:
 *   get:
 *     tags: [Problems]
 *     summary: Get raw selected problem
 *     description: Returns the raw LeetCode GraphQL response for a specific problem.
 *     parameters:
 *       - $ref: '#/components/parameters/titleSlug'
 *     responses:
 *       200:
 *         description: Raw problem data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Problem not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
app.get('/select/raw', leetcode.selectProblemRaw);

/**
 * @openapi
 * /officialSolution:
 *   get:
 *     tags: [Problems]
 *     summary: Get official solution for a problem
 *     description: Returns the official LeetCode editorial/solution for a given problem.
 *     parameters:
 *       - $ref: '#/components/parameters/titleSlug'
 *     responses:
 *       200:
 *         description: Official solution content
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 question:
 *                   type: object
 *                   properties:
 *                     titleSlug:
 *                       type: string
 *                     solution:
 *                       type: object
 *                       properties:
 *                         title:
 *                           type: string
 *                         content:
 *                           type: string
 *       404:
 *         description: Solution not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
app.get('/officialSolution', leetcode.officialSolution);

/**
 * @openapi
 * /problems:
 *   get:
 *     tags: [Problems]
 *     summary: Get list of problems
 *     description: >
 *       Returns a paginated list of LeetCode problems.
 *       Supports filtering by difficulty, topic tags, and pagination via limit and skip.
 *     parameters:
 *       - $ref: '#/components/parameters/limit'
 *       - name: skip
 *         in: query
 *         required: false
 *         description: Number of problems to skip (for pagination)
 *         schema:
 *           type: integer
 *           default: 0
 *         example: 100
 *       - name: difficulty
 *         in: query
 *         required: false
 *         description: Filter by difficulty level
 *         schema:
 *           type: string
 *           enum: [EASY, MEDIUM, HARD]
 *         example: EASY
 *       - name: tags
 *         in: query
 *         required: false
 *         description: Filter by topic tags, separated by `+` (e.g. `array+math`)
 *         schema:
 *           type: string
 *         example: array+math
 *     responses:
 *       200:
 *         description: Paginated list of problems
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 problemsetQuestionList:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     questions:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Problem'
 *       500:
 *         description: LeetCode GraphQL error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
app.get('/problems', leetcode.problems);

// ── Contests ──────────────────────────────────────────────────────────────────

/**
 * @openapi
 * /contests:
 *   get:
 *     tags: [Contests]
 *     summary: Get all contests
 *     description: Returns a list of all LeetCode contests.
 *     responses:
 *       200:
 *         description: List of contests
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 contests:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Contest'
 *       500:
 *         description: LeetCode GraphQL error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
app.get('/contests', leetcode.allContests);

/**
 * @openapi
 * /contests/upcoming:
 *   get:
 *     tags: [Contests]
 *     summary: Get upcoming contests
 *     description: Returns a list of upcoming LeetCode contests.
 *     responses:
 *       200:
 *         description: List of upcoming contests
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 upcomingContests:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Contest'
 *       500:
 *         description: LeetCode GraphQL error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
app.get('/contests/upcoming', leetcode.upcomingContests);

// ── User middleware ───────────────────────────────────────────────────────────

// Construct options object on all user routes.
app.use(
  '/:username*',
  (req: FetchUserDataRequest, _res: Response, next: NextFunction) => {
    req.body = {
      username: req.params.username,
      limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 20,
      year: req.query.year ? parseInt(req.query.year as string, 10) : 0,
    };
    next();
  },
);

// ── User routes ───────────────────────────────────────────────────────────────

/**
 * @openapi
 * /{username}:
 *   get:
 *     tags: [User]
 *     summary: Get user profile summary
 *     description: Returns a combined summary of a user's LeetCode profile data.
 *     parameters:
 *       - $ref: '#/components/parameters/username'
 *     responses:
 *       200:
 *         description: User profile summary
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *                 solved:
 *                   $ref: '#/components/schemas/SolvedCount'
 *                 contest:
 *                   $ref: '#/components/schemas/ContestInfo'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
app.get('/:username', leetcode.userData);

/**
 * @openapi
 * /{username}/badges:
 *   get:
 *     tags: [User]
 *     summary: Get user badges
 *     description: Returns all badges earned by the user.
 *     parameters:
 *       - $ref: '#/components/parameters/username'
 *     responses:
 *       200:
 *         description: List of user badges
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 badges:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Badge'
 *                 upcomingBadges:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Badge'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
app.get('/:username/badges', leetcode.userBadges);

/**
 * @openapi
 * /{username}/solved:
 *   get:
 *     tags: [User]
 *     summary: Get total solved problems count
 *     description: Returns the total number of problems solved, broken down by difficulty.
 *     parameters:
 *       - $ref: '#/components/parameters/username'
 *     responses:
 *       200:
 *         description: Solved problems count
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SolvedCount'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
app.get('/:username/solved', leetcode.solvedProblem);

/**
 * @openapi
 * /{username}/contest:
 *   get:
 *     tags: [User]
 *     summary: Get user contest details
 *     description: Returns a summary of the user's contest performance and global ranking.
 *     parameters:
 *       - $ref: '#/components/parameters/username'
 *     responses:
 *       200:
 *         description: Contest details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ContestInfo'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
app.get('/:username/contest', leetcode.userContest);

/**
 * @openapi
 * /{username}/contest/history:
 *   get:
 *     tags: [User]
 *     summary: Get user contest history
 *     description: Returns the full contest participation history for the user.
 *     parameters:
 *       - $ref: '#/components/parameters/username'
 *     responses:
 *       200:
 *         description: Contest history
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 contestHistory:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       attended:
 *                         type: boolean
 *                       problemsSolved:
 *                         type: integer
 *                       rating:
 *                         type: number
 *                       ranking:
 *                         type: integer
 *                       contest:
 *                         type: object
 *                         properties:
 *                           title:
 *                             type: string
 *                           startTime:
 *                             type: integer
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
app.get('/:username/contest/history', leetcode.userContestHistory);

/**
 * @openapi
 * /{username}/submission:
 *   get:
 *     tags: [User]
 *     summary: Get recent submissions
 *     description: Returns the user's most recent submissions. Defaults to last 20.
 *     parameters:
 *       - $ref: '#/components/parameters/username'
 *       - $ref: '#/components/parameters/limit'
 *     responses:
 *       200:
 *         description: List of recent submissions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 submission:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Submission'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
app.get('/:username/submission', leetcode.submission);

/**
 * @openapi
 * /{username}/acSubmission:
 *   get:
 *     tags: [User]
 *     summary: Get recent accepted submissions
 *     description: Returns the user's most recent accepted (AC) submissions. Defaults to last 20.
 *     parameters:
 *       - $ref: '#/components/parameters/username'
 *       - $ref: '#/components/parameters/limit'
 *     responses:
 *       200:
 *         description: List of accepted submissions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 acSubmission:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Submission'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
app.get('/:username/acSubmission', leetcode.acSubmission);

/**
 * @openapi
 * /{username}/calendar:
 *   get:
 *     tags: [User]
 *     summary: Get submission calendar
 *     description: Returns the user's submission activity heatmap calendar. Optionally filter by year.
 *     parameters:
 *       - $ref: '#/components/parameters/username'
 *       - $ref: '#/components/parameters/year'
 *     responses:
 *       200:
 *         description: Submission calendar data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 submissionCalendar:
 *                   type: object
 *                   additionalProperties:
 *                     type: integer
 *                   description: Map of Unix timestamps to submission counts
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
app.get('/:username/calendar', leetcode.calendar);

/**
 * @openapi
 * /{username}/skill:
 *   get:
 *     tags: [User]
 *     summary: Get user skill stats
 *     description: Returns the user's skill statistics grouped by advanced, intermediate, and fundamental.
 *     parameters:
 *       - $ref: '#/components/parameters/username'
 *     responses:
 *       200:
 *         description: Skill stats
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SkillStats'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
app.get('/:username/skill/', leetcode.skillStats);

/**
 * @openapi
 * /{username}/profile:
 *   get:
 *     tags: [User]
 *     summary: Get full user profile
 *     description: Returns full LeetCode profile details for a given user.
 *     parameters:
 *       - $ref: '#/components/parameters/username'
 *     responses:
 *       200:
 *         description: Full user profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *                 profile:
 *                   type: object
 *                   properties:
 *                     realName:
 *                       type: string
 *                     userAvatar:
 *                       type: string
 *                     ranking:
 *                       type: integer
 *                     countryName:
 *                       type: string
 *                     company:
 *                       type: string
 *                     jobTitle:
 *                       type: string
 *                     skillTags:
 *                       type: array
 *                       items:
 *                         type: string
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
app.get('/:username/profile/', leetcode.userProfile);

/**
 * @openapi
 * /{username}/language:
 *   get:
 *     tags: [User]
 *     summary: Get user language stats
 *     description: Returns the number of problems the user has solved per programming language.
 *     parameters:
 *       - $ref: '#/components/parameters/username'
 *     responses:
 *       200:
 *         description: Language stats
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LanguageStats'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
app.get('/:username/language', leetcode.languageStats);

/**
 * @openapi
 * /{username}/progress:
 *   get:
 *     tags: [User]
 *     summary: Get user progress stats
 *     description: Returns the user's question progress stats across difficulty levels.
 *     parameters:
 *       - $ref: '#/components/parameters/username'
 *     responses:
 *       200:
 *         description: Progress stats
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 numAcceptedQuestions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       difficulty:
 *                         type: string
 *                       count:
 *                         type: integer
 *                 numFailedQuestions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       difficulty:
 *                         type: string
 *                       count:
 *                         type: integer
 *                 numUntouchedQuestions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       difficulty:
 *                         type: string
 *                       count:
 *                         type: integer
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
app.get('/:username/progress/', leetcode.progress);

// ── Deprecated routes ─────────────────────────────────────────────────────────

/**
 * @openapi
 * /userProfile/{id}:
 *   get:
 *     tags: [Deprecated]
 *     summary: "[Deprecated] Get user profile"
 *     description: "**Deprecated** — use `/{username}/profile` instead. Will be removed in a future version."
 *     deprecated: true
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: LeetCode username
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User profile data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
app.get('/userProfile/:id', leetcode.userProfile_);

/**
 * @openapi
 * /dailyQuestion:
 *   get:
 *     tags: [Deprecated]
 *     summary: "[Deprecated] Get daily question"
 *     description: "**Deprecated** — use `/daily` instead. Will be removed in a future version."
 *     deprecated: true
 *     responses:
 *       200:
 *         description: Daily question data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: LeetCode GraphQL error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
app.get('/dailyQuestion', leetcode.dailyQuestion_);

/**
 * @openapi
 * /selectQuestion:
 *   get:
 *     tags: [Deprecated]
 *     summary: "[Deprecated] Get selected question (raw)"
 *     description: "**Deprecated** — use `/select/raw` instead. Will be removed in a future version."
 *     deprecated: true
 *     parameters:
 *       - $ref: '#/components/parameters/titleSlug'
 *     responses:
 *       200:
 *         description: Raw problem data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
app.get('/selectQuestion', leetcode.selectProblemRaw);

/**
 * @openapi
 * /skillStats/{username}:
 *   get:
 *     tags: [Deprecated]
 *     summary: "[Deprecated] Get skill stats"
 *     description: "**Deprecated** — use `/{username}/skill` instead. Will be removed in a future version."
 *     deprecated: true
 *     parameters:
 *       - $ref: '#/components/parameters/username'
 *     responses:
 *       200:
 *         description: Skill stats
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SkillStats'
 */
app.get('/skillStats/:username', leetcode.skillStats_);

/**
 * @openapi
 * /userProfileUserQuestionProgressV2/{userSlug}:
 *   get:
 *     tags: [Deprecated]
 *     summary: "[Deprecated] Get user question progress"
 *     description: "**Deprecated** — use `/{username}/progress` instead. Will be removed in a future version."
 *     deprecated: true
 *     parameters:
 *       - name: userSlug
 *         in: path
 *         required: true
 *         description: LeetCode username
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Progress stats
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
app.get(
  '/userProfileUserQuestionProgressV2/:userSlug',
  leetcode.userProfileUserQuestionProgressV2_,
);

/**
 * @openapi
 * /languageStats:
 *   get:
 *     tags: [Deprecated]
 *     summary: "[Deprecated] Get language stats"
 *     description: "**Deprecated** — use `/{username}/language` instead. Will be removed in a future version."
 *     deprecated: true
 *     parameters:
 *       - name: username
 *         in: query
 *         required: true
 *         description: LeetCode username
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Language stats
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LanguageStats'
 */
app.get('/languageStats', leetcode.languageStats_);

/**
 * @openapi
 * /userContestRankingInfo/{username}:
 *   get:
 *     tags: [Deprecated]
 *     summary: "[Deprecated] Get user contest ranking info"
 *     description: "**Deprecated** — use `/{username}/contest` instead. Will be removed in a future version."
 *     deprecated: true
 *     parameters:
 *       - $ref: '#/components/parameters/username'
 *     responses:
 *       200:
 *         description: Contest ranking info
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ContestInfo'
 */
app.get('/userContestRankingInfo/:username', leetcode.userContestRankingInfo_);

export default app;
