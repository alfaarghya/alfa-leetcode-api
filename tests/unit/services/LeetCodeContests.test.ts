import { describe, expect, it } from 'vitest';
import { LeetCodeContests } from '../../../src/services/LeetCodeContests';

describe('LeetCodeContests', () => {
  describe('getAllContests', () => {
    it('maps GraphQL contests into graft-safe Contest DTOs', async () => {
      const contests = await LeetCodeContests.getAllContests();

      expect(contests).toEqual([
        {
          title: 'Weekly Contest 300',
          titleSlug: 'weekly-contest-300',
          startsAt: new Date(1659200400 * 1000).toISOString(),
          durationSeconds: 5400,
          isVirtual: false,
          containsPremium: false,
        },
        {
          title: 'Biweekly Contest 82',
          titleSlug: 'biweekly-contest-82',
          startsAt: new Date(1659286800 * 1000).toISOString(),
          durationSeconds: 5400,
          isVirtual: false,
          containsPremium: false,
        },
      ]);
    });

    it('converts startTime from unix-epoch seconds to an ISO-8601 string', async () => {
      const [first] = await LeetCodeContests.getAllContests();

      expect(first.startsAt).toBe(new Date(1659200400 * 1000).toISOString());
    });
  });

  describe('getUpcomingContests', () => {
    it('filters out contests that already started', async () => {
      // The msw fixture's contests are both in the past, so "upcoming" is empty.
      const upcoming = await LeetCodeContests.getUpcomingContests();

      expect(upcoming).toEqual([]);
    });
  });
});
