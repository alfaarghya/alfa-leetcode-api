const GRAPHQL_ENDPOINT = 'https://leetcode.com/graphql';

/**
 * Kept out of the public Graftcode surface (`src/services/index.ts` never
 * re-exports it). Graftcode does not yet generate grafts for custom
 * exception types, so custom errors must stay module-private; the gateway
 * converts a thrown error into a plain error for the caller, with the
 * message preserved.
 */
export class GraphQLClientError extends Error {
  readonly status: number;
  readonly body: unknown;

  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.name = 'GraphQLClientError';
    this.status = status;
    this.body = body;
  }
}

export type GraphQLVariables = Record<string, unknown>;

/**
 * Shared LeetCode GraphQL client. Used by both the MCP server
 * (`mcp/leetCodeService.ts`) and the Graftcode service layer
 * (`src/services/*`) so there is a single place that knows how to call
 * leetcode.com/graphql. The REST controllers under `src/Controllers` predate
 * this and are intentionally left as-is in this change.
 */
export async function executeGraphQL<T = unknown>(
  query: string,
  variables: GraphQLVariables = {},
): Promise<T> {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Referer: 'https://leetcode.com',
    },
    body: JSON.stringify({ query, variables }),
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new GraphQLClientError(
      'HTTP error when calling LeetCode GraphQL',
      response.status,
      payload,
    );
  }

  if (payload?.errors) {
    throw new GraphQLClientError(
      'LeetCode GraphQL responded with errors',
      response.status,
      payload,
    );
  }

  return payload.data as T;
}
