<h1 align="center">MCP Server Integration 🤖</h1>

The repository also ships a Model Context Protocol (MCP) server that exposes the same LeetCode data as interactive tools for Claude Desktop or the MCP Inspector.

## Build

```powershell
npm install
npm run build
```

The build step produces `dist/mcp/index.js`, the entry point used by MCP clients.

## MCP client setup

1. The configuration is the same across operating systems as long as your MCP client is installed and supports external servers (Claude Desktop, Cursor, Windsurf, etc.).

2. Add a server entry pointing at the built file by pasting the JSON below into your MCP client's config file — for example:

   - `claude_desktop_config.json` for Claude Desktop
   - `mcp.json` for Cursor
   - the equivalent JSON config file for other MCP clients

   Example (paste into the appropriate file):

   ```json
   {
     "mcpServers": {
       "leetcode-suite": {
         "command": "node",
         "args": ["C:\\path\\to\\alfa-leetcode-api\\dist\\mcp\\index.js"]
       }
     }
   }
   ```

3. Restart your MCP client. A "Search & tools" toggle (or similar UI element) should appear once the server launches successfully.

To run only a subset of tools, append the module name (`users`, `problems`, or `discussions`) as an extra argument or set the `MCP_SERVER_MODE` environment variable.

## MCP Inspector

Use the Inspector to debug tools locally:

```powershell
npx @modelcontextprotocol/inspector node C:\path\to\alfa-leetcode-api\dist\mcp\index.js
```

For TypeScript-on-the-fly development:

```powershell
npx @modelcontextprotocol/inspector npx ts-node mcp/index.ts
```

Choose the _Tools_ tab in the Inspector UI to invoke individual operations and confirm responses before wiring them into Claude.
