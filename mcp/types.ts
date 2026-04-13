import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

/**
 * Represents the mode for running the MCP server.
 * - 'all': Run all modules
 * - 'users': Run only user-related tools
 * - 'problems': Run only problem-related tools
 * - 'discussions': Run only discussion-related tools
 */
export type Mode = 'all' | 'users' | 'problems' | 'discussions';

/**
 * Configuration for the modules to be loaded in the server.
 */
export type ModuleConfig = {
  modules: ToolModule[];
  name: string;
};

/**
 * Arguments for submission-related functions.
 */
export type SubmissionArgs = { username: string; limit?: number };

/**
 * Arguments for calendar-related functions.
 */
export type CalendarArgs = { username: string; year: number };

/**
 * Arguments for problem list functions.
 */
export type ProblemArgs = { limit?: number; skip?: number; tags?: string; difficulty?: string };

/**
 * Arguments for discussion comments functions.
 */
export type DiscussCommentsArgs = { topicId: number; orderBy?: string; pageNo?: number; numPerPage?: number };

/**
 * Type for GraphQL variables.
 */
export type Variables = Record<string, unknown>;

/**
 * Type for GraphQL parameters.
 */
export type GraphQLParams = Record<string, unknown>;

/**
 * Custom error class for GraphQL client errors.
 */
export class GraphQLClientError extends Error {
  readonly status: number;
  readonly body: unknown;

  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

/**
 * Response type for tools.
 */
export type ToolResponse = { content: { type: 'text'; text: string }[] };

/**
 * Executor function type for tools.
 */
export type ToolExecutor = () => Promise<unknown>;

/**
 * Interface for tool modules that can register with the MCP server.
 */
export interface ToolModule {
  register(server: McpServer): void;
}

/**
 * Arguments for submission detail lookups (auth required).
 */
export type SubmissionDetailArgs = { submissionId: number };

/**
 * Arguments for question note operations (auth required).
 */
export type QuestionNoteArgs = { titleSlug: string; note?: string };

/**
 * Arguments for favorite toggle operations (auth required).
 */
export type ToggleFavoriteArgs = { favoriteIdHash: string; questionId: string };