import { describe, it, expect } from 'vitest';
import { formatTrendingCategoryTopicData } from '../../../src/FormatUtils/trendingTopicData';

describe('trendingTopicData FormatUtils', () => {
  describe('formatTrendingCategoryTopicData', () => {
    it('should return data unchanged', () => {
      const input = {
        categoryTopicList: {
          edges: [
            {
              node: {
                id: '1',
                title: 'How to solve Two Sum?',
                commentCount: 10,
                viewCount: 1000,
              },
            },
            {
              node: {
                id: '2',
                title: 'Best approach for Binary Search',
                commentCount: 5,
                viewCount: 500,
              },
            },
          ],
        },
      };

      const result = formatTrendingCategoryTopicData(input as any);

      expect(result).toEqual(input);
      expect(result).toBe(input);
    });

    it('should handle empty topic list', () => {
      const input = {
        categoryTopicList: {
          edges: [],
        },
      };

      const result = formatTrendingCategoryTopicData(input as any);

      expect(result).toEqual(input);
    });

    it('should not modify the original object', () => {
      const input = {
        categoryTopicList: {
          edges: [
            {
              node: {
                id: '1',
                title: 'Test Topic',
              },
            },
          ],
        },
      };

      const original = JSON.parse(JSON.stringify(input));
      const result = formatTrendingCategoryTopicData(input as any);

      expect(result).toEqual(original);
    });

    it('should handle null and undefined values', () => {
      const input = {
        categoryTopicList: {
          edges: [
            {
              node: {
                id: '1',
                title: 'Topic with null values',
                commentCount: null,
                viewCount: undefined,
              },
            },
          ],
        },
      };

      const result = formatTrendingCategoryTopicData(input as any);

      expect(result).toEqual(input);
    });
  });
});
