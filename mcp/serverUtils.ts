import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

type GraphQLParams = Record<string, unknown>;

const GRAPHQL_ENDPOINT = 'https://leetcode.com/graphql';
export const SERVER_VERSION = '2.0.1';

export class GraphQLClientError extends Error {
  readonly status: number;
  readonly body: unknown;

  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

export async function executeGraphQL(query: string, variables: GraphQLParams = {}): Promise<unknown> {
  const requestInit: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Referer: 'https://leetcode.com',
    },
    body: JSON.stringify({ query, variables }),
  };

  const response = await fetch(GRAPHQL_ENDPOINT, requestInit);
  const payload = await response.json();

  if (!response.ok) {
    throw new GraphQLClientError('HTTP error when calling LeetCode GraphQL', response.status, payload);
  }

  if (payload?.errors) {
    throw new GraphQLClientError('LeetCode GraphQL responded with errors', response.status, payload);
  }

  return payload.data;
}

export function toToolContent(data: unknown): { type: 'text'; text: string }[] {
  return [{ type: 'text', text: JSON.stringify(data, null, 2) }];
}

export function createToolResult(data: unknown): {
  content: { type: 'text'; text: string }[];
} {
  return {
    content: toToolContent(data),
  };
}

export function createErrorResult(error: unknown): {
  content: { type: 'text'; text: string }[];
} {
  if (error instanceof GraphQLClientError) {
    const payload = {
      message: error.message,
      status: error.status,
      response: error.body,
    };
    return createToolResult(payload);
  }

  if (error instanceof Error) {
    return createToolResult({ message: error.message });
  }

  return createToolResult({ message: 'Unknown error', detail: error });
}

export type ToolResponse = { content: { type: 'text'; text: string }[] };

export type ToolExecutor = () => Promise<unknown>;

export async function runTool(executor: ToolExecutor): Promise<ToolResponse> {
  try {
    const data = await executor();
    return createToolResult(data);
  } catch (error) {
    return createErrorResult(error);
  }
}

export interface ToolModule {
  register(server: McpServer): void;
}

export async function startServer(
  serverInfo: { name: string; version?: string },
  modules: ToolModule[],
): Promise<void> {
  const server = new McpServer({
    name: serverInfo.name,
    version: serverInfo.version ?? SERVER_VERSION,
  });

  for (const module of modules) {
    module.register(server);
  }

  const transport = new StdioServerTransport();
  await server.connect(transport);
}
