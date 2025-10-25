import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import {
  getDailyProblem,
  getDailyProblemLegacy,
  getDailyProblemRaw,
  getOfficialSolution,
  getProblemSet,
  getSelectProblem,
  getSelectProblemRaw,
} from '../leetCodeService';
import { runTool, ToolModule } from '../serverUtils';

export class ProblemToolsModule implements ToolModule {
  register(server: McpServer): void {
    server.registerTool(
      'leetcode_problem_daily',
        {
          title: 'Daily Problem',
          description: 'Retrieves the formatted daily challenge',
        },
      async () => runTool(() => getDailyProblem()),
    );

    server.registerTool(
      'leetcode_problem_daily_raw',
        {
          title: 'Daily Problem Raw',
          description: 'Retrieves the raw daily challenge payload',
        },
      async () => runTool(() => getDailyProblemRaw()),
    );

    server.registerTool(
      'leetcode_problem_select',
        {
          title: 'Selected Problem',
          description: 'Fetches formatted data for a problem by slug',
          inputSchema: {
            titleSlug: z.string(),
          },
        },
      async ({ titleSlug }) => runTool(() => getSelectProblem(titleSlug)),
    );

    server.registerTool(
      'leetcode_problem_select_raw',
        {
          title: 'Selected Problem Raw',
          description: 'Fetches raw data for a problem by slug',
          inputSchema: {
            titleSlug: z.string(),
          },
        },
      async ({ titleSlug }) => runTool(() => getSelectProblemRaw(titleSlug)),
    );

    server.registerTool(
      'leetcode_problem_list',
        {
          title: 'Problem List',
          description: 'Retrieves a filtered set of problems',
          inputSchema: {
            limit: z.number().int().positive().max(100).optional(),
            skip: z.number().int().min(0).optional(),
            tags: z.string().optional(),
            difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']).optional(),
          },
        },
      async ({ limit, skip, tags, difficulty }) => runTool(() => getProblemSet({ limit, skip, tags, difficulty })),
    );

    server.registerTool(
      'leetcode_problem_official_solution',
      {
        title: 'Official Solution',
        description: 'Retrieves the official LeetCode solution for a problem',
        inputSchema: {
          titleSlug: z.string(),
        },
      },
      async ({ titleSlug }) => runTool(() => getOfficialSolution(titleSlug)),
    );

    server.registerTool(
      'leetcode_problem_daily_legacy',
      {
        title: 'Daily Problem Legacy',
        description: 'Retrieves the legacy daily challenge payload',
      },
      async () => runTool(() => getDailyProblemLegacy()),
    );
  }
}
