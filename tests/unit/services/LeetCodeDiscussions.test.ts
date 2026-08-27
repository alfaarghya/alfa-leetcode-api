import { describe, expect, it } from 'vitest';
import { LeetCodeDiscussions } from '../../../src/services/LeetCodeDiscussions';

describe('LeetCodeDiscussions', () => {
  describe('getTrendingTopics', () => {
    it('maps GraphQL trending topics into graft-safe TrendingTopic DTOs', async () => {
      const topics = await LeetCodeDiscussions.getTrendingTopics(10);

      // Note: the fixture encodes id/post.id as JSON strings (LeetCode's actual
      // GraphQL shape), so despite RawTrendingTopic typing them as `number` the
      // mapping copies them through as-is - documenting current behavior here.
      expect(topics).toEqual([
        {
          topicId: '12345',
          title: 'How to solve Two Sum efficiently?',
          postId: '67890',
          postedAt: new Date(1659200400 * 1000).toISOString(),
          contentPreview:
            'I found an interesting way to solve the Two Sum problem using hash maps...',
          authorUsername: 'codingmaster',
          authorIsActive: true,
          authorAvatarUrl:
            'https://assets.leetcode.com/users/default_avatar.jpg',
        },
        {
          topicId: '12346',
          title: 'Dynamic Programming Tips and Tricks',
          postId: '67891',
          postedAt: new Date(1659200500 * 1000).toISOString(),
          contentPreview: 'Here are some useful patterns for DP problems...',
          authorUsername: 'algoexpert',
          authorIsActive: true,
          authorAvatarUrl:
            'https://assets.leetcode.com/users/default_avatar.jpg',
        },
      ]);
    });
  });
});
