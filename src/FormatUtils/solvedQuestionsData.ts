import type { SolvedQuestion } from '../types';

export const formatSolvedQuestionsData = (
  questions: SolvedQuestion[],
  totalNum: number,
) => ({
  count: questions.length,
  totalSolved: totalNum,
  solvedQuestions: questions.map((question) => ({
    questionFrontendId: question.frontendId,
    title: question.title,
    titleSlug: question.titleSlug,
    link: `https://leetcode.com/problems/${question.titleSlug}`,
    difficulty: question.difficulty,
    lastSubmittedAt: question.lastSubmittedAt,
    numSubmitted: question.numSubmitted,
    topicTags: question.topicTags,
  })),
});
