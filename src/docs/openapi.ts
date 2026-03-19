export const openApiSpec = {
  openapi: '3.1.0',
  info: {
    title: 'Alfa LeetCode API',
    version: '2.0.3',
    description:
      'REST API for LeetCode user profiles, problems, contests, and discussions. This specification is generated from the current Express routes and formatter output.',
    contact: {
      name: 'alfa-leetcode-api',
      url: 'https://github.com/alfaarghya/alfa-leetcode-api',
    },
    license: {
      name: 'MIT',
      url: 'https://github.com/alfaarghya/alfa-leetcode-api/blob/main/LICENSE',
    },
  },
  servers: [
    {
      url: 'https://alfa-leetcode-api.onrender.com/',
      description: 'Production',
    },
  ],
  tags: [
    { name: 'Meta', description: 'API metadata and docs endpoints' },
    { name: 'User', description: 'LeetCode user related endpoints' },
    { name: 'Problems', description: 'LeetCode problems and solutions' },
    { name: 'Contests', description: 'LeetCode contests' },
    { name: 'Discussion', description: 'LeetCode discuss endpoints' },
    { name: 'Legacy', description: 'Backward-compatible legacy endpoints' },
  ],
  paths: {
    '/': {
      get: {
        tags: ['Meta'],
        summary: 'API overview',
        description:
          'Returns a JSON overview of endpoint groups and quick route hints.',
        operationId: 'getApiOverview',
        responses: {
          '200': {
            description: 'Overview payload',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiOverviewResponse' },
              },
            },
          },
        },
      },
    },
    '/openapi.json': {
      get: {
        tags: ['Meta'],
        summary: 'OpenAPI document',
        description: 'Returns the full OpenAPI JSON used by Swagger UI.',
        operationId: 'getOpenApiDocument',
        responses: {
          '200': {
            description: 'OpenAPI JSON document',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  description: 'OpenAPI specification document',
                  additionalProperties: true,
                },
              },
            },
          },
        },
      },
    },
    '/docs': {
      get: {
        tags: ['Meta'],
        summary: 'Swagger UI',
        description: 'Interactive API documentation interface.',
        operationId: 'getSwaggerUi',
        responses: {
          '200': {
            description: 'Swagger UI page',
            content: {
              'text/html': {
                schema: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
    '/daily': {
      get: {
        tags: ['Problems'],
        summary: 'Get daily problem (formatted)',
        operationId: 'getDailyProblem',
        responses: {
          '200': {
            description: 'Formatted daily problem payload',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/DailyProblemResponse' },
              },
            },
          },
        },
      },
    },
    '/daily/raw': {
      get: {
        tags: ['Problems'],
        summary: 'Get daily problem (raw)',
        operationId: 'getDailyProblemRaw',
        responses: {
          '200': {
            description: 'Raw GraphQL daily challenge payload',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    activeDailyCodingChallengeQuestion: {
                      $ref: '#/components/schemas/DailyChallengeQuestion',
                    },
                  },
                  required: ['activeDailyCodingChallengeQuestion'],
                },
              },
            },
          },
        },
      },
    },
    '/select': {
      get: {
        tags: ['Problems'],
        summary: 'Get selected problem (formatted)',
        operationId: 'getSelectedProblem',
        parameters: [
          {
            name: 'titleSlug',
            in: 'query',
            required: true,
            schema: { type: 'string' },
            description: 'Problem title slug, e.g. two-sum',
            example: 'two-sum',
          },
        ],
        responses: {
          '200': {
            description: 'Formatted selected problem payload',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SelectedProblemResponse',
                },
              },
            },
          },
          '400': {
            description: 'Missing titleSlug query parameter',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ValidationErrorResponse',
                },
              },
            },
          },
        },
      },
    },
    '/select/raw': {
      get: {
        tags: ['Problems'],
        summary: 'Get selected problem (raw)',
        operationId: 'getSelectedProblemRaw',
        parameters: [
          {
            name: 'titleSlug',
            in: 'query',
            required: true,
            schema: { type: 'string' },
            description: 'Problem title slug, e.g. two-sum',
            example: 'two-sum',
          },
        ],
        responses: {
          '200': {
            description: 'Raw GraphQL selected problem payload',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    question: { $ref: '#/components/schemas/ProblemQuestion' },
                  },
                  required: ['question'],
                },
              },
            },
          },
          '400': {
            description: 'Missing titleSlug query parameter',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ValidationErrorResponse',
                },
              },
            },
          },
        },
      },
    },
    '/officialSolution': {
      get: {
        tags: ['Problems'],
        summary: 'Get official solution',
        operationId: 'getOfficialSolution',
        parameters: [
          {
            name: 'titleSlug',
            in: 'query',
            required: true,
            schema: { type: 'string' },
            description: 'Problem title slug, e.g. two-sum',
            example: 'two-sum',
          },
        ],
        responses: {
          '200': {
            description: 'Official solution payload',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    question: {
                      type: 'object',
                      properties: {
                        solution: {
                          $ref: '#/components/schemas/OfficialSolution',
                        },
                      },
                      required: ['solution'],
                    },
                  },
                  required: ['question'],
                },
              },
            },
          },
          '400': {
            description: 'Missing titleSlug query parameter',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: { type: 'string' },
                  },
                  required: ['error'],
                },
              },
            },
          },
        },
      },
    },
    '/problems': {
      get: {
        tags: ['Problems'],
        summary: 'List problems',
        description:
          'Returns a filtered list of LeetCode problems. Defaults: limit=20 and skip=0. If only skip is provided, limit is forced to 1 by current implementation.',
        operationId: 'getProblems',
        parameters: [
          {
            name: 'limit',
            in: 'query',
            required: false,
            schema: { type: 'integer', minimum: 0, default: 20 },
            description: 'Maximum number of problems to return.',
          },
          {
            name: 'skip',
            in: 'query',
            required: false,
            schema: { type: 'integer', minimum: 0, default: 0 },
            description: 'Number of problems to skip.',
          },
          {
            name: 'tags',
            in: 'query',
            required: false,
            schema: { type: 'string' },
            description:
              'Tag filter. Multiple tags can be sent with + or URL-encoded spaces.',
            example: 'array+math',
          },
          {
            name: 'difficulty',
            in: 'query',
            required: false,
            schema: { type: 'string', enum: ['EASY', 'MEDIUM', 'HARD'] },
            description: 'Difficulty filter.',
          },
        ],
        responses: {
          '200': {
            description: 'Problem list',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ProblemListResponse' },
              },
            },
          },
          '400': {
            description: 'Validation error from upstream GraphQL',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { type: 'object', additionalProperties: true },
                },
              },
            },
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { error: { type: 'string' } },
                  required: ['error'],
                },
              },
            },
          },
        },
      },
    },
    '/contests': {
      get: {
        tags: ['Contests'],
        summary: 'Get all contests',
        operationId: 'getAllContests',
        responses: {
          '200': {
            description: 'All contest entries',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    allContests: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Contest' },
                    },
                  },
                  required: ['allContests'],
                },
              },
            },
          },
        },
      },
    },
    '/contests/upcoming': {
      get: {
        tags: ['Contests'],
        summary: 'Get upcoming contests',
        operationId: 'getUpcomingContests',
        responses: {
          '200': {
            description: 'Only upcoming contests',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    count: { type: 'integer' },
                    contests: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Contest' },
                    },
                  },
                  required: ['count', 'contests'],
                },
              },
            },
          },
        },
      },
    },
    '/trendingDiscuss': {
      get: {
        tags: ['Discussion'],
        summary: 'Get trending discussions',
        operationId: 'getTrendingDiscussion',
        parameters: [
          {
            name: 'first',
            in: 'query',
            required: true,
            schema: { type: 'integer', minimum: 0 },
            description: 'Number of trending topics to fetch.',
            example: 20,
          },
        ],
        responses: {
          '200': {
            description: 'Trending discussions payload',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    cachedTrendingCategoryTopics: {
                      type: 'array',
                      items: {
                        $ref: '#/components/schemas/TrendingCategoryTopic',
                      },
                    },
                  },
                  required: ['cachedTrendingCategoryTopics'],
                },
              },
            },
          },
          '400': {
            description: 'Missing or invalid first parameter',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ValidationErrorResponse',
                },
              },
            },
          },
        },
      },
    },
    '/discussTopic/{topicId}': {
      get: {
        tags: ['Discussion'],
        summary: 'Get discussion topic',
        operationId: 'getDiscussionTopic',
        parameters: [
          {
            name: 'topicId',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
            description: 'Discussion topic id',
          },
        ],
        responses: {
          '200': {
            description: 'Discussion topic payload',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    topic: { $ref: '#/components/schemas/DiscussTopic' },
                  },
                  required: ['topic'],
                },
              },
            },
          },
        },
      },
    },
    '/discussComments/{topicId}': {
      get: {
        tags: ['Discussion'],
        summary: 'Get discussion comments',
        operationId: 'getDiscussionComments',
        parameters: [
          {
            name: 'topicId',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
            description: 'Discussion topic id',
          },
          {
            name: 'orderBy',
            in: 'query',
            required: false,
            schema: { type: 'string', default: 'newest_to_oldest' },
            description: 'Comment order strategy.',
          },
          {
            name: 'pageNo',
            in: 'query',
            required: false,
            schema: { type: 'integer', minimum: 1, default: 1 },
            description: 'Page number.',
          },
          {
            name: 'numPerPage',
            in: 'query',
            required: false,
            schema: { type: 'integer', minimum: 1, default: 10 },
            description: 'Items per page.',
          },
        ],
        responses: {
          '200': {
            description: 'Discussion comments payload',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    topicComments: {
                      type: 'object',
                      properties: {
                        data: {
                          type: 'array',
                          items: {
                            $ref: '#/components/schemas/DiscussComment',
                          },
                        },
                      },
                      required: ['data'],
                    },
                  },
                  required: ['topicComments'],
                },
              },
            },
          },
        },
      },
    },
    '/{username}': {
      get: {
        tags: ['User'],
        summary: 'Get user profile summary',
        operationId: 'getUserSummary',
        parameters: [
          {
            name: 'username',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': {
            description: 'User summary profile',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/UserSummaryResponse' },
              },
            },
          },
        },
      },
    },
    '/{username}/badges': {
      get: {
        tags: ['User'],
        summary: 'Get user badges',
        operationId: 'getUserBadges',
        parameters: [
          {
            name: 'username',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': {
            description: 'User badges payload',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/UserBadgesResponse' },
              },
            },
          },
        },
      },
    },
    '/{username}/solved': {
      get: {
        tags: ['User'],
        summary: 'Get solved problem statistics',
        operationId: 'getSolvedStats',
        parameters: [
          {
            name: 'username',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': {
            description: 'Solved stats payload',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SolvedStatsResponse' },
              },
            },
          },
        },
      },
    },
    '/{username}/contest': {
      get: {
        tags: ['User'],
        summary: 'Get user contest summary and participation',
        operationId: 'getUserContest',
        parameters: [
          {
            name: 'username',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': {
            description: 'Contest summary payload',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/UserContestResponse' },
              },
            },
          },
        },
      },
    },
    '/{username}/contest/history': {
      get: {
        tags: ['User'],
        summary: 'Get full contest history',
        operationId: 'getUserContestHistory',
        parameters: [
          {
            name: 'username',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': {
            description: 'Contest history payload',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ContestHistoryResponse' },
              },
            },
          },
        },
      },
    },
    '/{username}/submission': {
      get: {
        tags: ['User'],
        summary: 'Get recent submissions',
        operationId: 'getRecentSubmissions',
        parameters: [
          {
            name: 'username',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
          {
            name: 'limit',
            in: 'query',
            required: false,
            schema: { type: 'integer', minimum: 0, default: 20 },
            description: 'Maximum number of items. Default is 20.',
          },
        ],
        responses: {
          '200': {
            description: 'Recent submission payload',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SubmissionListResponse' },
              },
            },
          },
        },
      },
    },
    '/{username}/acSubmission': {
      get: {
        tags: ['User'],
        summary: 'Get recent accepted submissions',
        operationId: 'getRecentAcceptedSubmissions',
        parameters: [
          {
            name: 'username',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
          {
            name: 'limit',
            in: 'query',
            required: false,
            schema: { type: 'integer', minimum: 0, default: 20 },
            description: 'Maximum number of items. Default is 20.',
          },
        ],
        responses: {
          '200': {
            description: 'Recent accepted submission payload',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SubmissionListResponse' },
              },
            },
          },
        },
      },
    },
    '/{username}/calendar': {
      get: {
        tags: ['User'],
        summary: 'Get submission calendar',
        operationId: 'getUserCalendar',
        parameters: [
          {
            name: 'username',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
          {
            name: 'year',
            in: 'query',
            required: false,
            schema: { type: 'integer', minimum: 0, default: 0 },
            description:
              'Calendar year. Default 0 (current behavior fallback).',
          },
        ],
        responses: {
          '200': {
            description: 'Calendar payload',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SubmissionCalendarResponse',
                },
              },
            },
          },
        },
      },
    },
    '/{username}/skill': {
      get: {
        tags: ['User'],
        summary: 'Get user skill stats',
        operationId: 'getUserSkillStats',
        parameters: [
          {
            name: 'username',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': {
            description: 'Skill stats payload',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SkillStatsResponse' },
              },
            },
          },
        },
      },
    },
    '/{username}/profile': {
      get: {
        tags: ['User'],
        summary: 'Get full profile in one request',
        operationId: 'getFullUserProfile',
        parameters: [
          {
            name: 'username',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': {
            description: 'Combined profile payload',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/FullUserProfileResponse',
                },
              },
            },
          },
        },
      },
    },
    '/{username}/language': {
      get: {
        tags: ['User'],
        summary: 'Get language stats',
        operationId: 'getUserLanguageStats',
        parameters: [
          {
            name: 'username',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': {
            description: 'Language stats payload',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/LanguageStatsResponse' },
              },
            },
          },
        },
      },
    },
    '/{username}/progress': {
      get: {
        tags: ['User'],
        summary: 'Get question progress stats',
        operationId: 'getUserProgressStats',
        parameters: [
          {
            name: 'username',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': {
            description: 'Question progress payload',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ProgressStatsResponse' },
              },
            },
          },
        },
      },
    },
    '/userProfile/{id}': {
      get: {
        tags: ['Legacy'],
        summary: 'Legacy full profile endpoint',
        description: 'Deprecated route maintained for backward compatibility.',
        deprecated: true,
        operationId: 'legacyUserProfileById',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': {
            description: 'Combined profile payload',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/FullUserProfileResponse',
                },
              },
            },
          },
        },
      },
    },
    '/dailyQuestion': {
      get: {
        tags: ['Legacy'],
        summary: 'Legacy daily question endpoint',
        description: 'Deprecated route maintained for backward compatibility.',
        deprecated: true,
        operationId: 'legacyDailyQuestion',
        responses: {
          '200': {
            description: 'Raw GraphQL daily challenge payload',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    activeDailyCodingChallengeQuestion: {
                      $ref: '#/components/schemas/DailyChallengeQuestion',
                    },
                  },
                  required: ['activeDailyCodingChallengeQuestion'],
                },
              },
            },
          },
        },
      },
    },
    '/skillStats/{username}': {
      get: {
        tags: ['Legacy'],
        summary: 'Legacy skill stats endpoint',
        description: 'Deprecated route maintained for backward compatibility.',
        deprecated: true,
        operationId: 'legacySkillStats',
        parameters: [
          {
            name: 'username',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': {
            description: 'Raw GraphQL skill payload',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    matchedUser: {
                      type: 'object',
                      properties: {
                        tagProblemCounts: {
                          type: 'object',
                          additionalProperties: true,
                        },
                      },
                    },
                  },
                  additionalProperties: true,
                },
              },
            },
          },
        },
      },
    },
    '/userProfileUserQuestionProgressV2/{userSlug}': {
      get: {
        tags: ['Legacy'],
        summary: 'Legacy progress endpoint',
        description: 'Deprecated route maintained for backward compatibility.',
        deprecated: true,
        operationId: 'legacyUserProgress',
        parameters: [
          {
            name: 'userSlug',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': {
            description: 'Raw GraphQL progress payload',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    userProfileUserQuestionProgressV2: {
                      type: 'object',
                      additionalProperties: true,
                    },
                  },
                  additionalProperties: true,
                },
              },
            },
          },
        },
      },
    },
    '/languageStats': {
      get: {
        tags: ['Legacy'],
        summary: 'Legacy language stats endpoint',
        description: 'Deprecated route maintained for backward compatibility.',
        deprecated: true,
        operationId: 'legacyLanguageStats',
        parameters: [
          {
            name: 'username',
            in: 'query',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': {
            description: 'Raw GraphQL language stats payload',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    matchedUser: {
                      type: 'object',
                      properties: {
                        languageProblemCount: {
                          type: 'array',
                          items: {
                            $ref: '#/components/schemas/LanguageProblemCount',
                          },
                        },
                      },
                    },
                  },
                  additionalProperties: true,
                },
              },
            },
          },
          '400': {
            description: 'Missing username parameter',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ValidationErrorResponse',
                },
              },
            },
          },
        },
      },
    },
    '/userContestRankingInfo/{username}': {
      get: {
        tags: ['Legacy'],
        summary: 'Legacy user contest ranking endpoint',
        description: 'Deprecated route maintained for backward compatibility.',
        deprecated: true,
        operationId: 'legacyContestRankingInfo',
        parameters: [
          {
            name: 'username',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': {
            description: 'Raw GraphQL contest ranking payload',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  additionalProperties: true,
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      ApiOverviewResponse: {
        type: 'object',
        properties: {
          apiOverview: { type: 'string' },
          apiEndpointsLink: { type: 'string', format: 'uri' },
          routes: {
            type: 'object',
            additionalProperties: true,
          },
        },
        required: ['apiOverview', 'apiEndpointsLink', 'routes'],
      },
      ValidationErrorResponse: {
        type: 'object',
        properties: {
          error: { type: 'string' },
          solution: { type: 'string' },
          example: { type: 'string' },
        },
        required: ['error'],
      },
      Badge: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          icon: { type: 'string' },
          id: { type: 'string' },
          displayName: { type: 'string' },
          creationDate: { type: 'number' },
        },
        additionalProperties: true,
      },
      UserSummaryResponse: {
        type: 'object',
        properties: {
          username: { type: 'string' },
          name: { type: 'string' },
          birthday: { type: 'string', nullable: true },
          avatar: { type: 'string' },
          ranking: { type: 'number' },
          reputation: { type: 'number' },
          gitHub: { type: 'string', nullable: true },
          twitter: { type: 'string', nullable: true },
          linkedIN: { type: 'string', nullable: true },
          website: { type: 'array', items: { type: 'string' } },
          country: { type: 'string', nullable: true },
          company: { type: 'string', nullable: true },
          school: { type: 'string', nullable: true },
          skillTags: { type: 'array', items: { type: 'string' } },
          about: { type: 'string', nullable: true },
        },
        required: ['username', 'name', 'avatar', 'ranking', 'reputation'],
      },
      UserBadgesResponse: {
        type: 'object',
        properties: {
          badgesCount: { type: 'integer' },
          badges: {
            type: 'array',
            items: { $ref: '#/components/schemas/Badge' },
          },
          upcomingBadges: {
            type: 'array',
            items: { $ref: '#/components/schemas/Badge' },
          },
          activeBadge: { $ref: '#/components/schemas/Badge' },
        },
        required: ['badgesCount', 'badges', 'upcomingBadges'],
      },
      DifficultyCountItem: {
        type: 'object',
        properties: {
          difficulty: { type: 'string' },
          count: { type: 'integer' },
          submissions: { type: 'integer' },
        },
        required: ['difficulty', 'count'],
      },
      SolvedStatsResponse: {
        type: 'object',
        properties: {
          solvedProblem: { type: 'integer' },
          easySolved: { type: 'integer' },
          mediumSolved: { type: 'integer' },
          hardSolved: { type: 'integer' },
          totalSubmissionNum: {
            type: 'array',
            items: { $ref: '#/components/schemas/DifficultyCountItem' },
          },
          acSubmissionNum: {
            type: 'array',
            items: { $ref: '#/components/schemas/DifficultyCountItem' },
          },
        },
        required: [
          'solvedProblem',
          'easySolved',
          'mediumSolved',
          'hardSolved',
          'totalSubmissionNum',
          'acSubmissionNum',
        ],
      },
      ContestSummary: {
        type: 'object',
        properties: {
          name: { type: 'string' },
        },
        additionalProperties: true,
      },
      ContestHistoryItem: {
        type: 'object',
        properties: {
          attended: { type: 'boolean' },
          rating: { type: 'number' },
          ranking: { type: 'number' },
          trendDirection: { type: 'string' },
          problemsSolved: { type: 'number' },
          totalProblems: { type: 'number' },
          finishTimeInSeconds: { type: 'number' },
          contest: {
            type: 'object',
            properties: {
              title: { type: 'string' },
              startTime: { type: 'string' },
            },
            required: ['title', 'startTime'],
          },
        },
        required: ['attended', 'contest'],
      },
      UserContestResponse: {
        type: 'object',
        properties: {
          contestAttend: { type: 'number', nullable: true },
          contestRating: { type: 'number', nullable: true },
          contestGlobalRanking: { type: 'number', nullable: true },
          totalParticipants: { type: 'number', nullable: true },
          contestTopPercentage: { type: 'number', nullable: true },
          contestBadges: {
            oneOf: [
              { $ref: '#/components/schemas/ContestSummary' },
              { type: 'null' },
            ],
          },
          contestParticipation: {
            type: 'array',
            items: { $ref: '#/components/schemas/ContestHistoryItem' },
          },
        },
        required: ['contestParticipation'],
      },
      ContestHistoryResponse: {
        type: 'object',
        properties: {
          count: { type: 'integer' },
          contestHistory: {
            type: 'array',
            items: { $ref: '#/components/schemas/ContestHistoryItem' },
          },
        },
        required: ['count', 'contestHistory'],
      },
      SubmissionItem: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          titleSlug: { type: 'string' },
          timestamp: { type: 'string' },
          statusDisplay: { type: 'string' },
          lang: { type: 'string' },
        },
        required: ['title', 'titleSlug', 'timestamp', 'statusDisplay', 'lang'],
      },
      SubmissionListResponse: {
        type: 'object',
        properties: {
          count: { type: 'integer' },
          submission: {
            type: 'array',
            items: { $ref: '#/components/schemas/SubmissionItem' },
          },
        },
        required: ['count', 'submission'],
      },
      DccBadgeItem: {
        type: 'object',
        properties: {
          timestamp: { type: 'number' },
          badge: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              icon: { type: 'string' },
            },
            required: ['name', 'icon'],
          },
        },
        required: ['timestamp', 'badge'],
      },
      SubmissionCalendarResponse: {
        type: 'object',
        properties: {
          activeYears: { type: 'array', items: { type: 'integer' } },
          streak: { type: 'integer' },
          totalActiveDays: { type: 'integer' },
          dccBadges: {
            type: 'array',
            items: { $ref: '#/components/schemas/DccBadgeItem' },
          },
          submissionCalendar: { type: 'string' },
        },
        required: [
          'activeYears',
          'streak',
          'totalActiveDays',
          'dccBadges',
          'submissionCalendar',
        ],
      },
      SkillTagItem: {
        type: 'object',
        properties: {
          tagName: { type: 'string' },
          tagSlug: { type: 'string' },
          problemsSolved: { type: 'integer' },
        },
        required: ['tagName', 'tagSlug', 'problemsSolved'],
      },
      SkillStatsResponse: {
        type: 'object',
        properties: {
          fundamental: {
            type: 'array',
            items: { $ref: '#/components/schemas/SkillTagItem' },
          },
          intermediate: {
            type: 'array',
            items: { $ref: '#/components/schemas/SkillTagItem' },
          },
          advanced: {
            type: 'array',
            items: { $ref: '#/components/schemas/SkillTagItem' },
          },
        },
        required: ['fundamental', 'intermediate', 'advanced'],
      },
      LanguageProblemCount: {
        type: 'object',
        properties: {
          languageName: { type: 'string' },
          problemsSolved: { type: 'integer' },
        },
        required: ['languageName', 'problemsSolved'],
      },
      LanguageStatsResponse: {
        type: 'object',
        properties: {
          languageProblemCount: {
            type: 'array',
            items: { $ref: '#/components/schemas/LanguageProblemCount' },
          },
        },
        required: ['languageProblemCount'],
      },
      ProgressDifficultyCount: {
        type: 'object',
        properties: {
          count: { type: 'integer' },
          difficulty: { type: 'string' },
        },
        required: ['count', 'difficulty'],
      },
      UserSessionBeatItem: {
        type: 'object',
        properties: {
          difficulty: { type: 'string' },
          percentage: { type: 'number' },
        },
        required: ['difficulty', 'percentage'],
      },
      ProgressStatsCore: {
        type: 'object',
        properties: {
          numAcceptedQuestions: {
            type: 'array',
            items: { $ref: '#/components/schemas/ProgressDifficultyCount' },
          },
          numFailedQuestions: {
            type: 'array',
            items: { $ref: '#/components/schemas/ProgressDifficultyCount' },
          },
          numUntouchedQuestions: {
            type: 'array',
            items: { $ref: '#/components/schemas/ProgressDifficultyCount' },
          },
          userSessionBeatsPercentage: {
            type: 'array',
            items: { $ref: '#/components/schemas/UserSessionBeatItem' },
          },
        },
        required: [
          'numAcceptedQuestions',
          'numFailedQuestions',
          'numUntouchedQuestions',
          'userSessionBeatsPercentage',
        ],
      },
      ProgressStatsResponse: {
        type: 'object',
        properties: {
          numAcceptedQuestions: {
            $ref: '#/components/schemas/ProgressStatsCore',
          },
        },
        required: ['numAcceptedQuestions'],
      },
      FullUserProfileResponse: {
        type: 'object',
        properties: {
          totalSolved: { type: 'integer' },
          totalSubmissions: {
            oneOf: [
              {
                type: 'array',
                items: { $ref: '#/components/schemas/DifficultyCountItem' },
              },
              { type: 'object', additionalProperties: true },
            ],
          },
          totalQuestions: { type: 'integer' },
          easySolved: { type: 'integer' },
          totalEasy: { type: 'integer' },
          mediumSolved: { type: 'integer' },
          totalMedium: { type: 'integer' },
          hardSolved: { type: 'integer' },
          totalHard: { type: 'integer' },
          ranking: { type: 'number' },
          contributionPoint: { type: 'number' },
          reputation: { type: 'number' },
          submissionCalendar: {
            type: 'object',
            additionalProperties: { type: 'integer' },
          },
          recentSubmissions: {
            type: 'array',
            items: { $ref: '#/components/schemas/SubmissionItem' },
          },
          matchedUserStats: {
            type: 'object',
            additionalProperties: true,
          },
        },
        required: [
          'totalSolved',
          'totalQuestions',
          'easySolved',
          'mediumSolved',
          'hardSolved',
          'ranking',
          'reputation',
          'submissionCalendar',
          'recentSubmissions',
        ],
      },
      TopicTag: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          slug: { type: 'string' },
          translatedName: { type: 'string', nullable: true },
          id: { type: 'string', nullable: true },
        },
        required: ['name', 'slug'],
      },
      QuestionSolutionSummary: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          canSeeDetail: { type: 'boolean' },
          paidOnly: { type: 'boolean' },
          hasVideoSolution: { type: 'boolean' },
          paidOnlyVideo: { type: 'boolean' },
        },
        additionalProperties: true,
      },
      ProblemQuestion: {
        type: 'object',
        properties: {
          questionId: { type: 'string' },
          questionFrontendId: {
            oneOf: [{ type: 'string' }, { type: 'integer' }],
          },
          title: { type: 'string' },
          titleSlug: { type: 'string' },
          content: { type: 'string' },
          difficulty: { type: 'string' },
          isPaidOnly: { type: 'boolean' },
          likes: { type: 'integer' },
          dislikes: { type: 'integer' },
          similarQuestions: { type: 'string' },
          exampleTestcases: { type: 'string' },
          topicTags: {
            type: 'array',
            items: { $ref: '#/components/schemas/TopicTag' },
          },
          hints: {
            oneOf: [
              { type: 'array', items: { type: 'string' } },
              {
                type: 'array',
                items: { type: 'object', additionalProperties: true },
              },
            ],
          },
          solution: {
            oneOf: [
              { $ref: '#/components/schemas/QuestionSolutionSummary' },
              { type: 'null' },
            ],
          },
          companyTagStats: {
            oneOf: [
              { type: 'string' },
              { type: 'array', items: { type: 'string' } },
              { type: 'null' },
            ],
          },
        },
        required: [
          'questionId',
          'questionFrontendId',
          'title',
          'titleSlug',
          'content',
          'difficulty',
          'isPaidOnly',
          'likes',
          'dislikes',
          'topicTags',
        ],
      },
      DailyChallengeQuestion: {
        type: 'object',
        properties: {
          date: { type: 'string' },
          link: { type: 'string' },
          question: { $ref: '#/components/schemas/ProblemQuestion' },
        },
        required: ['date', 'link', 'question'],
      },
      DailyProblemResponse: {
        type: 'object',
        properties: {
          questionLink: { type: 'string', format: 'uri' },
          date: { type: 'string' },
          questionId: { type: 'string' },
          questionFrontendId: {
            oneOf: [{ type: 'string' }, { type: 'integer' }],
          },
          questionTitle: { type: 'string' },
          titleSlug: { type: 'string' },
          difficulty: { type: 'string' },
          isPaidOnly: { type: 'boolean' },
          question: { type: 'string' },
          exampleTestcases: { type: 'string' },
          topicTags: {
            type: 'array',
            items: { $ref: '#/components/schemas/TopicTag' },
          },
          hints: {
            oneOf: [
              { type: 'array', items: { type: 'string' } },
              {
                type: 'array',
                items: { type: 'object', additionalProperties: true },
              },
            ],
          },
          solution: {
            oneOf: [
              { $ref: '#/components/schemas/QuestionSolutionSummary' },
              { type: 'null' },
            ],
          },
          companyTagStats: {
            oneOf: [
              { type: 'string' },
              { type: 'array', items: { type: 'string' } },
              { type: 'null' },
            ],
          },
          likes: { type: 'integer' },
          dislikes: { type: 'integer' },
          similarQuestions: { type: 'string' },
        },
        required: [
          'questionLink',
          'date',
          'questionId',
          'questionFrontendId',
          'questionTitle',
          'titleSlug',
          'difficulty',
          'isPaidOnly',
          'question',
          'exampleTestcases',
          'topicTags',
          'likes',
          'dislikes',
        ],
      },
      SelectedProblemResponse: {
        type: 'object',
        properties: {
          link: { type: 'string', format: 'uri' },
          questionId: { type: 'string' },
          questionFrontendId: {
            oneOf: [{ type: 'string' }, { type: 'integer' }],
          },
          questionTitle: { type: 'string' },
          titleSlug: { type: 'string' },
          difficulty: { type: 'string' },
          isPaidOnly: { type: 'boolean' },
          question: { type: 'string' },
          exampleTestcases: { type: 'string' },
          topicTags: {
            type: 'array',
            items: { $ref: '#/components/schemas/TopicTag' },
          },
          hints: {
            oneOf: [
              { type: 'array', items: { type: 'string' } },
              {
                type: 'array',
                items: { type: 'object', additionalProperties: true },
              },
            ],
          },
          solution: {
            oneOf: [
              { $ref: '#/components/schemas/QuestionSolutionSummary' },
              { type: 'null' },
            ],
          },
          companyTagStats: {
            oneOf: [
              { type: 'string' },
              { type: 'array', items: { type: 'string' } },
              { type: 'null' },
            ],
          },
          likes: { type: 'integer' },
          dislikes: { type: 'integer' },
          similarQuestions: { type: 'string' },
        },
        required: [
          'link',
          'questionId',
          'questionFrontendId',
          'questionTitle',
          'titleSlug',
          'difficulty',
          'isPaidOnly',
          'question',
          'exampleTestcases',
          'topicTags',
          'likes',
          'dislikes',
        ],
      },
      ProblemListItem: {
        type: 'object',
        properties: {
          acRate: { type: 'number' },
          difficulty: { type: 'string' },
          freqBar: { type: 'number', nullable: true },
          questionFrontendId: {
            oneOf: [{ type: 'string' }, { type: 'integer' }],
          },
          isFavor: { type: 'boolean' },
          isPaidOnly: { type: 'boolean' },
          status: { type: 'string', nullable: true },
          title: { type: 'string' },
          titleSlug: { type: 'string' },
          topicTags: {
            type: 'array',
            items: { $ref: '#/components/schemas/TopicTag' },
          },
          hasSolution: { type: 'boolean' },
          hasVideoSolution: { type: 'boolean' },
        },
        required: [
          'acRate',
          'difficulty',
          'questionFrontendId',
          'isFavor',
          'isPaidOnly',
          'title',
          'titleSlug',
          'topicTags',
          'hasSolution',
          'hasVideoSolution',
        ],
      },
      ProblemListResponse: {
        type: 'object',
        properties: {
          totalQuestions: { type: 'integer' },
          count: { type: 'integer' },
          problemsetQuestionList: {
            type: 'array',
            items: { $ref: '#/components/schemas/ProblemListItem' },
          },
        },
        required: ['totalQuestions', 'count', 'problemsetQuestionList'],
      },
      Contest: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          titleSlug: { type: 'string' },
          startTime: { type: 'number' },
          duration: { type: 'number' },
          originStartTime: { type: 'number' },
          isVirtual: { type: 'boolean' },
          containsPremium: { type: 'boolean' },
        },
        required: [
          'title',
          'titleSlug',
          'startTime',
          'duration',
          'originStartTime',
          'isVirtual',
          'containsPremium',
        ],
      },
      DiscussAuthorBadge: {
        type: 'object',
        properties: {
          displayName: { type: 'string' },
          icon: { type: 'string' },
        },
        additionalProperties: true,
      },
      DiscussAuthor: {
        type: 'object',
        properties: {
          isDiscussAdmin: { type: 'boolean' },
          isDiscussStaff: { type: 'boolean' },
          username: { type: 'string' },
          nameColor: { type: 'string', nullable: true },
          activeBadge: {
            oneOf: [
              { $ref: '#/components/schemas/DiscussAuthorBadge' },
              { type: 'null' },
            ],
          },
          profile: {
            type: 'object',
            properties: {
              userAvatar: { type: 'string' },
              reputation: { type: 'number' },
            },
            required: ['userAvatar'],
          },
          isActive: { type: 'boolean' },
        },
        required: ['username', 'profile'],
      },
      CoinReward: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          score: { type: 'number' },
          description: { type: 'string' },
          date: { type: 'number' },
        },
        additionalProperties: true,
      },
      DiscussPost: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          voteCount: { type: 'number' },
          voteStatus: { type: 'number' },
          content: { type: 'string' },
          updationDate: { type: 'number' },
          creationDate: { type: 'number' },
          status: { type: 'string' },
          isHidden: { type: 'boolean' },
          coinRewards: {
            type: 'array',
            items: { $ref: '#/components/schemas/CoinReward' },
          },
          author: { $ref: '#/components/schemas/DiscussAuthor' },
          authorIsModerator: { type: 'boolean' },
          isOwnPost: { type: 'boolean' },
        },
        required: ['id', 'content', 'creationDate', 'author'],
      },
      DiscussTopic: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          viewCount: { type: 'number' },
          topLevelCommentCount: { type: 'number' },
          subscribed: { type: 'boolean' },
          title: { type: 'string' },
          pinned: { type: 'boolean' },
          tags: { type: 'array', items: { type: 'string' } },
          hideFromTrending: { type: 'boolean' },
          post: { $ref: '#/components/schemas/DiscussPost' },
        },
        required: ['id', 'title', 'post'],
      },
      DiscussComment: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          pinned: { type: 'boolean' },
          pinnedBy: {
            type: 'object',
            properties: {
              username: { type: 'string' },
            },
            additionalProperties: true,
          },
          post: { $ref: '#/components/schemas/DiscussPost' },
          numChildren: { type: 'number' },
        },
        required: ['id', 'post', 'numChildren'],
      },
      TrendingPostAuthor: {
        type: 'object',
        properties: {
          username: { type: 'string' },
          isActive: { type: 'boolean' },
          profile: {
            type: 'object',
            properties: {
              userAvatar: { type: 'string' },
            },
            required: ['userAvatar'],
          },
        },
        required: ['username', 'isActive', 'profile'],
      },
      TrendingPost: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          creationDate: { type: 'number' },
          contentPreview: { type: 'string' },
          author: { $ref: '#/components/schemas/TrendingPostAuthor' },
        },
        required: ['id', 'creationDate', 'contentPreview', 'author'],
      },
      TrendingCategoryTopic: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          title: { type: 'string' },
          post: { $ref: '#/components/schemas/TrendingPost' },
        },
        required: ['id', 'title', 'post'],
      },
      SolutionRating: {
        type: 'object',
        properties: {
          count: { type: 'number' },
          average: { type: 'number' },
          userRating: {
            type: 'object',
            properties: {
              score: { type: 'number' },
            },
            additionalProperties: true,
          },
        },
        additionalProperties: true,
      },
      OfficialSolutionTopicPost: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          status: { type: 'string' },
          creationDate: { type: 'number' },
          author: {
            type: 'object',
            properties: {
              username: { type: 'string' },
              isActive: { type: 'boolean' },
              profile: {
                type: 'object',
                properties: {
                  userAvatar: { type: 'string' },
                  reputation: { type: 'number' },
                },
                additionalProperties: true,
              },
            },
            additionalProperties: true,
          },
        },
        additionalProperties: true,
      },
      OfficialSolutionTopic: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          commentCount: { type: 'number' },
          topLevelCommentCount: { type: 'number' },
          viewCount: { type: 'number' },
          subscribed: { type: 'boolean' },
          solutionTags: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                slug: { type: 'string' },
              },
              required: ['name', 'slug'],
            },
          },
          post: { $ref: '#/components/schemas/OfficialSolutionTopicPost' },
        },
        additionalProperties: true,
      },
      OfficialSolution: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          title: { type: 'string' },
          content: { type: 'string' },
          contentTypeId: { type: 'string' },
          paidOnly: { type: 'boolean' },
          hasVideoSolution: { type: 'boolean' },
          paidOnlyVideo: { type: 'boolean' },
          canSeeDetail: { type: 'boolean' },
          rating: { $ref: '#/components/schemas/SolutionRating' },
          topic: { $ref: '#/components/schemas/OfficialSolutionTopic' },
        },
        additionalProperties: true,
      },
    },
  },
} as const;

export const swaggerUiHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Alfa LeetCode API - Swagger UI</title>
    <link
      rel="stylesheet"
      href="https://unpkg.com/swagger-ui-dist@5.17.14/swagger-ui.css"
    />
    <style>
      html {
        box-sizing: border-box;
      }
      *,
      *:before,
      *:after {
        box-sizing: inherit;
      }
      body {
        margin: 0;
        background: #fafafa;
      }
    </style>
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5.17.14/swagger-ui-bundle.js"></script>
    <script src="https://unpkg.com/swagger-ui-dist@5.17.14/swagger-ui-standalone-preset.js"></script>
    <script>
      window.ui = SwaggerUIBundle({
        url: '/openapi.json',
        dom_id: '#swagger-ui',
        deepLinking: true,
        docExpansion: 'list',
        persistAuthorization: false,
        presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
      });
    </script>
  </body>
</html>
`;
