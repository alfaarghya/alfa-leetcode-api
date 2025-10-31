import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { getDiscussComments, getDiscussTopic, getTrendingTopics } from '../leetCodeService';
import { runTool } from '../serverUtils';
import { ToolModule } from '../types';

export class DiscussionToolsModule implements ToolModule {
  // Registers discussion-related tools with the MCP server.
  register(server: McpServer): void {
    server.registerTool(
        'leetcode_discuss_trending',
      {
        title: 'Trending Discussions',
        description: 'Lists trending discussion topics',
        inputSchema: {
          first: z.number().int().positive().max(50).optional(),
        },
      },
      async ({ first }) => runTool(() => getTrendingTopics(first ?? 20)),
    );

    server.registerTool(
        'leetcode_discuss_topic',
      {
        title: 'Discussion Topic',
        description: 'Retrieves full topic details by topic id',
        inputSchema: {
          topicId: z.number().int().positive(),
        },
      },
      async ({ topicId }) => runTool(() => getDiscussTopic(topicId)),
    );

    server.registerTool(
        'leetcode_discuss_comments',
      {
        title: 'Discussion Comments',
        description: 'Retrieves comments for a discussion topic',
        inputSchema: {
          topicId: z.number().int().positive(),
          orderBy: z.string().optional(),
          pageNo: z.number().int().positive().optional(),
          numPerPage: z.number().int().positive().max(50).optional(),
        },
      },
      async ({ topicId, orderBy, pageNo, numPerPage }) =>
        runTool(() => getDiscussComments({ topicId, orderBy, pageNo, numPerPage })),
    );
  }
}
