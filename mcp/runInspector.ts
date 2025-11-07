import { spawn } from 'node:child_process';

const VALID_MODES = new Set(['all', 'users', 'problems', 'discussions']);

const requestedMode = process.argv[2]?.toLowerCase();

if (requestedMode && !VALID_MODES.has(requestedMode)) {
  console.error(`Invalid inspector mode: ${requestedMode}`);
  console.error('Expected one of: all, users, problems, discussions');
  process.exit(1);
}

const mode = requestedMode ?? 'all';

const commandParts = ['npx', '-y', '@modelcontextprotocol/inspector', 'npx', 'ts-node', 'mcp/index.ts'];

if (mode !== 'all') {
  commandParts.push(mode);
}

const child = spawn(commandParts.join(' '), {
  stdio: 'inherit',
  shell: true,
});

child.on('exit', (code) => {
  process.exit(code ?? 0);
});

child.on('error', (error) => {
  console.error('Failed to launch MCP Inspector', error);
  process.exit(1);
});
