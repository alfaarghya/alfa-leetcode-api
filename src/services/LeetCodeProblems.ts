import {
  dailyProblemQuery,
  problemListQuery,
  selectProblemQuery,
  tagsQuery,
} from '../GQLQueries';
import { executeGraphQL } from '../internal/graphqlClient';
import {
  ProblemDetail,
  ProblemListResult,
  ProblemSummary,
  ProblemTag,
  TopicTag,
} from './dto';

interface RawTopicTag {
  name: string;
  slug: string;
}

interface RawQuestion {
  questionId: string;
  questionFrontendId: string;
  title: string;
  titleSlug: string;
  content: string;
  isPaidOnly: boolean;
  difficulty: string;
  likes: number;
  dislikes: number;
  similarQuestions: string;
  exampleTestcases: string;
  topicTags: RawTopicTag[];
  companyTagStats: string | null;
  hints: string[];
}

interface RawDailyProblem {
  activeDailyCodingChallengeQuestion: {
    date: string;
    question: RawQuestion;
  };
}

interface RawSelectedProblem {
  question: RawQuestion;
}

interface RawProblemListEntry {
  acRate: number;
  difficulty: string;
  questionFrontendId: string;
  isPaidOnly: boolean;
  title: string;
  titleSlug: string;
  topicTags: RawTopicTag[];
  hasSolution: boolean;
  hasVideoSolution: boolean;
}

interface RawProblemList {
  problemsetQuestionList: {
    total: number;
    questions: RawProblemListEntry[];
  };
}

interface RawTags {
  questionTopicTags: { edges: { node: RawTopicTag }[] };
}

function toTopicTag(tag: RawTopicTag): TopicTag {
  return Object.assign(new TopicTag(), { name: tag.name, slug: tag.slug });
}

function toProblemDetail(
  question: RawQuestion,
  publishedAt: string,
): ProblemDetail {
  return Object.assign(new ProblemDetail(), {
    problemUrl: `https://leetcode.com/problems/${question.titleSlug}`,
    questionId: question.questionId,
    questionFrontendId: question.questionFrontendId,
    title: question.title,
    titleSlug: question.titleSlug,
    difficulty: question.difficulty,
    isPaidOnly: question.isPaidOnly,
    contentHtml: question.content,
    exampleTestcases: question.exampleTestcases,
    topicTags: question.topicTags.map(toTopicTag),
    hints: question.hints,
    companyTagStatsJson: question.companyTagStats ?? '',
    similarQuestionsJson: question.similarQuestions,
    likes: question.likes,
    dislikes: question.dislikes,
    publishedAt,
  });
}

/** LeetCode problem catalog: the daily challenge, a single problem by slug, paginated/filtered problem lists, and the full tag list. */
// biome-ignore lint/complexity/noStaticOnlyClass: static methods on a class are the Graftcode-recommended stateless facade shape.
export class LeetCodeProblems {
  static async getDailyProblem(): Promise<ProblemDetail> {
    const data = await executeGraphQL<RawDailyProblem>(dailyProblemQuery, {});
    const { date, question } = data.activeDailyCodingChallengeQuestion;
    return toProblemDetail(question, date);
  }

  static async getProblem(titleSlug: string): Promise<ProblemDetail> {
    const data = await executeGraphQL<RawSelectedProblem>(selectProblemQuery, {
      titleSlug,
    });
    return toProblemDetail(data.question, '');
  }

  /** limit/skip paginate; tags is space-separated slugs, e.g. array string, pass an empty string for no filter; difficulty is EASY, MEDIUM or HARD, empty string for no filter. */
  static async getProblems(
    limit: number,
    skip: number,
    tags: string,
    difficulty: string,
  ): Promise<ProblemListResult> {
    const data = await executeGraphQL<RawProblemList>(problemListQuery, {
      categorySlug: '',
      limit,
      skip,
      filters: {
        tags: tags.length > 0 ? tags.split(' ') : [],
        difficulty: difficulty.length > 0 ? difficulty : undefined,
      },
    });

    const summaries: ProblemSummary[] =
      data.problemsetQuestionList.questions.map((q) =>
        Object.assign(new ProblemSummary(), {
          questionFrontendId: q.questionFrontendId,
          title: q.title,
          titleSlug: q.titleSlug,
          difficulty: q.difficulty,
          isPaidOnly: q.isPaidOnly,
          acceptanceRate: q.acRate,
          topicTags: q.topicTags.map(toTopicTag),
          hasSolution: q.hasSolution,
          hasVideoSolution: q.hasVideoSolution,
        }),
      );

    return Object.assign(new ProblemListResult(), {
      totalCount: data.problemsetQuestionList.total,
      problems: summaries,
    });
  }

  static async getTags(): Promise<ProblemTag[]> {
    const data = await executeGraphQL<RawTags>(tagsQuery, {});
    return data.questionTopicTags.edges.map((edge) =>
      Object.assign(new ProblemTag(), {
        name: edge.node.name,
        slug: edge.node.slug,
      }),
    );
  }
}
