<h1 align="center">Graftcode Integration 🔗</h1>

The repository also ships a [Graftcode](https://graftcode.com) surface: the same LeetCode data as the REST API and MCP server, but exposed as a **strongly-typed client** for any Graftcode-supported language instead of a hand-written HTTP consumer. Install one package and call typed methods - no endpoint URLs, no response shapes to guess, no manual timestamp parsing.

This is purely additive. `src/Controllers`, `src/app.ts` and `mcp/*` are unchanged; the graft is a third surface sitting next to REST and MCP, backed by the same `src/internal/graphqlClient.ts`.

## What's exposed

`src/services/` contains four stateless, static-method service classes - the Graftcode contract *is* their public methods and the DTOs in `src/services/dto.ts` (primitives, strings, and plain arrays only, per Graftcode's rules):

| Service               | Methods                                                                                                                                                          |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `LeetCodeUsers`        | `getProfile`, `getBadges`, `getSolvedProblems`, `getRecentSubmissions`, `getRecentAcceptedSubmissions`, `getSubmissionCalendar`, `getSkillStats`, `getLanguageStats`, `getProgress`, `getContestSummary`, `getContestHistory` |
| `LeetCodeProblems`     | `getDailyProblem`, `getProblem`, `getProblems`, `getTags`                                                                                                       |
| `LeetCodeContests`     | `getAllContests`, `getUpcomingContests`                                                                                                                         |
| `LeetCodeDiscussions`  | `getTrendingTopics`                                                                                                                                              |

Deliberately **excluded**: the `/raw` endpoints, `discussComments`, and the deprecated `*_` handlers - they return unshaped GraphQL JSON that can't be expressed as a typed contract.

## Build

```powershell
npm install
npm run build:graft
```

`build:graft` compiles just `src/services`, `src/GQLQueries` and `src/internal` with `tsconfig.graft.json` (`declaration: true`) into `dist-graft/`. Declaration files are required here: [Graftcode Gateway](https://github.com/grft-dev/graftcode-gateway) (`gg`) statically analyzes the compiled output to build the contract, and without `.d.ts` files it can only see untyped JS and falls back to `any`-typed methods.

## Host it with `gg`

A `graft` Docker stage and a `graft` service in `docker-compose.yml` package the compiled services with the `gg` binary:

```powershell
docker compose up graft
```

This exposes:

- Port `8080` (container port `80`) - the WebSocket endpoint gg logs as `ws://localhost:80/ws` (replace `80` with whichever host port you mapped it to), used for real graft calls.
- Port `8081` (container port `81`) - [Graftcode Vision](https://docs.graftcode.com), a browser UI for exploring and testing the exposed methods live.

### Verifying the contract before starting a server

Before standing up a full gateway, `gg` can analyze the module and print the generated IDL/discovery payload with `--graftOnly` - no ports, no Vision, no `docker run -d` needed:

```bash
gg --graftOnly --modules ./package.json --runtime nodejs
```

This is what was used while iterating on `src/services/dto.ts` - e.g. it's how the switch from `interface` to `class` DTOs (needed so the analyzer can see field names/types) was verified before ever starting a live container.

### Confirming a live gateway

Once a real gateway is running, confirm the contract and grab the install command directly from it (GUID rotates per restart since no `--projectKey` is configured):

```bash
curl http://localhost:8080/npm
curl http://localhost:8080/libraries   # full UGM contract - save to a file and grep, it's large
```

## Consuming the graft

```bash
npm install --registry https://grft.dev/<GUID>__free @graft/npm-alfa-leetcode-api-graft@1.0.0
```

```js
import { Contest, GraftConfig, LeetCodeContests } from '@graft/npm-alfa-leetcode-api-graft';

GraftConfig.host = 'ws://<gateway-host>:<port>/ws';
GraftConfig.stateless = false;

const upcoming = await LeetCodeContests.getUpcomingContests();
const first = new Contest(upcoming[0]);

console.log(await first.title, await first.startsAt); // startsAt is already ISO-8601
```

See [`examples/graft-consumer/`](examples/graft-consumer) for a complete, runnable example with a before/after comparison against today's hand-written `fetch` consumer.

## Notes

- The REST layer's 120 req/hour per-IP rate limit lives in Express middleware and does not apply to the graft path - it's a direct call into `src/services`, bypassing HTTP entirely.
- Instance field reads on returned DTOs (e.g. `contest.title` above) are real per-field remote calls under the hood, driven by the generated client's remote-object model - this is normal for Graftcode's stateful client shape and does not require any extra code in `src/services`.
