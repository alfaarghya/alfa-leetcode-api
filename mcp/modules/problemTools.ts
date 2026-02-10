import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import {
  addProblemToFavorite,
  getDailyProblem,
  getDailyProblemLegacy,
  getDailyProblemRaw,
  getOfficialSolution,
  getProblemNote,
  getProblemSet,
  getProblemStatus,
  getSelectProblem,
  getSelectProblemRaw,
  getSubmissionDetails,
  removeProblemFromFavorite,
  updateProblemNote,
} from '../leetCodeService';
import { runTool } from '../serverUtils';
import { ToolModule } from '../types';

export class ProblemToolsModule implements ToolModule {
  // Registers problem-related tools with the MCP server.
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

    // ── Auth-required tools ───────────────────────────────────────────

    server.registerTool(
      'leetcode_submission_details',
      {
        title: 'Submission Details',
        description: '[Auth Required] Full submission: source code, runtime, memory, percentiles, errors',
        inputSchema: {
          submissionId: z.number().int().positive(),
        },
      },
      async ({ submissionId }) => runTool(() => getSubmissionDetails({ submissionId })),
    );

    server.registerTool(
      'leetcode_problem_note',
      {
        title: 'Problem Note',
        description: "[Auth Required] User's personal note on a problem",
        inputSchema: {
          titleSlug: z.string(),
        },
      },
      async ({ titleSlug }) => runTool(() => getProblemNote(titleSlug)),
    );

    server.registerTool(
      'leetcode_problem_note_update',
      {
        title: 'Update Problem Note',
        description: '[Auth Required] Create/update personal note on a problem',
        inputSchema: {
          titleSlug: z.string(),
          note: z.string(),
        },
      },
      async ({ titleSlug, note }) => runTool(() => updateProblemNote({ titleSlug, note })),
    );

    server.registerTool(
      'leetcode_problem_favorite_add',
      {
        title: 'Add to Favorites',
        description: '[Auth Required] Add problem to a favorites list',
        inputSchema: {
          favoriteIdHash: z.string(),
          questionId: z.string(),
        },
      },
      async ({ favoriteIdHash, questionId }) =>
        runTool(() => addProblemToFavorite({ favoriteIdHash, questionId })),
    );

    server.registerTool(
      'leetcode_problem_favorite_remove',
      {
        title: 'Remove from Favorites',
        description: '[Auth Required] Remove problem from a favorites list',
        inputSchema: {
          favoriteIdHash: z.string(),
          questionId: z.string(),
        },
      },
      async ({ favoriteIdHash, questionId }) =>
        runTool(() => removeProblemFromFavorite({ favoriteIdHash, questionId })),
    );

    server.registerTool(
      'leetcode_problem_status',
      {
        title: 'Problem Status',
        description: '[Auth Required] Solve status for a specific problem (ac/notac/null) — lighter than full select',
        inputSchema: {
          titleSlug: z.string(),
        },
      },
      async ({ titleSlug }) => runTool(() => getProblemStatus(titleSlug)),
    );
  }
}
