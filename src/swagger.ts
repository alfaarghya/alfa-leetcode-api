import type { Express } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Alfa-LeetCode API',
      version: '2.0.3',
      description:
        'A well-documented REST API wrapper around the LeetCode GraphQL API. ' +
        'Provides endpoints for user profiles, badges, solved questions, contest details, ' +
        'contest history, submissions, daily questions, selected problems, and problem lists.',
      contact: {
        name: 'alfaarghya',
        url: 'https://github.com/alfaarghya/alfa-leetcode-api',
      },
      license: {
        name: 'MIT',
        url: 'https://github.com/alfaarghya/alfa-leetcode-api/blob/main/LICENSE',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local development server',
      },
      {
        url: 'https://alfa-leetcode-api.onrender.com',
        description: 'Production server',
      },
    ],
    components: {
      parameters: {
        username: {
          name: 'username',
          in: 'path',
          required: true,
          description: 'LeetCode username',
          schema: { type: 'string' },
          example: 'alfaarghya',
        },
        limit: {
          name: 'limit',
          in: 'query',
          required: false,
          description: 'Number of results to return (default 20)',
          schema: { type: 'integer', default: 20, minimum: 1 },
          example: 10,
        },
        year: {
          name: 'year',
          in: 'query',
          required: false,
          description: 'Year for calendar data (defaults to current year)',
          schema: { type: 'integer' },
          example: 2025,
        },
        titleSlug: {
          name: 'titleSlug',
          in: 'query',
          required: true,
          description: 'The URL slug of the problem',
          schema: { type: 'string' },
          example: 'two-sum',
        },
        topicId: {
          name: 'topicId',
          in: 'path',
          required: true,
          description: 'The discussion topic ID',
          schema: { type: 'integer' },
          example: 123456,
        },
      },
      schemas: {
        ErrorResponse: {
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
          example: { error: 'User not found' },
        },
        Badge: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            shortName: { type: 'string' },
            displayName: { type: 'string' },
            icon: { type: 'string' },
            creationDate: { type: 'string', format: 'date' },
          },
        },
        SolvedCount: {
          type: 'object',
          properties: {
            solvedProblem: { type: 'integer' },
            easySolved: { type: 'integer' },
            mediumSolved: { type: 'integer' },
            hardSolved: { type: 'integer' },
          },
        },
        ContestInfo: {
          type: 'object',
          properties: {
            contestAttend: { type: 'integer' },
            contestRating: { type: 'number' },
            contestGlobalRanking: { type: 'integer' },
            totalParticipants: { type: 'integer' },
            contestTopPercentage: { type: 'number' },
          },
        },
        Submission: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            titleSlug: { type: 'string' },
            timestamp: { type: 'string' },
            statusDisplay: { type: 'string' },
            lang: { type: 'string' },
          },
        },
        Problem: {
          type: 'object',
          properties: {
            questionId: { type: 'string' },
            questionFrontendId: { type: 'string' },
            title: { type: 'string' },
            titleSlug: { type: 'string' },
            difficulty: { type: 'string', enum: ['Easy', 'Medium', 'Hard'] },
            isPaidOnly: { type: 'boolean' },
            hasSolution: { type: 'boolean' },
            topicTags: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  slug: { type: 'string' },
                },
              },
            },
          },
        },
        SkillStats: {
          type: 'object',
          properties: {
            advanced: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  tagName: { type: 'string' },
                  tagSlug: { type: 'string' },
                  problemsSolved: { type: 'integer' },
                },
              },
            },
            intermediate: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  tagName: { type: 'string' },
                  tagSlug: { type: 'string' },
                  problemsSolved: { type: 'integer' },
                },
              },
            },
            fundamental: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  tagName: { type: 'string' },
                  tagSlug: { type: 'string' },
                  problemsSolved: { type: 'integer' },
                },
              },
            },
          },
        },
        LanguageStats: {
          type: 'object',
          properties: {
            languageProblemCount: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  languageName: { type: 'string' },
                  problemsSolved: { type: 'integer' },
                },
              },
            },
          },
        },
        Contest: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            titleSlug: { type: 'string' },
            startTime: { type: 'integer' },
            duration: { type: 'integer' },
            isVirtual: { type: 'boolean' },
          },
        },
      },
    },
  },
  // Point to all files that contain @openapi annotations
  apis: ['./src/app.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

/**
 * Mounts Swagger UI at /api-docs.
 * Call this BEFORE registering /:username routes in app.ts.
 */
export function setupSwagger(app: Express): void {
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customSiteTitle: 'Alfa-LeetCode API Docs',
      swaggerOptions: {
        docExpansion: 'list',
        filter: true,
        showRequestDuration: true,
      },
    }),
  );

  console.log('[Swagger] Docs available at http://localhost:3000/api-docs');
}
