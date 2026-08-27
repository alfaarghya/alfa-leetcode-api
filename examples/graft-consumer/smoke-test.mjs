// Consumes alfa-leetcode-api's Graftcode surface as a strongly-typed client.
//
// No hand-written fetch call, no hand-written response types: `npm install` below
// pulls a generated client whose classes/methods mirror `src/services/*` exactly,
// and `Contest`'s fields are read the same way as any local object.
//
// Install (GUID rotates per gateway restart - always copy the current command
// from the running gateway's `/npm` route, e.g. `curl http://<host>:<port>/npm`):
//   npm install --registry https://grft.dev/<GUID>__free @graft/npm-alfa-leetcode-api-graft@1.0.0
//
// Run: node smoke-test.mjs
import { Contest, GraftConfig, LeetCodeContests } from '@graft/npm-alfa-leetcode-api-graft';

// Points the client at the gg gateway hosting src/services (see docker-compose.yml's
// `graft` service). The gateway logs its exact WS URL on startup as
// `ws://localhost:<port>/ws` - copy it from there rather than guessing the path.
GraftConfig.host = 'ws://localhost:8080/ws';

// This graft surface is a stateless static-method facade (see GRAFTCODE.md), so we
// use non-stateless field access here: each `Contest` field read is a normal typed
// remote call, no manual JSON parsing or field-name typos possible.
GraftConfig.stateless = false;

const upcoming = await LeetCodeContests.getUpcomingContests();

const contests = await Promise.all(
  upcoming.map(async (item) => {
    const contest = new Contest(item);
    return {
      title: await contest.title,
      titleSlug: await contest.titleSlug,
      startsAt: await contest.startsAt, // already ISO-8601, unlike the REST endpoint's raw epoch seconds
      durationSeconds: await contest.durationSeconds,
      isVirtual: await contest.isVirtual,
      containsPremium: await contest.containsPremium,
    };
  }),
);

console.log(JSON.stringify(contests, null, 2));
process.exit(0);
