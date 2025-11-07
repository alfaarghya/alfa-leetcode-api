import { DiscussionToolsModule } from './modules/discussionTools';
import { ProblemToolsModule } from './modules/problemTools';
import { UserToolsModule } from './modules/userTools';
import { SERVER_VERSION, startServer } from './serverUtils';
import { Mode, ModuleConfig, ToolModule } from './types';

const modulesByKey: Record<Exclude<Mode, 'all'>, ToolModule> = {
  users: new UserToolsModule(),
  problems: new ProblemToolsModule(),
  discussions: new DiscussionToolsModule(),
};

// Normalizes the input mode string to a valid Mode type.
function normalizeMode(input: string | undefined): Mode {
  if (!input) {
    return 'all';
  }

  const normalized = input.trim().toLowerCase();

  if (normalized === 'all' || normalized === 'suite' || normalized === 'default') {
    return 'all';
  }

  if (normalized in modulesByKey) {
    return normalized as Exclude<Mode, 'all'>;
  }

  console.error(`Unknown MCP server mode: ${input}`);
  console.error('Expected one of: all, users, problems, discussions');
  process.exit(1);
}

// Resolves the modules and server name based on the selected mode.
function resolveModules(mode: Mode): ModuleConfig {
  if (mode === 'all') {
    return {
      modules: Object.values(modulesByKey),
      name: 'alfa-leetcode-suite',
    };
  }

  return {
    modules: [modulesByKey[mode]],
    name: `alfa-leetcode-${mode}`,
  };
}

// Main entry point for the MCP server. Parses command line arguments, sets up modules, and starts the server.
async function main() {
  const modeInput = process.env.MCP_SERVER_MODE ?? process.argv[2];
  const mode = normalizeMode(modeInput);
  const { modules, name } = resolveModules(mode);

  await startServer({ name, version: SERVER_VERSION }, modules);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
