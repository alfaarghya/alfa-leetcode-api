import {
  DailyProblemData,
  ProblemSetQuestionListData,
  SelectProblemData,
} from '../types';

export const formatDailyData = (data: DailyProblemData) => ({
  questionLink:
    `https://leetcode.com` + data.activeDailyCodingChallengeQuestion.link,
  date: data.activeDailyCodingChallengeQuestion.date,
  questionId: data.activeDailyCodingChallengeQuestion.question.questionId,
  questionFrontendId:
    data.activeDailyCodingChallengeQuestion.question.questionFrontendId,
  questionTitle: data.activeDailyCodingChallengeQuestion.question.title,
  titleSlug: data.activeDailyCodingChallengeQuestion.question.titleSlug,
  difficulty: data.activeDailyCodingChallengeQuestion.question.difficulty,
  isPaidOnly: data.activeDailyCodingChallengeQuestion.question.isPaidOnly,
  question: data.activeDailyCodingChallengeQuestion.question.content,
  exampleTestcases:
    data.activeDailyCodingChallengeQuestion.question.exampleTestcases,
  topicTags: data.activeDailyCodingChallengeQuestion.question.topicTags,
  hints: data.activeDailyCodingChallengeQuestion.question.hints,
  solution: data.activeDailyCodingChallengeQuestion.question.solution,
  companyTagStats:
    data.activeDailyCodingChallengeQuestion.question.companyTagStats,
  likes: data.activeDailyCodingChallengeQuestion.question.likes,
  dislikes: data.activeDailyCodingChallengeQuestion.question.dislikes,
  similarQuestions:
    data.activeDailyCodingChallengeQuestion.question.similarQuestions,
});

export const formatQuestionData = (data: SelectProblemData) => ({
  link: `https://leetcode.com/problems/` + data.question.titleSlug,
  questionId: data.question.questionId,
  questionFrontendId: data.question.questionFrontendId,
  questionTitle: data.question.title,
  titleSlug: data.question.titleSlug,
  difficulty: data.question.difficulty,
  isPaidOnly: data.question.isPaidOnly,
  question: data.question.content,
  exampleTestcases: data.question.exampleTestcases,
  topicTags: data.question.topicTags,
  hints: data.question.hints,
  solution: data.question.solution,
  companyTagStats: data.question.companyTagStats,
  likes: data.question.likes,
  dislikes: data.question.dislikes,
  similarQuestions: data.question.similarQuestions,
});

export const formatProblemsData = (data: ProblemSetQuestionListData) => ({
  totalQuestions: data.problemsetQuestionList.total,
  count: data.problemsetQuestionList.questions.length,
  problemsetQuestionList: data.problemsetQuestionList.questions,
});

