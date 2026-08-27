import { trendingDiscussQuery } from '../GQLQueries';
import { executeGraphQL } from '../internal/graphqlClient';
import { TrendingTopic } from './dto';

interface RawTrendingTopic {
  id: number;
  title: string;
  post: {
    id: number;
    creationDate: number;
    contentPreview: string;
    author: {
      username: string;
      isActive: boolean;
      profile: { userAvatar: string };
    };
  };
}

interface RawTrendingDiscuss {
  cachedTrendingCategoryTopics: RawTrendingTopic[];
}

/** LeetCode discussion board: trending topics. */
// biome-ignore lint/complexity/noStaticOnlyClass: static methods on a class are the Graftcode-recommended stateless facade shape.
export class LeetCodeDiscussions {
  static async getTrendingTopics(first: number): Promise<TrendingTopic[]> {
    const data = await executeGraphQL<RawTrendingDiscuss>(
      trendingDiscussQuery,
      { first },
    );

    return data.cachedTrendingCategoryTopics.map((topic) =>
      Object.assign(new TrendingTopic(), {
        topicId: topic.id,
        title: topic.title,
        postId: topic.post.id,
        postedAt: new Date(topic.post.creationDate * 1000).toISOString(),
        contentPreview: topic.post.contentPreview,
        authorUsername: topic.post.author.username,
        authorIsActive: topic.post.author.isActive,
        authorAvatarUrl: topic.post.author.profile.userAvatar,
      }),
    );
  }
}
