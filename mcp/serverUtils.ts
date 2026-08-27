import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { GraphQLClientError, ToolResponse, ToolExecutor, ToolModule } from './types';

export const SERVER_VERSION = '1.0.0';

// The LeetCode GraphQL client now lives in src/internal so it can be shared
// with the Graftcode service layer (src/services/*) instead of being
// duplicated. Re-exported here so existing imports (`./serverUtils`) keep working.
export { executeGraphQL } from '../src/internal/graphqlClient';

// Converts data to tool content format.
export function toToolContent(data: unknown): { type: 'text'; text: string }[] {
  return [{ type: 'text', text: JSON.stringify(data, null, 2) }];
}

// Creates a tool result from data.
export function createToolResult(data: unknown): {
  content: { type: 'text'; text: string }[];
} {
  return {
    content: toToolContent(data),
  };
}

// Creates an error tool result from an error.
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

// Runs a tool executor and handles errors.
export async function runTool(executor: ToolExecutor): Promise<ToolResponse> {
  try {
    const data = await executor();
    return createToolResult(data);
  } catch (error) {
    return createErrorResult(error);
  }
}

// Starts the MCP server with the given modules.
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
